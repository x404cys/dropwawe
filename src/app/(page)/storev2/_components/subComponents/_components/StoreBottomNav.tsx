'use client';

import { useEffect, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Loader from '@/components/Loader';
import { Home } from 'lucide-react';
import { BsBookmarks, BsInfoCircle } from 'react-icons/bs';
import { LuShoppingCart } from 'react-icons/lu';
import { useCart } from '@/app/lib/context/CartContext';
import { useState } from 'react';

interface StoreBottomNavProps {
  userId?: string;
}

export default function StoreBottomNav({ userId }: StoreBottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const slug = pathname.split('/')[2];
  const { getTotalQuantityByKey } = useCart();
  const [storeSlug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      const parts = host.split('.');
      if (parts.length > 2) {
        setSlug(parts[0]);
      }
    }
  }, []);
  const [isPending, startTransition] = useTransition();

  const keyName = `cart/${userId}` || 'cart';
  const totalQuantity = getTotalQuantityByKey(keyName);

  const handleNavigation = (path: string) => {
    startTransition(() => {
      router.push(path);
    });
  };

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <Loader />
          <span className="ml-3 text-gray-700">جاري التحميل...</span>
        </div>
      )}

      <div className="fixed bottom-3 left-1/2 z-50 -translate-x-1/2 pb-2 font-bold text-black md:hidden lg:hidden">
        <div className="flex w-65 items-center justify-between rounded-2xl border bg-white p-4 shadow-xl">
          <button onClick={() => handleNavigation('/')}>
            <Home size={24} className="text-black" />
          </button>

          <button
            onClick={() => handleNavigation(`/store/favorits/${userId}`)}
            className={`transition ${
              pathname.includes('FavoritesPage')
                ? 'text-green-600'
                : 'text-black opacity-80 hover:opacity-100'
            }`}
          >
            <BsBookmarks className="text-black" size={24} />
          </button>

          <div
            className={`relative cursor-pointer transition ${
              pathname.includes('cart')
                ? 'text-green-600'
                : 'text-black opacity-80 hover:opacity-100'
            }`}
            onClick={() => handleNavigation(`/store/cart/${userId}`)}
          >
            <LuShoppingCart className="font-bold text-black" size={24} />
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-4 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                {totalQuantity}
              </span>
            )}
          </div>

          <button
            onClick={() => handleNavigation(`/store/profile/${storeSlug}`)}
            className={`transition ${
              pathname.includes('profile')
                ? 'text-green-600'
                : 'text-black opacity-80 hover:opacity-100'
            }`}
          >
            <BsInfoCircle size={24} />
          </button>
        </div>
      </div>
    </>
  );
}
