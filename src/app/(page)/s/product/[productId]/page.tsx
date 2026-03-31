import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import FloatingWhatsApp from '../../_components/floating/FloatingWhatsApp';
import StorefrontClient from '../../_components/StorefrontClient';
import ProductDetailsPage from '../../_components/product/ProductDetailsPage';
import { findStorefrontProduct, getStorefrontPageData } from '../../_lib/server-storefront';

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { productId } = await params;
  const data = await getStorefrontPageData();
  if (!data) return { title: 'Product' };

  const product = findStorefrontProduct(data.products, productId);
  if (!product) {
    return {
      title: data.store.name ?? 'Product',
    };
  }

  return {
    title: `${product.name} | ${data.store.name ?? 'Store'}`,
    description: product.description ?? data.template.tagline ?? data.store.description ?? '',
    openGraph: {
      title: product.name,
      description: product.description ?? data.template.tagline ?? data.store.description ?? '',
      images: product.image ? [{ url: product.image }] : [],
    },
  };
}

export default async function StorefrontProductPage({ params }: ProductPageProps) {
  const { productId } = await params;
  const data = await getStorefrontPageData();
  if (!data) notFound();

  const product = findStorefrontProduct(data.products, productId);
  if (!product) notFound();

  return (
    <div className="min-h-screen overflow-x-clip" style={data.rootStyle}>
      <StorefrontClient
        store={data.store}
        primaryColor={data.colors.primary}
        sections={data.sections}
        showFloatingCart={true}
        visit={{
          pageType: 'PRODUCT',
          entityType: 'PRODUCT',
          entityId: product.id,
          entityName: product.name,
          dedupeKey: `product:${data.store.subLink ?? data.store.id}:${product.id}`,
        }}
      >
        <ProductDetailsPage
          product={product}
          store={data.store}
          colors={data.colors}
          fonts={data.fonts}
          headingStyle={data.headingStyle}
        />
      </StorefrontClient>

      <FloatingWhatsApp template={data.template} store={data.store} />
    </div>
  );
}
