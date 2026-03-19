import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';

import FloatingWhatsApp from './_components/floating/FloatingWhatsApp';
import StorefrontClient from './_components/StorefrontClient';
import StorefrontShell from './_components/StorefrontShell';
import type {
  SectionsConfig,
  StorefrontFonts,
  StorefrontProduct,
  StorefrontStore,
  StorefrontTemplate,
} from './_lib/types';
import { getActiveColors, DEFAULT_SECTIONS, DEFAULT_TEMPLATE } from './_utils/colors';
import { buildFontStyles } from './_utils/fonts';

interface StorefrontData {
  store: StorefrontStore;
  template: StorefrontTemplate;
  products: StorefrontProduct[];
}

type StorefrontRootStyle = CSSProperties & {
  [key: `--${string}`]: string;
};

async function resolveSubdomain() {
  const headersList = await headers();
  const host = headersList.get('host') || '';

  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    const referer = headersList.get('referer') ?? '';

    try {
      const url = new URL(referer || `http://${host}`);
      return url.searchParams.get('store') ?? '0000ppp';
    } catch {
      return '0000ppp';
    }
  }

  return host.split('.')[0] || '0000ppp';
}

async function getStorefrontData(): Promise<StorefrontData | null> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  const subdomain = await resolveSubdomain();

  try {
    const storeRes = await fetch(
      `${baseUrl}/api/s/store?subdomain=${encodeURIComponent(subdomain)}`
      // {
      //   next: { revalidate: 30 },
      // }
    );
    if (!storeRes.ok) return null;

    const { store, template } = await storeRes.json();

    const productsRes = await fetch(`${baseUrl}/api/s/products?storeId=${store.id}`, {
      // next: { revalidate: 30 },
    });
    const { products } = productsRes.ok ? await productsRes.json() : { products: [] };

    return {
      store,
      template: template ?? DEFAULT_TEMPLATE,
      products: products ?? [],
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getStorefrontData();
  if (!data) return { title: 'متجر' };

  const { store, template } = data;
  return {
    title: store.name ?? 'متجر',
    description: template?.tagline ?? store.description ?? '',
    openGraph: {
      title: store.name ?? 'متجر',
      description: template?.tagline ?? store.description ?? '',
      images: store.image ? [{ url: store.image }] : [],
      locale: 'ar_IQ',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: store.name ?? 'متجر',
      description: template?.tagline ?? store.description ?? '',
      images: store.image ? [store.image] : [],
    },
    icons: { icon: store.image ?? '/favicon.ico' },
  };
}

export default async function StorefrontPage() {
  const data = await getStorefrontData();
  if (!data) notFound();

  const { store, template, products } = data;
  const colors = getActiveColors(template);
  const { headingStyle, bodyStyle } = buildFontStyles(template);
  const fonts: StorefrontFonts = {
    heading: template.headingFont ?? 'IBM Plex Sans Arabic',
    body: template.bodyFont ?? 'IBM Plex Sans Arabic',
  };

  const sections: SectionsConfig = {
    ...DEFAULT_SECTIONS,
    ...((template.sectionsConfig as Partial<SectionsConfig>) ?? {}),
  };

  const announcement = template.announcementBar;
  const rawBanners = template.bannerImages ?? [];
  const topBanners: string[] = [];
  const centerBanners: string[] = [];
  const upStoreBanners: string[] = [];
  const btwCatBanners: string[] = [];

  for (const banner of rawBanners) {
    const position = (banner.postion || '').toLowerCase();
    if (position === 'center') {
      centerBanners.push(banner.url);
    } else if (position === 'upstore') {
      upStoreBanners.push(banner.url);
    } else if (position === 'btwcat') {
      btwCatBanners.push(banner.url);
    } else {
      topBanners.push(banner.url);
    }
  }
  const enabledCategorySections = template.categorySections?.filter(cs => cs.enabled) ?? [];
  const baseFontSizeRaw = (template as unknown as { baseFontSize?: string | number }).baseFontSize;
  const baseFontSize = Number(baseFontSizeRaw ?? 16);
  const rootStyle: StorefrontRootStyle = {
    backgroundColor: colors.bg,
    color: colors.text,
    '--store-primary': colors.primary,
    '--store-accent': colors.accent,
    '--store-bg': colors.bg,
    '--store-text': colors.text,
    '--store-surface': `color-mix(in srgb, ${colors.bg} 96%, ${colors.text} 4%)`,
    '--store-surface-strong': `color-mix(in srgb, ${colors.bg} 92%, ${colors.text} 8%)`,
    '--store-border': `color-mix(in srgb, ${colors.bg} 84%, ${colors.text} 16%)`,
    '--store-border-strong': `color-mix(in srgb, ${colors.bg} 72%, ${colors.text} 28%)`,
    '--store-text-soft': `color-mix(in srgb, ${colors.text} 72%, ${colors.bg} 28%)`,
    '--store-text-muted': `color-mix(in srgb, ${colors.text} 58%, ${colors.bg} 42%)`,
    '--store-text-faint': `color-mix(in srgb, ${colors.text} 42%, ${colors.bg} 58%)`,
    '--store-primary-soft': `color-mix(in srgb, ${colors.primary} 12%, ${colors.bg} 88%)`,
    '--store-primary-faint': `color-mix(in srgb, ${colors.primary} 6%, ${colors.bg} 94%)`,
    '--store-accent-soft': `color-mix(in srgb, ${colors.accent} 12%, ${colors.bg} 88%)`,
    '--store-shadow-sm': `0 14px 36px -28px color-mix(in srgb, ${colors.text} 18%, transparent)`,
    '--store-shadow-lg': `0 24px 64px -40px color-mix(in srgb, ${colors.text} 22%, transparent)`,
    '--store-radius': '12px',
    '--store-max-width': '1280px',
    ...bodyStyle,
    ...(Number.isFinite(baseFontSize) ? { fontSize: `${baseFontSize}px` } : {}),
  };

  return (
    <div className="min-h-screen overflow-x-clip" style={rootStyle}>
      <StorefrontClient
        store={store}
        colors={colors}
        headingStyle={headingStyle}
        sections={sections}
      >
        <StorefrontShell
          store={store}
          template={template}
          products={products}
          colors={colors}
          fonts={fonts}
          sections={sections}
          announcement={announcement}
          topBanners={topBanners}
          centerBanners={centerBanners}
          upStoreBanners={upStoreBanners}
          btwCatBanners={btwCatBanners}
          enabledCategorySections={enabledCategorySections}
        />
      </StorefrontClient>

      <FloatingWhatsApp template={template} store={store} />
    </div>
  );
}
