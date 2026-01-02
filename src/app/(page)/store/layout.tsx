'use client';

import { useEffect, useState } from 'react';

import { UserProps } from '@/types/Products';
import ProductsProvider from './Data/context/products/ProductsContext';
import NavBarV2 from './_components/NavBar/NavBar-v2';
import StoreNavBarTheme1 from './_units/NavBarUnit/NavBarTheme1';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(true);

  const getSubdomain = () => {
    if (typeof window === 'undefined') return 'abdulrqhman';
    const host = window.location.hostname;
    const parts = host.split('.');
    if (parts.length > 2) return parts[0];
    return 'abdulrqhman';
  };
  const subLink = getSubdomain();

  return (
    <section className="md:mx-40">
      <div>
        <ProductsProvider subLink={subLink}>
          <StoreNavBarTheme1 />
        </ProductsProvider>
        <ProductsProvider subLink={subLink}>{children}</ProductsProvider>
      </div>
    </section>
  );
}
