'use client';

import BottomBarUnit from './_components/UnitComponents/BottomBarUnit';
import NavBarUnit from './_components/UnitComponents/NavBar';
import NavBarUnitComponents from './_units/NavBarUnit/NavBarUnitComponents';
import ProductsProvider from './Data/context/products/ProductsContext';

export default function StoreLayout2({ children }: { children: React.ReactNode }) {
  const getSubdomain = () => {
    if (typeof window === 'undefined') return 'abdulrqhman';
    const host = window.location.hostname;
    const parts = host.split('.');
    if (parts.length > 2) return parts[0];
    return 'abdulrqhman';
  };
  const subLink = getSubdomain();

  return (
    <section className="px-1 md:mx-10">
      <div>
        <ProductsProvider subLink={subLink}>
          <NavBarUnitComponents />
          {children}
          <div className="mt-20">
            <BottomBarUnit />
          </div>
        </ProductsProvider>
      </div>
    </section>
  );
}
