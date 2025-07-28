import { NextResponse } from 'next/server';
import { getCache } from '@/app/lib/cache';

export async function GET(req: Request, context: any) {
  const id = context.params?.id as string;
  if (!id) {
    return NextResponse.json({ ok: false, message: 'id required' }, { status: 400 });
  }
  const data = await getCache(`review:${id}`);
  if (!data) {
    return NextResponse.json({ ok: false, message: 'not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, data });
} 