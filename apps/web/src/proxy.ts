import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register'];

/** Rutas sin auth mientras no hay backend/DB (panel admin con mocks). */
const UNAUTHENTICATED_PREFIXES = ['/admin'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  const isPublic =
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    UNAUTHENTICATED_PREFIXES.some((p) => pathname.startsWith(p));

  if (!token && !isPublic && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isPublic) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
