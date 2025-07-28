import { createSseStream } from '@/app/lib/sse';
import { uploadToBlob } from '@/app/lib/blob';
import { extractDocx } from '@/app/lib/docx';
import { extractPdf } from '@/app/lib/pdf';
import { analyzeDocumentStream } from '@/app/lib/claude';
import { createAnalysisPage } from '@/app/lib/notion';
import { sendChannelMessage } from '@/app/lib/telegram';
import { SubmissionPayload } from '@/app/types';
import { buildChannelPost } from '@/app/lib/telegram';
import { AnalyzeBodySchema, AnalyzeBody } from '@/app/lib/validation';
import { selectPdfImages, SelectedImage, selectDocChunks, SelectedChunk } from '@/app/lib/claude';
import { detectDiagrams } from '@/app/lib/diagrams';
import { setCache } from '@/app/lib/cache';
import { ReviewRequest } from '@/app/types';
import crypto from 'crypto';
import { config } from '@/app/lib/config';
import { getPdfPagesInfo } from '@/app/lib/pdf';
import { chunkMarkdown, DocChunk } from '@/app/lib/documentation';
import { Buffer } from 'buffer';

export async function POST(req: Request) {
  const json = await req.json();
  const parseRes = AnalyzeBodySchema.safeParse(json);
  if (!parseRes.success) {
    return new Response('Invalid payload', { status: 400 });
  }
  const body = parseRes.data;

  // Генерируем requestId сразу, чтобы создать запись заявки
  const requestId = crypto.randomUUID();

  // Первичная запись заявки в KV (pending)
  const initialReview: ReviewRequest = {
    id: requestId,
    createdAt: Date.now(),
    status: 'pending',
    notionPageId: undefined,
    notionUrl: undefined,
    analysis: undefined,
    requester: { username: body.payload.telegramUsername.replace('@', '') },
    telegram: {},
    // поля SubmissionPayload
    ...body.payload,
  } as ReviewRequest;
  await setCache(`review:${requestId}`, initialReview, 60 * 60 * 24);

  if (!body?.file?.data) {
    return new Response('file required', { status: 400 });
  }

  const stream = createSseStream(async (send, close) => {
    // Pre-allocate mutable containers used across multiple steps
    let selectedImages: SelectedImage[] = [];
    let allChunks: DocChunk[] = [];
    let selectedChunksMeta: SelectedChunk[] = [];
    let diagramFindings: any[] | undefined = undefined;
    try {
      send('status', { stage: 'uploading', progress: 5, message: 'Uploading file to blob' });
      const buffer = Buffer.from(body.file.data, 'base64');
      const blobUrl = await uploadToBlob(buffer, body.file.name);

      const processingStage = body.file.type === 'application/pdf' ? 'processing-pdf' : 'processing-docx';
      send('status', { stage: processingStage, progress: 20, message: 'Extracting text' });
      let extractedText = '';
      if (body.file.type === 'application/pdf') {
        const { text } = await extractPdf(buffer);
        extractedText = text;

        // Select images
        const pagesInfo = await getPdfPagesInfo(buffer);
        send('status', { stage: 'selecting-images', progress: 40, message: 'Selecting PDF images' });
        selectedImages = [];
        try {
          const sel = await selectPdfImages(pagesInfo, config.anthropic.maxImages);
          selectedImages = sel.map((s: any) => ({ page: s.page, url: pagesInfo.find(p => p.page === s.page)?.url || '' }));
        } catch {}

        // Detect diagrams on first N pages
        try {
          const diagPages = pagesInfo.slice(0, config.pdf.maxDiagramPages).map(p => ({ index: p.page, imageUrl: p.url }));
          diagramFindings = await detectDiagrams(diagPages);
        } catch {}
      } else if (body.file.type.includes('wordprocessingml')) {
        extractedText = await extractDocx(buffer);
      }

      if (body.documentation?.rawMarkdown) {
        send('status', { stage: 'selecting-chunks', progress: 50, message: 'Selecting doc chunks' });
        allChunks = chunkMarkdown(body.documentation.rawMarkdown);
        const chunksMeta = allChunks.map(c => ({ id: c.id, title: c.title, size: c.size, preview: c.preview }));
        try {
          selectedChunksMeta = await selectDocChunks(chunksMeta);
        } catch {}
      }

      send('status', { stage: 'analyzing', progress: 60, message: 'Running AI analysis' });
      const selectedChunkIds = selectedChunksMeta.map((s) => s.id);
      const selectedChunksFull = allChunks.filter((c) => selectedChunkIds.includes(c.id));
      const docSummary = extractedText.slice(0,5000);

      let analysis:any;
      analysis = await analyzeDocumentStream(
        { docSummary, selectedChunks: selectedChunksFull, images: selectedImages },
        (token) => send('token', token)
      );
      if (diagramFindings) {
        analysis.diagramFindings = diagramFindings;
      }

      // PromptContextLog
      const promptContextLog = {
        docSummaryUsed: docSummary,
        selectedDocChunks: selectedChunksMeta.map((s) => ({ id: s.id, title: allChunks.find(c=>c.id===s.id)?.title||'', reason: s.reason })),
        selectedImages: selectedImages.map((i) => ({ page: i.page, url: i.url, reason: 'selected by model' })),
        tokenEstimate: { input: 0 },
      };
      await setCache(`prompt-log:${requestId}`, promptContextLog, 60*60*24);

      send('status', { stage: 'creating-notion', progress: 80, message: 'Creating Notion page' });
      const page = await createAnalysisPage(body.payload, analysis);
      // Append PromptContextLog block (simple paragraph)
      await fetch('https://api.notion.com/v1/blocks/' + page.id + '/children', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${config.notion.token}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          children: [
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [
                  {
                    type: 'text',
                    text: { content: 'PromptContextLog:\n' + JSON.stringify(promptContextLog, null, 2) },
                  },
                ],
              },
            },
          ],
        }),
      });

      send('status', { stage: 'posting-telegram', progress: 90, message: 'Posting to Telegram' });
      const message = buildChannelPost(body.payload, analysis, page.url);
      const tgResp:any = await sendChannelMessage(message);

      // Обновляем заявку с итоговыми данными
      const completed: ReviewRequest = {
        ...initialReview,
        status: 'completed',
        notionPageId: page.id,
        notionUrl: page.url,
        analysis,
        telegram: { channelMessageId: tgResp?.result?.message_id, threadId: tgResp?.result?.message_thread_id },
      };
      await setCache(`review:${requestId}`, completed, 60 * 60 * 24);

      send('result', { blobUrl, notionPageId: page.id, notionUrl: page.url, analysis, requestId });
      close();
    } catch (e: any) {
      // Map known error messages to ErrorCode values; default to UPLOAD_ERROR
      const message: string = e?.message || 'Unknown error';
      const map: Record<string, string> = {
        MODEL_INVALID_JSON: 'MODEL_INVALID_JSON',
        BUDGET_EXCEEDED: 'BUDGET_EXCEEDED',
        PDF_RENDER_ERROR: 'PDF_RENDER_ERROR',
        DOC_EXTRACT_ERROR: 'DOC_EXTRACT_ERROR',
        DOCS_FETCH_ERROR: 'DOCS_FETCH_ERROR',
        NOTION_ERROR: 'NOTION_ERROR',
        TELEGRAM_POST_ERROR: 'TELEGRAM_POST_ERROR',
        TELEGRAM_DM_ERROR: 'TELEGRAM_DM_ERROR',
        DIAGRAM_ROI_UNSTABLE: 'DIAGRAM_ROI_UNSTABLE',
      };
      const code = (map[message] as any) || 'UPLOAD_ERROR';
      // Обновляем статус заявки как error
      await setCache(`review:${requestId}`, { ...initialReview, status: 'error' }, 60 * 60 * 24);
      send('status', { stage: 'error', progress: 100, message, error: { code } });
      close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
} 