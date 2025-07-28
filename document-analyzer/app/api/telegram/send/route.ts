import { NextResponse } from 'next/server';
import { config } from '@/app/lib/config';
import { sendChannelMessage, callTelegram } from '@/app/lib/telegram';

export async function POST(req: Request) {
  const internalSecret = req.headers.get('x-internal-secret');
  if (internalSecret !== config.security.nextAuthSecret) {
    return NextResponse.json({ ok: false, message: 'unauthorized' }, { status: 401 });
  }

  const { type, text, chatId, replyTo } = await req.json();

  try {
    if (type === 'post') {
      await sendChannelMessage(text);
    } else if (type === 'reply') {
      await callTelegram('sendMessage', {
        chat_id: chatId,
        text,
        reply_to_message_id: replyTo,
        parse_mode: 'Markdown',
      });
    } else if (type === 'dm') {
      await callTelegram('sendMessage', {
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      });
    } else {
      return NextResponse.json({ ok: false, message: 'unsupported type' }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e.message }, { status: 500 });
  }
} 