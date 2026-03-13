import { headers } from 'next/headers';
import type { ReactNode } from 'react';

export default async function StorefrontLayout({ children }: { children: ReactNode }) {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const baseUrl = `${protocol}://${host}`;

  let fontFaces = '';
  
  try {
    const res = await fetch(`${baseUrl}/api/s/store?subdomain=0000ppp`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = await res.json();

      fontFaces =
        data.template?.customFonts
          ?.map(
            (f: { name: string; url: string }) => `
              @font-face {
                font-family: '${f.name}';
                src: url('${f.url}');
                font-display: swap;
              }
            `
          )
          .join('\n') ?? '';
    }
  } catch (err) {
    console.error('Font fetch failed', err);
  }

  return (
    <div dir="rtl" style={{ margin: 0, padding: 0, fontWeight: 'normal' }}>
      {fontFaces && <style dangerouslySetInnerHTML={{ __html: fontFaces }} />}
      {children}
    </div>
  );
}
