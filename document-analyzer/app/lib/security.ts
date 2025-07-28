/**
 * Verifies secret token received from Telegram webhook.
 */
export function verifyTelegramSecret(token: string, expected: string): boolean {
  return token === expected;
}

/**
 * Basic Markdown sanitization for Telegram to escape special characters.
 */
export function sanitizeMarkdown(text: string): string {
  return text.replace(/[_*`\[\]]/g, (m) => `\\${m}`);
} 