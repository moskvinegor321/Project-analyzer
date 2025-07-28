import { AnalysisResult } from '@/app/types';
import {
  AnalysisResultSchema,
  PdfImageSelectionSchema,
  DocChunkSelectionSchema,
} from '@/app/lib/validation';
import { config } from '@/app/lib/config';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: config.anthropic.apiKey });

function estimateTokens(text: string): number {
  // Heuristic: 1 token ≈ 4 characters (English). For RU the ratio similar enough.
  return Math.ceil(text.length / 4);
}

function estimateCostUsd(tokensIn: number, tokensOut = 2048): number {
  // Claude Sonnet price 2024-06: $0.003 per 1K input, $0.015 per 1K output
  return (tokensIn / 1000) * 0.003 + (tokensOut / 1000) * 0.015;
}

export interface PdfPageInfo {
  page: number;
  textChars: number;
  url: string;
}

export async function selectPdfImages(pages: PdfPageInfo[], maxImages: number): Promise<{ page: number; reason: string }[]> {
  const prompt = `Вам передан список страниц PDF с количеством символов текста и URL изображения страницы. Ваша задача выбрать до ${maxImages} страниц с диаграммами/схемами, наиболее полезными для анализа. Верните JSON формата { \"selected\": [ { \"page\": <num>, \"reason\": <string> } ], \"skip\": [ { \"page\": <num>, \"reason\": <string> } ] }`;
  const pageList = pages.map((p) => `Page ${p.page} (textChars=${p.textChars}) -> ${p.url}`).join('\n');

  const raw = await callClaudeJson({ prompt: `${prompt}\n\nPages:\n${pageList}` });

  const parsed = PdfImageSelectionSchema.safeParse(raw);
  if (!parsed.success) throw new Error('MODEL_INVALID_JSON');

  return parsed.data.selected;
}

export interface DocChunkMeta { id: string; title: string; size: number; preview: string; }

export interface SelectedChunk { id: string; reason: string }

export async function selectDocChunks(chunks: DocChunkMeta[]): Promise<SelectedChunk[]> {
  const prompt = `Выберите релевантные чанки документации из ниже приведённого списка. Верните JSON { \"selected\": [ { \"id\": <string>, \"reason\": <string> } ] }`;
  const list = chunks
    .map((c) => `${c.id}: ${c.title} (${c.size} chars)\n${c.preview.slice(0, 200)}...`)
    .join('\n\n');

  const raw = await callClaudeJson({ prompt: `${prompt}\n\nChunks:\n${list}` });
  const parsed = DocChunkSelectionSchema.safeParse(raw);
  if (!parsed.success) throw new Error('MODEL_INVALID_JSON');
  return parsed.data.selected as SelectedChunk[];
}

interface ClaudeCallOptions {
  prompt: string | { type: 'structured'; content: any };
  images?: { url: string }[];
  maxTokens?: number;
}

async function callClaudeJson({ prompt, images = [], maxTokens = 2048 }: ClaudeCallOptions): Promise<any> {
  const promptText = typeof prompt === 'string' ? prompt : JSON.stringify(prompt.content);

  // Budget guard (rough) — images add ~100 tokens each
  const tokenEstimate = estimateTokens(promptText) + images.length * 100;
  const estCost = estimateCostUsd(tokenEstimate, maxTokens);
  if (tokenEstimate > config.anthropic.maxInputTokens || estCost > config.anthropic.costSoftLimitUsd) {
    throw new Error('BUDGET_EXCEEDED');
  }

  const userContent: any[] = [{ type: 'text', text: promptText }];
  images.forEach((img) => userContent.push({ type: 'image', source: { type: 'url', url: img.url } }));

  const response = await anthropic.messages.create({
    model: config.anthropic.model,
    max_tokens: maxTokens,
    temperature: 0,
    messages: [
      {
        role: 'user',
        content: userContent as any,
      },
    ],
  });

  try {
    return JSON.parse(response.content as any);
  } catch {
    throw new Error('MODEL_INVALID_JSON');
  }
}

// back-compat wrapper
async function callClaude(prompt: string): Promise<any> {
  return callClaudeJson({ prompt });
}

