import { headers } from 'next/headers';
import type { ReactNode } from 'react';

type CustomFont = {
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
          src: url('${f.url}')${format ? ` format('${format}')` : ''};
          font-weight: 100 900;
          font-style: normal;
          font-display: swap;
        }
      `;
    })
    .join('\n');

  return (
    <html lang="ar" dir="rtl">
      <head>
        {customFonts.map(font => (
          <link
            key={font.url}
            rel="preload"
            href={font.url}
            as="font"
            type={
              font.url.endsWith('.woff2')
                ? 'font/woff2'
                : font.url.endsWith('.woff')
                  ? 'font/woff'
                  : font.url.endsWith('.ttf')
                    ? 'font/ttf'
                    : undefined
            }
            crossOrigin="anonymous"
          />
        ))}

        {fontFaces && <style dangerouslySetInnerHTML={{ __html: fontFaces }} />}
      </head>

      <body style={{ margin: 0, padding: 0, fontWeight: 'normal' }}>{children}</body>
    </html>
  );
}
