import { kv } from '@vercel/kv';
import { config } from '@/app/lib/config';

/**
 * Thin wrapper around Vercel KV REST API with optional TTL.
 * Falls back to in-process memory map when KV credentials не заданы
 * (локальная разработка без стороннего подключения).
 */

const mem = new Map<string, { value: any; expires: number }>();

function memGet<T>(key: string): T | null {
  const item = mem.get(key);
  if (!item) return null;
  if (Date.now() > item.expires) {
    mem.delete(key);
    return null;
  }
  return item.value as T;
}

function memSet<T>(key: string, value: T, ttlSeconds = 60) {
  mem.set(key, { value, expires: Date.now() + ttlSeconds * 1000 });
}

export async function getCache<T>(key: string): Promise<T | null> {
  if (config.kv.url && config.kv.token) {
    const data = await kv.get(key);
    return (data ?? null) as T | null;
  }
  return memGet<T>(key);
}

export async function setCache<T>(key: string, value: T, ttlSeconds = 60) {
  if (config.kv.url && config.kv.token) {
    await kv.set(key, value, { ex: ttlSeconds });
    return;
  }
  memSet(key, value, ttlSeconds);
} 