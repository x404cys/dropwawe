'use client';

import { useEffect, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Loader from '@/components/Loader';
import { Home } from 'lucide-react';
import { BsBookmarks } from 'react-icons/bs';
import { LuShoppingCart } from 'react-icons/lu';
import { useCart } from '@/app/lib/context/CartContext';
import { useState } from 'react';
import { CiDiscount1 } from 'react-icons/ci';

interface StoreBottomNavProps {
  userId?: string;
}

export default function BottomNavBarV2({ userId }: StoreBottomNavProps) {
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

      <div
        dir="rtl"
        className="fixed bottom-3 left-1/2 z-50 -translate-x-1/2 pb-2 font-bold text-black md:hidden lg:hidden"
      >
        <div className="flex w-72 items-center justify-between rounded-2xl border bg-white px-3 py-2 shadow-xl">
          <button
            onClick={() => handleNavigation('/')}
            className="flex flex-col items-center justify-center text-xs transition"
          >
            <Home size={22} className="text-black" />
            <span className="mt-1 text-[10px] text-gray-700">الرئيسية</span>
          </button>

          <button
            onClick={() => handleNavigation(`/store/favorits/${userId}`)}
            className={`flex flex-col items-center justify-center text-xs transition ${
              pathname.includes('favorits')
                ? 'text-green-600'
                : 'text-black opacity-80 hover:opacity-100'
            }`}
          >
            <BsBookmarks size={22} />
            <span className="mt-1 text-[10px]">المفضلة</span>
          </button>

          <button
            onClick={() => handleNavigation(`/store/cart/${userId}`)}
            className={`relative flex flex-col items-center justify-center text-xs transition ${
              pathname.includes('cart')
                ? 'text-green-600'
                : 'text-black opacity-80 hover:opacity-100'
            }`}
          >
            <LuShoppingCart size={22} className="font-bold" />
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
                {totalQuantity}
              </span>
            )}
            <span className="mt-1 text-[10px]">السلة</span>
          </button>

          <button
            onClick={() => handleNavigation(`/store/profile/${storeSlug}`)}
            className={`flex flex-col items-center justify-center text-xs transition ${
              pathname.includes('profile')
                ? 'text-green-600'
                : 'text-black opacity-80 hover:opacity-100'
            }`}
          >
            <CiDiscount1 size={22} />
            <span className="mt-1 text-[10px]">العروض</span>
          </button>
        </div>
      </div>
    </>
  );
}
