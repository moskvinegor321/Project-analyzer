import { load as loadHtml } from 'cheerio';
import TurndownService from 'turndown';
import { getCache, setCache } from '@/app/lib/cache';
import crypto from 'crypto';
import { config } from '@/app/lib/config';

const turndown = new TurndownService();

export interface DocChunk {
  id: string;
  title: string;
  size: number;
  preview: string;
  content: string;
}

export function chunkMarkdown(markdown: string): DocChunk[] {
  const lines = markdown.split(/\r?\n/);
  const chunks: DocChunk[] = [];
  let buffer: string[] = [];
  let heading = 'Introduction';
  let index = 0;

  function pushChunk() {
    if (buffer.length === 0) return;
    const content = buffer.join('\n');
    chunks.push({
      id: `chunk-${index}`,
      title: heading,
      size: content.length,
      preview: content.slice(0, 200),
      content,
    });
    buffer = [];
    index += 1;
  }

  for (const line of lines) {
    const hMatch = line.match(/^##?\s+(.*)/); // h1/h2 heading
    if (hMatch) {
      pushChunk();
      heading = hMatch[1].trim();
    }
    buffer.push(line);
    // size based split (8-12k chars)
    if (buffer.join('\n').length > 10000) {
      pushChunk();
    }
  }
  pushChunk();
  return chunks;
}

function hashUrls(urls: string[]): string {
  return crypto.createHash('sha1').update(urls.join('|')).digest('hex');
}

export async function fetchAndChunk(urls: string[], forceRefresh = false) {
  const cacheKey = `docs-cache:${hashUrls(urls)}`;
  if (!forceRefresh) {
    const cached = await getCache<{ rawMarkdown: string; chunks: DocChunk[]; sourceUrls: string[] }>(cacheKey);
    if (cached) return cached;
  }

  const rawMarkdown = await fetchDocumentation(urls);
  const chunks = chunkMarkdown(rawMarkdown);
  const data = { rawMarkdown, chunks, sourceUrls: urls };
  await setCache(cacheKey, data, 60 * 60 * 24); // 24h
  return data;
}

export async function fetchDocumentation(urls: string[]): Promise<string> {
  const allowed = config.security.allowedDocDomains;
  const chunks: string[] = [];
  for (const url of urls) {
    if (allowed.length) {
      const host = new URL(url).hostname;
      const passed = allowed.some((d) => host === d || host.endsWith(`.${d}`));
      if (!passed) {
        throw new Error('DOCS_FETCH_ERROR');
      }
    }
    const res = await fetch(url);
    const html = await res.text();
    const $ = loadHtml(html);
    const main = $('body').html() || '';
    const markdown = turndown.turndown(main);
    chunks.push(markdown);
  }
  return chunks.join('\n\n---\n\n');
} 