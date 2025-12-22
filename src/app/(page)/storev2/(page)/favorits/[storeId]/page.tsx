'use client';

import React, { useEffect, useState } from 'react';
import { useFavorite } from '@/app/lib/context/FavContext';
import { Button } from '@/components/ui/button';
import { useRouter, useParams } from 'next/navigation';
import { FiShoppingBag } from 'react-icons/fi';
import { MdClear } from 'react-icons/md';
import { Product } from '@/types/Products';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from '../../../Data/context/products/ProductsContext';
import ProductCardV1 from '@/components/Product/ProductDesignV1';

export default function FavoritesPage() {
  const { getFavoritesByKey, clearFavoritesByKey, getTotalFavoritesByKey } = useFavorite();
  const [favoriteItems, setFavoriteItems] = useState<Product[]>([]);
  const router = useRouter();
  const params = useParams();
  const storeId = params.storeId as string;
  const FAVORITE_KEY = `fav/${storeId}`;
  const { store } = useProducts();
  useEffect(() => {
    setFavoriteItems(getFavoritesByKey(FAVORITE_KEY));
  }, [getFavoritesByKey, FAVORITE_KEY]);

  const totalFavorites = getTotalFavoritesByKey(FAVORITE_KEY);

  if (totalFavorites === 0) {
    return (
      <div
        dir="rtl"
        className="flex flex-col items-center justify-center space-y-5 py-24 text-gray-400 select-none"
      >
        <h2 className="mb-3 text-4xl font-extrabold tracking-wide">المفضلة فارغة</h2>
        <p className="max-w-sm text-center text-lg">
          لم تضف أي منتج إلى المفضلة بعد. تصفح المنتجات وأضف ما يعجبك!
        </p>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="bg-s-950 h 0 flex cursor-pointer items-center gap-2 rounded-lg bg-sky-800 px-6 py-4 text-sm text-white transition"
        >
          متابعة التسوق <FiShoppingBag />
        </Button>
      </div>
    );
  }

  return (
    <div dir="rtl" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col justify-between gap-4">
        <div className="flex justify-between gap-3">
          <Button
            onClick={() => {
              clearFavoritesByKey(FAVORITE_KEY);
              setFavoriteItems([]);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2 font-semibold text-white transition hover:bg-red-600"
          >
            <MdClear />
            مسح الكل
          </Button>

          <Button
            onClick={() => router.back()}
            variant="outline"
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm transition hover:bg-gray-100"
          >
            متابعة التسوق <FiShoppingBag />
          </Button>
        </div>
      </header>

      <div dir="rtl" className="bg-white">
        <div className="mx-auto">
          <h2 className="sr-only">Products</h2>
          <div className=" ">
            {/* {store?.theme === 'NORMAL' && <ProductCardV1 products={favoriteItems} />} */}
          </div>
        </div>
      </div>
    </div>
  );
}
