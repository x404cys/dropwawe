import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get('host') || '';
  const parts = host.split('.');
  let subdomain: string | null = null;

  if (host.includes('localhost') && parts.length > 1) {
    subdomain = parts[0];
  } else if (parts.length > 2) {
    subdomain = parts[0];
  }

  if (subdomain) {
    if (subdomain === 'admin') {
      url.pathname = '/admin';
      return NextResponse.rewrite(url);
    }

    if (subdomain === 'login') {
      url.pathname = '/login';
      return NextResponse.rewrite(url);
    }

    if (subdomain === 'dashboard') {
      url.pathname = '/Dashboard';
      return NextResponse.rewrite(url);
    }

    if (subdomain === 'supplier') {
      url.pathname = '/Supplier/Dashboard';
      return NextResponse.rewrite(url);
    }

    if (subdomain !== 'www' && subdomain !== 'sahlapp') {
      url.pathname = '/storev2';
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
