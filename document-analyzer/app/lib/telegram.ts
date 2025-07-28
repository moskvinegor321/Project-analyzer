import { config } from '@/app/lib/config';

export async function callTelegram(method: string, payload: any) {
  const url = `https://api.telegram.org/bot${config.telegram.botToken}/${method}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Telegram API error');
  return res.json();
}

export async function sendChannelMessage(text: string, replyMarkup?: any) {
  return callTelegram('sendMessage', {
    chat_id: config.telegram.channelId,
    message_thread_id: config.telegram.threadId || undefined,
    text,
    parse_mode: 'Markdown',
    reply_markup: replyMarkup,
  });
}

export async function answerCallbackQuery(id: string, text?: string) {
  return callTelegram('answerCallbackQuery', { callback_query_id: id, text, show_alert: false });
}

export function buildChannelPost(payload: any, analysis: any, notionUrl: string) {
  const lines = [
    '🔍 **Новая заявка на анализ документов**',
    '',
    `**Проект:** ${payload.projectName}`,
    `**Заявитель:** ${payload.telegramUsername}`,
    '',
    '**📋 Детали:**',
    `• **Процесс:** ${analysis.process || '—'}`,
    `• **Типы документов:** ${(analysis.documentTypes || []).join(', ') || '—'}`,
    `• **Объём:** ${analysis.volumePages?.raw || '—'}`,
    `• **ARR:** ${analysis.arrRub || '—'} ₽`,
    `• **ACV:** ${analysis.acvRub || '—'} ₽`,
    `• **Размещение:** ${analysis.placement || '—'}`,
    '',
    '**🎯 Оценка:**',
    `• **Реализуемость:** ${analysis.feasibility} (${Math.round(analysis.confidence * 100)}% уверенность)`,
    `• **Сроки:** ${analysis.estimatedTimeline}`,
    `• **Основные риски:** ${(analysis.missingRequirements || []).slice(0,3).join(', ')}`,
    '',
    '**🔗 Ссылки:**',
    `• [Квота](${payload.quotaLink})`,
    payload.tzLink ? `• [ТЗ](${payload.tzLink})` : '',
    payload.pipedriveLink ? `• [Pipedrive](${payload.pipedriveLink})` : '',
    payload.examplesLink ? `• [Примеры](${payload.examplesLink})` : '',
    `• [Исходный файл](${analysis.links?.blob || payload.blobUrl})`,
    '',
    `📊 **Подробности:** ${notionUrl}`,
  ].filter(Boolean);
  return lines.join('\n');
} 