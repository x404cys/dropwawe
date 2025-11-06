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
import StoreBottomNav from '../../NavBar/BottomNavBar';
export default function FavoritesPage() {
  const { getFavoritesByKey, clearFavoritesByKey, getTotalFavoritesByKey } = useFavorite();
  const [favoriteItems, setFavoriteItems] = useState<Product[]>([]);
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const FAVORITE_KEY = `fav/${userId}`;

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
          className="transitio cursor-pointer bg-gray-950 text-sm text-white"
        >
          متابعة التسوق <FiShoppingBag />
        </Button>
        <StoreBottomNav />
      </div>
    );
  }

  return (
    <div dir="rtl" className="mx-auto max-w-7xl py-3">
      <header className="mb-10 flex justify-between gap-4 sm:flex-row sm:items-center">
        <button
          onClick={() => {
            clearFavoritesByKey(FAVORITE_KEY);
            setFavoriteItems([]);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-6 py-1 font-semibold text-white transition-colors duration-300 hover:bg-red-700 focus:ring-4 focus:ring-red-400 focus:outline-none"
          aria-label="حذف جميع المنتجات من المفضلة"
        >
          <MdClear />
        </button>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="text-sm transition hover:bg-gray-100"
        >
          متابعة التسوق <FiShoppingBag />
        </Button>
      </header>

      <div className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {favoriteItems.map(product => (
          <div
            key={product.id}
            className="group flex h-[270px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-300 hover:shadow-md"
          >
            <Link
              href={`/store/products/${product.id}`}
              className="relative h-28 w-full cursor-pointer overflow-hidden"
            >
              <div className="relative flex h-28 w-full items-center justify-center overflow-hidden bg-white">
                <Image
                  src={product.image || '/placeholder.png'}
                  alt={product.name}
                  width={400}
                  height={400}
                  priority
                  className="mx-auto max-h-28 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>

            <div className="flex flex-1 flex-col justify-between gap-2 p-3">
              <Link href={`/store/products/${product.id}`} className="cursor-pointer space-y-1">
                <h2 className="line-clamp-1 h-[20px] text-xs font-semibold text-gray-800 hover:text-green-600">
                  {product.name}
                </h2>

                <p className="line-clamp-2 h-[30px] text-[11px] leading-tight text-gray-500">
                  {product.description || '—'}
                </p>

                {product.category && (
                  <p className="text-[10px] text-gray-400">
                    <span className="font-medium text-gray-700">{product.category}</span>
                  </p>
                )}
              </Link>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-bold text-green-700">
                    {product.price.toLocaleString()} د.ع
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <StoreBottomNav />
    </div>
  );
}
