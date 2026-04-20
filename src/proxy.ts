import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedPaths = ['/profile', '/orders', '/checkout'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  // For now, this is a skeleton. In a real app, you'd check for a session cookie/token.
  const hasSession = true; // Placeholder

  if (isProtected && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/orders/:path*',
    '/checkout/:path*',
  ],
};
