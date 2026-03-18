'use client';

import type { ReactNode } from 'react';

import { ActiveColors, SectionsConfig, StorefrontStore } from '../_lib/types';
import { CartProvider, useCart } from '../_context/CartContext';
import CheckoutDrawer from './checkout/CheckoutDrawer';
import FloatingCart from './floating/FloatingCart';
import ProductModal from './product/ProductModal';

interface StorefrontClientProps {
  store: StorefrontStore;
  colors: ActiveColors;
  headingStyle: React.CSSProperties;
  sections: SectionsConfig;
  children: ReactNode;
  
}

function StorefrontInner({
  store,
  colors,
  headingStyle,
  sections,
  children,
}: StorefrontClientProps) {
  const { selectedProduct } = useCart();

  return (
    <>
      {children}

      {selectedProduct && (
        <ProductModal product={selectedProduct} colors={colors} headingStyle={headingStyle} />
      )}

      <CheckoutDrawer storeId={store.id} primaryColor={colors.primary} shippingPrice={store.shippingPrice} />
      {sections.store && <FloatingCart primaryColor={colors.primary} />}
    </>
  );
}

export default function StorefrontClient(props: StorefrontClientProps) {
  return (
    <CartProvider>
      <StorefrontInner {...props} />
    </CartProvider>
  );
}
