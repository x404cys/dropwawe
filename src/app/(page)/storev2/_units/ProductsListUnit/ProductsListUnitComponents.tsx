'use client';

import { useTrackVisitor } from '@/app/lib/context/SaveVisitorId';
import ProductsListTheme1 from './ProductsListTheme1';
import { StoreProps } from '@/types/store/StoreType';
import ProductsListTheme2 from './ProductsListTheme2';
import { useProducts } from '../../Data/context/products/ProductsContext';

export default function ProductsListUnitComponents() {
  const { product, filteredProductsByCategory, store } = useProducts();
  useTrackVisitor(store?.subLink as string);
  return (
    <>
      {store?.theme === 'MODERN' && (
        <ProductsListTheme2
          products={product}
          filteredProductsByCategory={filteredProductsByCategory}
          store={store as StoreProps}
        />
      )}
      {store?.theme === 'NORMAL' && (
        <ProductsListTheme1
          products={product}
          filteredProductsByCategory={filteredProductsByCategory}
          store={store as StoreProps}
        />
      )}
    </>
  );
}
