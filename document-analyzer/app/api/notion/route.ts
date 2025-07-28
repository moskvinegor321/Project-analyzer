import { NextResponse } from 'next/server';
import { createAnalysisPage } from '@/app/lib/notion';

export async function POST(req: Request) {
  try {
    const { payload, analysis } = await req.json();
    const page = await createAnalysisPage(payload, analysis);
    return NextResponse.json({ ok: true, notionPageId: page.id, notionUrl: page.url });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e.message }, { status: 500 });
  }
} 