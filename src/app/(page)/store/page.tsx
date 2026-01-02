'use client';

import { useEffect, useRef, useState } from 'react';
import getProductsByStore, { Store } from '@/app/axios/products/getProductByStore';

import { Product } from '@/types/Products';
import { useTrackVisitor } from '@/app/lib/context/SaveVisitorId';
import StoreCategoriesBar from '../storev2/_components/subComponents/_components/StoreCategoriesBar';
import StoreProductGrid from '../storev2/_components/subComponents/_components/StoreProductGrid';
import { Nav } from 'react-day-picker';
import NavBarV2 from './_components/NavBar/NavBar-v2';
import ProductsList from './_components/Products-List/ProductsList';
import { StoreProps } from '@/types/store/StoreType';
import { useProducts } from './Data/context/products/ProductsContext';
import HeroBanner from './_components/HeroBanner/HeroBanner';
import CategoriesList from './_components/CategoriesList/CategoriesList';

export default function StorePage() {
  const { product, filteredProductsByCategory, store } = useProducts();
  useTrackVisitor(store?.subLink as string);

  return (
    <section className="space-y-10">
      <HeroBanner
        title="Dior Sauvage"
        subtitle="عطر رجالي فاخر"
        description="تجربة عطرية جريئة تجمع بين الانتعاش والقوة، مستوحاة من الطبيعة البرية."
        image="/Dior Sauvage Luxury Perfume Banner.png"
        ctaText="اشتري الآن"
        ctaLink="/storev2/products"
      />
      <CategoriesList />
      <ProductsList
        products={product}
        filteredProductsByCategory={filteredProductsByCategory}
        store={store as StoreProps}
      />
    </section>
  );
}
