'use client';

import { useProducts } from './Data/context/products/ProductsContext';
import { useTrackVisitor } from '@/app/lib/context/SaveVisitorId';
import ProductsListUnitComponents from './_units/ProductsListUnit/ProductsListUnitComponents';
import HeroBanner from '../store/_components/HeroBanner/HeroBanner';
import { useMemo } from 'react';

export default function Page() {
  const { product, store } = useProducts();
  useTrackVisitor(store?.subLink as string);

  return (
    <>
      <ProductsListUnitComponents />
    </>
  );
}
