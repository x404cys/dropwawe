'use client';

import type { ReactNode } from 'react';

import {
  ActiveColors,
  SectionsConfig,
  StorefrontStore,
  StorefrontTemplate,
} from '../_lib/types';
import { CartProvider, useCart } from '../_context/CartContext';
import CheckoutDrawer from './checkout/CheckoutDrawer';
import FloatingCart from './floating/FloatingCart';
import Navbar from './Navbar';
import ProductModal from './product/ProductModal';

interface StorefrontClientProps {
  store: StorefrontStore;
  template: StorefrontTemplate;
  colors: ActiveColors;
  headingStyle: React.CSSProperties;
  sections: SectionsConfig;
  children: ReactNode;
}

function StorefrontInner({
  store,
  template,
  colors,
  headingStyle,
  sections,
  children,
}: StorefrontClientProps) {
  const { selectedProduct } = useCart();

  return (
    <>
      <Navbar
        store={store}
        template={template}
        colors={colors}
        headingStyle={headingStyle}
        sections={sections}
      />

      {children}

      {selectedProduct && (
        <ProductModal product={selectedProduct} colors={colors} headingStyle={headingStyle} />
      )}

      <CheckoutDrawer storeId={store.id} primaryColor={colors.primary} />
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
