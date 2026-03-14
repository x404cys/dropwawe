import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import AboutSection from './_components/sections/AboutSection';
import AnnouncementBar from './_components/AnnouncementBar';
import BannerCarousel from './_components/BannerCarousel';
import CtaSection from './_components/sections/CtaSection';
import FloatingWhatsApp from './_components/floating/FloatingWhatsApp';
import Footer from './_components/Footer';
import HeroSection from './_components/sections/HeroSection';
import ServicesSection from './_components/sections/ServicesSection';
import StorefrontClient from './_components/StorefrontClient';
import StoreSection from './_components/sections/StoreSection';
import TestimonialsSection from './_components/sections/TestimonialsSection';
import WorksSection from './_components/sections/WorksSection';
import type {
  AnnouncementBarConfig,
  SectionsConfig,
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

async function getStorefrontData(): Promise<StorefrontData | null> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  const subdomain = host.split('.')[0];

  try {
    const storeRes = await fetch(`${baseUrl}/api/s/store?subdomain=${subdomain}}`, {
      next: { revalidate: 30 },
    });
    if (!storeRes.ok) return null;

    const { store, template } = await storeRes.json();

    const productsRes = await fetch(`${baseUrl}/api/s/products?storeId=${store.id}`, {
      next: { revalidate: 30 },
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

  const sections: SectionsConfig = {
    ...DEFAULT_SECTIONS,
    ...((template.sectionsConfig as Partial<SectionsConfig>) ?? {}),
  };

  const announcement = template.announcementBar as AnnouncementBarConfig | null;
  const rawBanners = template.bannerImages ?? [];
  const topBanners: string[] = [];
  const centerBanners: string[] = [];
  for (const banner of rawBanners) {
    const position = (banner.postion || '').toLowerCase();
    if (position === 'center') {
      centerBanners.push(banner.url);
    } else {
      topBanners.push(banner.url);
    }
  }
  const enabledCategorySections = template.categorySections?.filter(cs => cs.enabled) ?? [];
  const waNumber = (template.whatsappNumber || store.phone || '').replace(/\s+/g, '');
  const baseFontSizeRaw = (template as unknown as { baseFontSize?: string | number }).baseFontSize;
  const baseFontSize = Number(baseFontSizeRaw ?? 16);
  const rootStyle = {
    backgroundColor: colors.bg,
    color: colors.text,
    ...bodyStyle,
    ...(Number.isFinite(baseFontSize) ? { fontSize: `${baseFontSize}px` } : {}),
  };

  return (
    <div className="min-h-screen" style={rootStyle}>
      {announcement?.enabled && <AnnouncementBar config={announcement} />}

      <StorefrontClient
        store={store}
        template={template}
        colors={colors}
        headingStyle={headingStyle}
        sections={sections}
      >
        {topBanners.length > 0 && <BannerCarousel banners={topBanners} colors={colors} />}

        {sections.hero && (
          <HeroSection template={template} colors={colors} headingStyle={headingStyle} />
        )}

        {sections.services && (
          <ServicesSection
            services={template.services}
            colors={colors}
            headingStyle={headingStyle}
            showWorksSection={sections.works}
          />
        )}

        {sections.store && (
          <StoreSection
            products={products}
            template={template}
            colors={colors}
            headingStyle={headingStyle}
            enabledCategorySections={enabledCategorySections}
            centerBanners={centerBanners}
          />
        )}

        {sections.testimonials && template.testimonials.length > 0 && (
          <TestimonialsSection
            testimonials={template.testimonials}
            colors={colors}
            headingStyle={headingStyle}
          />
        )}

        {sections.cta && (
          <CtaSection
            template={template}
            store={store}
            colors={colors}
            headingStyle={headingStyle}
          />
        )}

        {sections.about && (
          <AboutSection
            template={template}
            store={store}
            colors={colors}
            headingStyle={headingStyle}
          />
        )}

        <Footer store={store} template={template} colors={colors} />
      </StorefrontClient>

      {waNumber && <FloatingWhatsApp whatsappNumber={waNumber} />}
    </div>
  );
}
