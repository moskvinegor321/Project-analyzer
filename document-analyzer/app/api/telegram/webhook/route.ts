import { NextResponse } from 'next/server';
import { config } from '@/app/lib/config';
import { answerCallbackQuery } from '@/app/lib/telegram';
import { updatePage } from '@/app/lib/notion';
import { getCache, setCache } from '@/app/lib/cache';

export async function POST(req: Request) {
  const secret = req.headers.get('x-telegram-bot-api-secret-token');
  if (secret !== config.telegram.webhookSecret) {
    return NextResponse.json({ ok: false, message: 'invalid secret' }, { status: 403 });
  }

  const update = await req.json();

  if (update.callback_query) {
    const cb = update.callback_query;
    const data: string = cb.data || '';
    // Expected format act:<requestId>:<action>
    const match = data.match(/^act:(.+?):(approve|reject|add)$/);
    if (!match) {
      await answerCallbackQuery(cb.id, 'Unknown action');
      return NextResponse.json({ ok: true });
    }
    const [, requestId, action] = match;

    // Fetch review request from KV
    const request = await getCache<any>(`review:${requestId}`);
    if (!request) {
      await answerCallbackQuery(cb.id, 'Request not found');
      return NextResponse.json({ ok: true });
    }

    // Update decision
    let decision = 'Pending';
    if (action === 'approve') decision = 'Approved';
    if (action === 'reject') decision = 'Rejected';
    if (action === 'add') decision = config.security.needsInfoOnComment ? 'Needs info' : request.decision;

    request.decision = decision;
    request.lastAction = action;
    request.lastModerator = cb.from.username;
    await setCache(`review:${requestId}`, request, 60 * 60 * 24);

    // Update Notion page
    if (request.notionPageId) {
      await updatePage(request.notionPageId, {
        Decision: { select: { name: decision } },
        'Last Action': { select: { name: action } },
        'Last Action At': { date: { start: new Date().toISOString() } },
        'Last Moderator (TG)': {
          rich_text: [{ type: 'text', text: { content: `@${cb.from.username}` } }],
        },
      });
    }

    await answerCallbackQuery(cb.id, '✅');
  }

  return NextResponse.json({ ok: true });
} 