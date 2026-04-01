import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import FloatingWhatsApp from './_components/floating/FloatingWhatsApp';
import StorefrontClient from './_components/StorefrontClient';
import StorefrontShell from './_components/StorefrontShell';
import { getStorefrontPageData } from './_lib/server-storefront';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getStorefrontPageData();
  if (!data) return { title: 'Store' };

  const { store, template } = data;
  return {
    title: store.name ?? 'Store',
    description: template?.tagline ?? store.description ?? '',
    openGraph: {
      title: store.name ?? 'Store',
      description: template?.tagline ?? store.description ?? '',
      images: store.image ? [{ url: store.image }] : [],
      locale: 'ar_IQ',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: store.name ?? 'Store',
      description: template?.tagline ?? store.description ?? '',
      images: store.image ? [store.image] : [],
    },
    icons: { icon: store.image ?? '/favicon.ico' },
  };
}

export default async function StorefrontPage() {
  const data = await getStorefrontPageData();
  if (!data) notFound();

  return (
    <div className="min-h-screen overflow-x-clip" style={data.rootStyle}>
      <StorefrontClient
        store={data.store}
        primaryColor={data.colors.primary}
        sections={data.sections}
        visit={{
          pageType: 'STORE_HOME',
          entityType: 'STORE',
          entityId: data.store.id,
          entityName: data.store.name ?? data.store.subLink,
        }}
      >
        <StorefrontShell
          store={data.store}
          template={data.template}
          products={data.products}
          colors={data.colors}
          fonts={data.fonts}
          sections={data.sections}
          announcement={data.announcement}
          topBanners={data.topBanners}
          centerBanners={data.centerBanners}
          upStoreBanners={data.upStoreBanners}
          btwCatBanners={data.btwCatBanners}
          enabledCategorySections={data.enabledCategorySections}
        />
      </StorefrontClient>

      <FloatingWhatsApp template={data.template} store={data.store} />
    </div>
  );
}
