interface RateLimitedFn {
  (): Promise<Response> | Response;
}

const map = new Map<string, number>();

export async function withRatelimit(key: string, windowMs: number, fn: RateLimitedFn) {
  const now = Date.now();
  const last = map.get(key) || 0;
  if (now - last < windowMs) {
    return new Response('Rate limited', { status: 429 });
  }
  map.set(key, now);
  return fn();
} 