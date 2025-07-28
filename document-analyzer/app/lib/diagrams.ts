import { DiagramFinding } from '@/app/types';
import { callClaudeJson } from '@/app/lib/claude';

/**
 * Ask Claude Vision to detect diagrams/charts/tables on provided page thumbnails.
 * Returns array of DiagramFinding objects limited to config.pdf.maxDiagramPages.
 */
export async function detectDiagrams(pages: Array<{ index: number; imageUrl: string }>): Promise<DiagramFinding[]> {
  if (pages.length === 0) return [];

  // Build prompt
  const prompt = `Вы эксперт по технической документации. Для каждой переданной страницы определи, содержит ли она диаграмму / схему / таблицу, коротко опиши её и поясни, чем она полезна для анализа ТЗ. Верни STRICT JSON массива объектов:\n[{\n  \"page\": <number>,\n  \"type\": \"diagram|chart|table|unknown\",\n  \"description\": <string>,\n  \"implications\": <string>\n}]`;

  // Use up to 10 images to control cost
  const images = pages.slice(0, 10).map((p) => ({ url: p.imageUrl }));

  try {
    const raw = await callClaudeJson({ prompt, images });
    return raw as DiagramFinding[];
  } catch {
    return [];
  }
} 