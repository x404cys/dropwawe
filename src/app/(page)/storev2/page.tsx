'use client';

import { StoreProps } from '@/types/store/StoreType';
import CategoriesList from './_components/CategoriesList/CategoriesList';
import { useProducts } from './Data/context/products/ProductsContext';
import ProductsList from './Data/products/ProductsList';
import { useTrackVisitor } from '@/app/lib/context/SaveVisitorId';

export default function Page() {
  const { product, filteredProductsByCategory, store } = useProducts();
  useTrackVisitor(store?.subLink as string);
  return (
    <>
      <CategoriesList />
      <ProductsList
        products={product}
        filteredProductsByCategory={filteredProductsByCategory}
        store={store as StoreProps}
      />
    </>
  );
}
