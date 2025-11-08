import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.nextUrl.hostname;
  const pathname = url.pathname;

  const parts = hostname.split('.');
  let subdomain: string | null = null;

  if (hostname.includes('localhost') && parts.length > 1) {
    subdomain = parts[0];
  } else if (parts.length > 2) {
    subdomain = parts[0];
  }

  if (hostname.includes('192.168.0.198:3000') && parts.length > 1) {
    subdomain = parts[0];
  } else if (parts.length > 2) {
    subdomain = parts[0];
  }
  if (subdomain) {
    if (subdomain === 'admin') {
      if (pathname.startsWith('/admin')) {
        return NextResponse.next();
      }
      url.pathname = '/admin';
      return NextResponse.rewrite(url);
    }

    if (subdomain === 'login') {
      url.pathname = '/login';
      return NextResponse.rewrite(url);
    }

    if (subdomain === 'dashboard') {
      if (pathname.startsWith('/Dashboard')) {
        return NextResponse.next();
      }
      url.pathname = '/Dashboard';
      return NextResponse.rewrite(url);
    }
    if (subdomain === 'supplier') {
      if (pathname.startsWith('/Supplier/Dashboard')) {
        return NextResponse.next();
      }
      url.pathname = '/Supplier/Dashboard';
      return NextResponse.rewrite(url);
    }

    if (subdomain !== 'www' && subdomain !== 'sahlapp') {
      if (pathname.startsWith('/storev2')) {
        return NextResponse.next();
      }
      url.pathname = '/storev2';
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
