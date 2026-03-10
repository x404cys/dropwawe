'use client';

import { ReactNode } from 'react';
 import NavBarWrapper from './NavBar/NavBarWrapper';
import BottomBarWrapper from './BottomBar/BottomBarWrapper';
import { ProductsProvider } from '../../../context/products-context';

export default function ProvidersWrapper({ children }: { children: ReactNode }) {
  return (
    <ProductsProvider>
      <section className="theme1-root flex min-h-screen flex-col px-2">
        <NavBarWrapper />
        <main className="flex-1">{children}</main>
        <BottomBarWrapper />
      </section>
    </ProductsProvider>
  );
}
