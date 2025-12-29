'use client';

import { useEffect, useRef, useState } from 'react';
import getProductsByStore, { Store } from '@/app/axios/products/getProductByStore';

import { Product } from '@/types/Products';
import { useTrackVisitor } from '@/app/lib/context/SaveVisitorId';
import StoreCategoriesBar from '../storev2/_components/subComponents/_components/StoreCategoriesBar';
import StoreProductGrid from '../storev2/_components/subComponents/_components/StoreProductGrid';

export default function StorePage() {
  useTrackVisitor('storeSlug');

  return (
    <section>
      
    </section>
  );
}
