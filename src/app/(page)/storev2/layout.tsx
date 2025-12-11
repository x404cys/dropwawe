'use client';

import BottomBarUnit from './_components/UnitComponents/BottomBarUnit';
import NavBarUnit from './_components/UnitComponents/NavBar';
import ProductsProvider from './Data/context/products/ProductsContext';

export default function StoreLayout2({ children }: { children: React.ReactNode }) {
  const getSubdomain = () => {
    if (typeof window === 'undefined') return 'ali852';
    const host = window.location.hostname;
    const parts = host.split('.');
    if (parts.length > 2) return parts[0];
    return 'ali852';
  };
  const subLink = getSubdomain();

  return (
    <section className="md:mx-10">
      <div>
        <ProductsProvider subLink={subLink}>
          <NavBarUnit subLink={getSubdomain()} />
          {children}
          <div className="mt-20">
            <BottomBarUnit />
          </div>
        </ProductsProvider>
      </div>
    </section>
  );
}
