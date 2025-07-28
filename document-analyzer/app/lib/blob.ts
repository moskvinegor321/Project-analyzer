import { put } from '@vercel/blob';
import { config } from '@/app/lib/config';

/**
 * Upload arbitrary binary data to Vercel Blob storage.
 *
 * Returns a permanent, public HTTPS URL. Credentials (read-write token) are
 * provided via the BLOB_READ_WRITE_TOKEN env variable and surfaced through
 * app/lib/config.ts. No local fallback – project fails fast if token absent
 * as требуемо принципом Strict Errors.
 */
export async function uploadToBlob(data: ArrayBuffer | Buffer | Blob, path: string): Promise<string> {
  if (config.blob.token === undefined || config.blob.token.length === 0) {
    throw new Error('BLOB_READ_WRITE_TOKEN not configured');
  }

  // `put` automatically infers MIME; explicit path keeps original folder/name
  const { url } = await put(path, data, {
    access: 'public',
    token: config.blob.token,
  });

  return url;
}

/**
 * Convenience helper to transform an internal blob key into a public URL.
 * For compatibility with legacy code that stores only a relative path.
 */
export function getBlobUrl(path: string): string {
  return `https://blob.vercel-storage.com/${path}`;
} 