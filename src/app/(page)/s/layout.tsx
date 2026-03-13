import { headers } from 'next/headers';
import type { ReactNode } from 'react';

type CustomFont = {
  id: string;
  name: string;
  url: string;
};

function getFontFormat(url: string) {
  const lower = url.toLowerCase();

  if (lower.endsWith('.woff2')) return 'woff2';
  if (lower.endsWith('.woff')) return 'woff';
  if (lower.endsWith('.ttf')) return 'truetype';
  if (lower.endsWith('.otf')) return 'opentype';

  return '';
}

function getFontMimeType(url: string) {
  const lower = url.toLowerCase();

  if (lower.endsWith('.woff2')) return 'font/woff2';
  if (lower.endsWith('.woff')) return 'font/woff';
  if (lower.endsWith('.ttf')) return 'font/ttf';
  if (lower.endsWith('.otf')) return 'font/otf';

  return undefined;
}

export default async function StorefrontLayout({ children }: { children: ReactNode }) {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const subdomain = host.split('.')[0];
  const baseUrl = `${protocol}://${host}`;

  let customFonts: CustomFont[] = [];

  try {
    const res = await fetch(`${baseUrl}/api/s/store?subdomain=${subdomain}`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = await res.json();
      customFonts = data.template?.customFonts ?? [];
    }
  } catch (err) {
    console.error('Font fetch failed', err);
  }

  const fontFaces = customFonts
    .map(f => {
      const format = getFontFormat(f.url);

      return `
      @font-face {
        font-family: '${f.name}';
        src: url('/api/template/fonts/get?id=${f.id}')${format ? ` format('${format}')` : ''};
        font-weight: 100 900;
        font-style: normal;
        font-display: swap;
      }
    `;
    })
    .join('\n');

  const primaryFont = customFonts[0]?.name || 'sans-serif';
  const primaryFontUrl = customFonts[0]?.url;
  const primaryFontApiUrl = customFonts[0]?.id
    ? `/api/template/fonts/get/fonts?id=${customFonts[0].id}`
    : null;

  return (
    <div
      dir="rtl"
      style={{
        margin: 0,
        padding: 0,
        fontWeight: 'normal',
        fontFamily: `'${primaryFont}', sans-serif`,
      }}
    >
      {primaryFontApiUrl && (
        <link
          rel="preload"
          href={primaryFontApiUrl}
          as="font"
          type={primaryFontUrl ? getFontMimeType(primaryFontUrl) : undefined}
          crossOrigin="anonymous"
        />
      )}

      {fontFaces && <style dangerouslySetInnerHTML={{ __html: fontFaces }} />}

      {children}
    </div>
  );
}
