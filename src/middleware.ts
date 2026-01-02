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
    switch (subdomain) {
      case 'admin':
        url.pathname = url.pathname.startsWith('/admin') ? url.pathname : `/admin${url.pathname}`;
        return NextResponse.rewrite(url);

      case 'login':
        url.pathname = url.pathname.startsWith('/login') ? url.pathname : `/login${url.pathname}`;
        return NextResponse.rewrite(url);

      case 'dashboard':
        url.pathname = url.pathname.startsWith('/Dashboard')
          ? url.pathname
          : `/Dashboard${url.pathname}`;
        return NextResponse.rewrite(url);

      case 'supplier':
        url.pathname = url.pathname.startsWith('/Supplier/Dashboard')
          ? url.pathname
          : `/Supplier/Dashboard${url.pathname}`;
        return NextResponse.rewrite(url);
      case 'abdulrqhman':
        url.pathname = url.pathname.startsWith('/store') ? url.pathname : `/storev2${url.pathname}`;
        return NextResponse.rewrite(url);
      default:
        if (subdomain !== 'www' && subdomain !== 'sahlapp') {
          url.pathname = url.pathname.startsWith('/storev2')
            ? url.pathname
            : `/storev2${url.pathname}`;
          return NextResponse.rewrite(url);
        }
        break;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
