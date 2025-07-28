import mammoth from 'mammoth';
import TurndownService from 'turndown';

/**
 * Extract plain Markdown from DOCX buffer.
 *
 * 1. Используем `mammoth.convertToHtml` для корректного извлечения структуры и
 *    встроенных изображений (если есть). `mammoth.convertToMarkdown` часто
 *    теряет headings и списки, поэтому промежуточный шаг через HTML ⭢ Markdown.
 * 2. Преобразуем HTML в Markdown с `turndown`. Настройки по умолчанию сохраняют
 *    семантические теги (h1/h2, lists).
 */
export async function extractDocx(buffer: ArrayBuffer | Buffer): Promise<string> {
  // mammoth ожидает обычный ArrayBuffer
  const arrayBuffer: ArrayBuffer = Buffer.isBuffer(buffer) ? buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) : buffer;

  const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

  const turndown = new TurndownService({ headingStyle: 'atx' });
  const markdown = turndown.turndown(html);
  return markdown;
} 