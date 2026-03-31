import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import CheckoutPage from '../_components/checkout/CheckoutPage';
import FloatingWhatsApp from '../_components/floating/FloatingWhatsApp';
import StorefrontClient from '../_components/StorefrontClient';
import { getStorefrontPageData } from '../_lib/server-storefront';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getStorefrontPageData();
  if (!data) return { title: 'Checkout' };

  return {
    title: `${data.store.name ?? 'Store'} | Checkout`,
    description: data.template.tagline ?? data.store.description ?? '',
  };
}

export default async function StorefrontCheckoutPage() {
  const data = await getStorefrontPageData();
  if (!data) notFound();

  return (
    <div className="min-h-screen overflow-x-clip" style={data.rootStyle}>
      <StorefrontClient
        store={data.store}
        primaryColor={data.colors.primary}
        showFloatingCart={false}
        visit={{
          pageType: 'CHECKOUT',
          entityType: 'STORE',
          entityId: data.store.id,
          entityName: data.store.name ?? data.store.subLink,
          dedupeKey: `checkout:${data.store.subLink ?? data.store.id}`,
        }}
      >
        <CheckoutPage
          storeId={data.store.id}
          storeSlug={data.store.subLink}
          storeName={data.store.name}
          primaryColor={data.colors.primary}
          shippingPrice={data.store.shippingPrice}
        />
      </StorefrontClient>

      <FloatingWhatsApp template={data.template} store={data.store} />
    </div>
  );
}
