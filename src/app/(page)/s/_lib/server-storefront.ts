import { headers } from 'next/headers';
import type { CSSProperties } from 'react';

import type {
  SectionsConfig,
  StorefrontFonts,
  StorefrontProduct,
  StorefrontStore,
  StorefrontTemplate,
} from './types';
import { DEFAULT_SECTIONS, DEFAULT_TEMPLATE, getActiveColors } from '../_utils/colors';
import { buildFontStyles, resolveStorefrontFonts } from '../_utils/fonts';

interface StorefrontData {
  store: StorefrontStore;
  template: StorefrontTemplate;
  products: StorefrontProduct[];
}

export type StorefrontRootStyle = CSSProperties & {
  [key: `--${string}`]: string;
};

export interface StorefrontPageData extends StorefrontData {
  colors: ReturnType<typeof getActiveColors>;
  headingStyle: CSSProperties;
  bodyStyle: CSSProperties;
  fonts: StorefrontFonts;
  sections: SectionsConfig;
  announcement: StorefrontTemplate['announcementBar'];
  topBanners: string[];
  centerBanners: string[];
  upStoreBanners: string[];
  btwCatBanners: string[];
  enabledCategorySections: NonNullable<StorefrontTemplate['categorySections']>;
  rootStyle: StorefrontRootStyle;
}

export async function resolveStorefrontSubdomain() {
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

function buildRootStyle(
  template: StorefrontTemplate,
  colors: ReturnType<typeof getActiveColors>,
  bodyStyle: CSSProperties
): StorefrontRootStyle {
  const baseFontSizeRaw = (template as unknown as { baseFontSize?: string | number }).baseFontSize;
  const baseFontSize = Number(baseFontSizeRaw ?? 16);

  return {
    backgroundColor: colors.bg,
    color: colors.text,
    '--store-primary': colors.primary,
    '--store-accent': colors.accent,
    '--store-bg': colors.bg,
    '--store-text': colors.text,
    '--store-surface': `color-mix(in srgb, ${colors.bg} 94%, white 6%)`,
    '--store-surface-strong': `color-mix(in srgb, ${colors.bg} 88%, white 12%)`,
    '--store-surface-soft': `color-mix(in srgb, ${colors.primary} 6%, ${colors.bg} 94%)`,
    '--store-paper': `color-mix(in srgb, ${colors.bg} 74%, white 26%)`,
    '--store-paper-strong': `color-mix(in srgb, ${colors.bg} 62%, white 38%)`,
    '--store-tint': `color-mix(in srgb, ${colors.primary} 10%, ${colors.bg} 90%)`,
    '--store-tint-strong': `color-mix(in srgb, ${colors.primary} 16%, ${colors.bg} 84%)`,
    '--store-accent-soft': `color-mix(in srgb, ${colors.accent} 28%, ${colors.bg} 72%)`,
    '--store-border': `color-mix(in srgb, ${colors.primary} 14%, ${colors.bg} 86%)`,
    '--store-border-soft': `color-mix(in srgb, ${colors.primary} 10%, ${colors.bg} 90%)`,
    '--store-border-strong': `color-mix(in srgb, ${colors.primary} 22%, ${colors.bg} 78%)`,
    '--store-text-soft': `color-mix(in srgb, ${colors.text} 72%, ${colors.bg} 28%)`,
    '--store-text-muted': `color-mix(in srgb, ${colors.text} 58%, ${colors.bg} 42%)`,
    '--store-text-faint': `color-mix(in srgb, ${colors.text} 42%, ${colors.bg} 58%)`,
    '--store-primary-soft': `color-mix(in srgb, ${colors.primary} 12%, ${colors.bg} 88%)`,
    '--store-primary-faint': `color-mix(in srgb, ${colors.primary} 6%, ${colors.bg} 94%)`,
    '--store-gradient-brand': `linear-gradient(135deg, color-mix(in srgb, ${colors.accent} 78%, white 22%) 0%, ${colors.primary} 54%, color-mix(in srgb, ${colors.primary} 76%, ${colors.text} 24%) 100%)`,
    '--store-gradient-soft': `linear-gradient(180deg, color-mix(in srgb, ${colors.bg} 82%, white 18%) 0%, color-mix(in srgb, ${colors.primary} 8%, ${colors.bg} 92%) 100%)`,
    '--store-gradient-hero': `linear-gradient(135deg, color-mix(in srgb, ${colors.accent} 52%, white 48%) 0%, color-mix(in srgb, ${colors.bg} 76%, white 24%) 38%, color-mix(in srgb, ${colors.primary} 12%, ${colors.bg} 88%) 100%)`,
    '--store-gradient-overlay': `linear-gradient(180deg, transparent 0%, color-mix(in srgb, ${colors.text} 24%, transparent) 38%, color-mix(in srgb, ${colors.text} 82%, transparent) 100%)`,
    '--store-shadow-sm': `0 16px 34px -26px color-mix(in srgb, ${colors.text} 16%, transparent)`,
    '--store-shadow-soft': `0 18px 42px -30px color-mix(in srgb, ${colors.text} 14%, transparent)`,
    '--store-shadow-card': `0 24px 56px -36px color-mix(in srgb, ${colors.text} 18%, transparent)`,
    '--store-shadow-floating': `0 28px 72px -38px color-mix(in srgb, ${colors.primary} 36%, transparent)`,
    '--store-shadow-lg': `0 32px 78px -42px color-mix(in srgb, ${colors.text} 24%, transparent)`,
    '--store-radius': '20px',
    '--store-radius-lg': '24px',
    '--store-radius-xl': '28px',
    '--store-max-width': '1280px',
    ...bodyStyle,
    ...(Number.isFinite(baseFontSize) ? { fontSize: `${baseFontSize}px` } : {}),
  };
}

export async function getStorefrontData(): Promise<StorefrontData | null> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  const subdomain = await resolveStorefrontSubdomain();

  try {
    const storeRes = await fetch(
      `${baseUrl}/api/s/store?subdomain=${encodeURIComponent(subdomain)}`
    );
    if (!storeRes.ok) return null;

    const { store, template } = await storeRes.json();
    const productsRes = await fetch(`${baseUrl}/api/s/products?storeId=${store.id}`);
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

export async function getStorefrontPageData(): Promise<StorefrontPageData | null> {
  const data = await getStorefrontData();
  if (!data) return null;

  const { store, template, products } = data;
  const colors = getActiveColors(template);
  const { headingStyle, bodyStyle } = buildFontStyles(template);
  const fonts = resolveStorefrontFonts(template);

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

  return {
    ...data,
    colors,
    headingStyle,
    bodyStyle,
    fonts,
    sections,
    announcement,
    topBanners,
    centerBanners,
    upStoreBanners,
    btwCatBanners,
    enabledCategorySections,
    rootStyle: buildRootStyle(template, colors, bodyStyle),
  };
}

export function findStorefrontProduct(products: StorefrontProduct[], productId: string) {
  return products.find(product => product.id === productId) ?? null;
}
