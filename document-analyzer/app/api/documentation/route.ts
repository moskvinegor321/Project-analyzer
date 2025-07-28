import { NextResponse } from 'next/server';
import { fetchAndChunk } from '@/app/lib/documentation';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { urls, forceRefresh } = body as { urls: string[]; forceRefresh?: boolean };
    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ ok: false, message: 'urls required' }, { status: 400 });
    }
    // KV cache honouring forceRefresh handled inside fetchAndChunk
    const data = await fetchAndChunk(urls, forceRefresh);
    return NextResponse.json({ ok: true, ...data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
} 