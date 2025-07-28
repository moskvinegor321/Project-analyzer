import { NextResponse } from 'next/server';

// Applies to /api/* routes. Ensures requests originate from allowed domain (NEXT_PUBLIC_APP_URL) if Origin header is present.
export function middleware(request: Request) {
  const origin = request.headers.get('origin');
  const allowed = process.env.NEXT_PUBLIC_APP_URL;

  // Preflight requests: just echo CORS headers so browser can proceed
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': allowed || '',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      },
    });
  }

  if (origin && allowed && origin !== allowed) {
    return NextResponse.json({ ok: false, message: 'CORS: origin not allowed' }, { status: 403 });
  }

  const response = NextResponse.next();
  if (allowed) {
    response.headers.set('Access-Control-Allow-Origin', allowed);
  }
  return response;
}

export const config = {
  matcher: '/api/:path*',
}; 