export async function analyze(): Promise<AnalysisResult> {
  const prompt = 'Return strict JSON matching AnalysisResult';
  const raw = await callClaude(prompt);
  const parsed = AnalysisResultSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error('MODEL_INVALID_JSON');
  }
  return parsed.data;
}

// Export helpers for other modules (vision, ROI, etc.)
export { callClaudeJson };

export interface SelectedImage {
  page: number;
  url: string;
}

export interface AnalysisInput {
  docSummary: string; // truncated text or summary of document
  selectedChunks: { id: string; title: string; content: string }[];
  images: SelectedImage[];
}

function buildAnalysisPrompt(input: AnalysisInput): string {
  const { docSummary, selectedChunks, images } = input;
  const chunkSections = selectedChunks
    .map((c, idx) => `### Chunk ${idx + 1}: ${c.title}\n${c.content}`)
    .join('\n\n');
  const imageList = images
    .map((img) => `Page ${img.page}: ${img.url}`)
    .join('\n');

  return `You are an expert business analyst working with engineering requirements.\n\n## Document Summary\n${docSummary}\n\n## Selected Documentation Chunks\n${chunkSections || 'None'}\n\n## Selected Images\n${imageList || 'None'}\n\n---\nReturn STRICT JSON matching the following TypeScript type (do NOT wrap in markdown):\n${AnalysisResultSchema.toString()}`;
}

export async function analyzeDocument(input: AnalysisInput): Promise<AnalysisResult> {
  let { docSummary } = input;
  const { selectedChunks, images } = input;

  // Budget guard — rough estimate before building full prompt
  const tokensDoc = estimateTokens(docSummary);
  const tokensChunks = selectedChunks.reduce((sum, c) => sum + estimateTokens(c.content), 0);
  const tokensImages = images.length * 50; // heuristic overhead per image reference
  const totalInTokens = tokensDoc + tokensChunks + tokensImages + 500; // + prompt overhead

  const estCost = estimateCostUsd(totalInTokens);

  if (totalInTokens > config.anthropic.maxInputTokens || estCost > config.anthropic.costSoftLimitUsd) {
    // Compress docSummary aggressively: take first 4000 chars and add notice
    docSummary = `${docSummary.slice(0, 4000)}\n[truncated due to budget guard]`;
  }

  const prompt = buildAnalysisPrompt({ docSummary, selectedChunks, images });

  const raw = await callClaude(prompt);
  const parsed = AnalysisResultSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error('MODEL_INVALID_JSON');
  }
  return parsed.data;
}

export async function analyzeDocumentStream(
  input: AnalysisInput,
  onToken: (token: string) => void,
): Promise<AnalysisResult> {
  let { docSummary } = input;
  const { selectedChunks, images } = input;

  const tokensDoc = estimateTokens(docSummary);
  const tokensChunks = selectedChunks.reduce((sum, c) => sum + estimateTokens(c.content), 0);
  const tokensImages = images.length * 50;
  const totalIn = tokensDoc + tokensChunks + tokensImages + 500;
  const estCost = estimateCostUsd(totalIn);

  if (totalIn > config.anthropic.maxInputTokens || estCost > config.anthropic.costSoftLimitUsd) {
    docSummary = `${docSummary.slice(0, 4000)}\n[truncated due to budget guard]`;
  }

  const prompt = buildAnalysisPrompt({ docSummary, selectedChunks, images });

  // Build user content array with image blocks
  const userContent: any[] = [{ type: 'text', text: prompt }];
  images.forEach((img) => userContent.push({ type: 'image', source: { type: 'url', url: img.url } }));

  // Request stream from Anthropic
  const stream: any = await anthropic.messages.create({
    model: config.anthropic.model,
    max_tokens: 2048,
    temperature: 0,
    stream: true,
    messages: [
      {
        role: 'user',
        content: userContent as any,
      },
    ],
  });

  let full = '';
  for await (const part of stream) {
    const delta = (part as any).delta?.text || '';
    if (delta) {
      full += delta;
      onToken(delta);
    }
  }

  try {
    const parsed = AnalysisResultSchema.safeParse(JSON.parse(full));
    if (!parsed.success) throw new Error('MODEL_INVALID_JSON');
    return parsed.data;
  } catch {
    throw new Error('MODEL_INVALID_JSON');
  }
} 