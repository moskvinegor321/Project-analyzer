import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createCanvas } from 'canvas';
import { uploadToBlob } from '@/app/lib/blob';
import { PdfPageInfo } from '@/app/lib/claude';
import { config } from '@/app/lib/config';

/**
 * Extract plain text from PDF buffer, respecting page limit defined in config.
 */
export async function extractPdf(buffer: ArrayBuffer | Buffer): Promise<{ text: string; pages: number }> {
  const arrayBuffer: ArrayBuffer = Buffer.isBuffer(buffer) ? buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) : buffer;

  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const doc = await loadingTask.promise;

  const maxPages = Math.min(doc.numPages, config.pdf.maxPages);
  let fullText = '';

  for (let i = 1; i <= maxPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => (item.str as string));
    fullText += strings.join(' ') + '\n';
  }

  if (doc.numPages > maxPages) {
    fullText += `\n[skipped ${doc.numPages - maxPages} pages due to PDF_MAX_PAGES limit]`;
  }

  return { text: fullText, pages: doc.numPages };
}

/**
 * Produce lightweight info (text char count + thumbnail) for each page – limited
 * to config.pdf.maxPages to avoid excessive compute.
 */
export async function getPdfPagesInfo(buffer: ArrayBuffer | Buffer): Promise<PdfPageInfo[]> {
  const arrayBuffer: ArrayBuffer = Buffer.isBuffer(buffer) ? buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) : buffer;

  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const doc = await loadingTask.promise;

  const pages: PdfPageInfo[] = [];
  const maxPages = Math.min(doc.numPages, config.pdf.maxPages);

  for (let i = 1; i <= maxPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str as string);
    const textChars = strings.join('').length;

    // Render low-res thumbnail (scale based on desired width)
    const scale = config.pdf.renderWidth / page.getViewport({ scale: 1 }).width;
    const viewport = page.getViewport({ scale });
    const canvas = createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx as any, viewport } as any).promise;

    const pngBuffer = canvas.toBuffer('image/png');
    const blobUrl = await uploadToBlob(pngBuffer, `pdf-thumbs/page-${i}.png`);

    pages.push({ page: i, textChars, url: blobUrl });
  }

  return pages;
} 