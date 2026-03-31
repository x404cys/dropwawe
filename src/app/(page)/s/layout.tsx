import { headers } from 'next/headers';
import {
  Almarai,
  Cairo,
  IBM_Plex_Sans_Arabic,
  Noto_Sans_Arabic,
  Rubik,
  Tajawal,
} from 'next/font/google';
import type { ReactNode } from 'react';
import { CartProvider } from './_context/CartContext';
import { LanguageProvider } from './_context/LanguageContext';
import { DEFAULT_FONT, resolveStorefrontFontFamily } from './_utils/fonts';

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--store-font-ibm-plex-sans-arabic',
  display: 'swap',
  preload: false,
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--store-font-cairo',
  display: 'swap',
  preload: false,
});

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  variable: '--store-font-tajawal',
  display: 'swap',
  preload: false,
});

const almarai = Almarai({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '700', '800'],
  variable: '--store-font-almarai',
  display: 'swap',
  preload: false,
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  variable: '--store-font-noto-sans-arabic',
  display: 'swap',
  preload: false,
});

const rubik = Rubik({
  subsets: ['arabic', 'latin'],
  variable: '--store-font-rubik',
  display: 'swap',
  preload: false,
});

const storefrontFontVariables = [
  ibmPlexSansArabic.variable,
  cairo.variable,
  tajawal.variable,
  almarai.variable,
  notoSansArabic.variable,
  rubik.variable,
].join(' ');

type CustomFont = {
  id: string;
  name: string;
  url: string;
};

type StorefrontTemplateFontConfig = {
  customFonts?: CustomFont[];
  headingFont?: string | null;
  bodyFont?: string | null;
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

function resolveSubdomain(host: string, referer: string) {
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    try {
      const url = new URL(referer || `http://${host}`);
      return url.searchParams.get('store') ?? '0000ppp';
    } catch {
      return '0000ppp';
    }
  }

  return host.split('.')[0] || '0000ppp';
}

function normalizeFontName(fontName?: string | null) {
  return fontName?.trim() || null;
}

export default async function StorefrontLayout({ children }: { children: ReactNode }) {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const subdomain = resolveSubdomain(host, headersList.get('referer') ?? '');
  const baseUrl = `${protocol}://${host}`;

  let customFonts: CustomFont[] = [];
  let templateConfig: StorefrontTemplateFontConfig | null = null;

  try {
    const res = await fetch(`${baseUrl}/api/s/store?subdomain=${subdomain}`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = await res.json();
      templateConfig = data.template ?? null;
      customFonts = templateConfig?.customFonts ?? [];
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

  const selectedCustomFonts = customFonts.filter(font => {
    const normalizedName = normalizeFontName(font.name);
    if (!normalizedName) return false;

    return (
      normalizedName === normalizeFontName(templateConfig?.headingFont) ||
      normalizedName === normalizeFontName(templateConfig?.bodyFont)
    );
  });

  const fontsToPreload = (selectedCustomFonts.length > 0 ? selectedCustomFonts : customFonts).slice(
    0,
    2
  );
  const rootFontFamily = resolveStorefrontFontFamily(templateConfig?.bodyFont ?? DEFAULT_FONT);

  return (
    <LanguageProvider>
      <CartProvider>
        <div
          className={`${storefrontFontVariables} min-h-screen`}
          style={{
            margin: 0,
            padding: 0,
            fontWeight: 'normal',
            fontFamily: rootFontFamily,
          }}
        >
          {fontsToPreload.map(font => (
            <link
              key={font.id}
              rel="preload"
              href={`/api/template/fonts/get?id=${font.id}`}
              as="font"
              type={getFontMimeType(font.url)}
              crossOrigin="anonymous"
            />
          ))}

          {fontFaces && <style dangerouslySetInnerHTML={{ __html: fontFaces }} />}

          {children}
        </div>
      </CartProvider>
    </LanguageProvider>
  );
}
