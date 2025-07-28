export function formatSseEvent(event: string, data: any): string {
  const payload = typeof data === 'string' ? data : JSON.stringify(data);
  return `event: ${event}\ndata: ${payload}\n\n`;
}

export function createSseStream(onStart: (send: (event: string, data: any) => void, close: () => void) => void): ReadableStream {
  return new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const send = (event: string, data: any) => {
        controller.enqueue(encoder.encode(formatSseEvent(event, data)));
      };
      const close = () => controller.close();
      onStart(send, close);
    },
  });
} 