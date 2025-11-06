'use client';

import { useEffect, useTransition, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { TbSmartHome } from 'react-icons/tb';
import { IoHeartOutline } from 'react-icons/io5';
import { MdOutlineDiscount } from 'react-icons/md';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { useCart } from '@/app/lib/context/CartContext';
import Loader from '@/components/Loader';
import { useProducts } from '../../Data/context/products/ProductsContext';

export default function StoreBottomNav() {
  const { store } = useProducts();
  const router = useRouter();
  const pathname = usePathname();
  const [storeSlug, setSlug] = useState<string | null>(null);
  const { getTotalQuantityByKey } = useCart();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      const parts = host.split('.');
      if (parts.length > 2) setSlug(parts[0]);
    }
  }, []);

  const keyName = `cart/${store?.id}` || 'cart';
  const totalQuantity = getTotalQuantityByKey(keyName);

  const handleNavigation = (path: string) => {
    setLoading(true);
    startTransition(() => {
      router.push(path);
      setLoading(false);
    });
  };

  const navItems = [
    {
      icon: <TbSmartHome size={25} />,
      path: '/storev2',
      activeFn: (pathname: string) => pathname === '/storev2' || pathname === '/',
    },
    {
      icon: <IoHeartOutline size={25} />,
      path: `/storev2/favorits/${store?.id}`,
      activeFn: (pathname: string) => pathname.includes('favorits'),
    },
    {
      icon: <HiOutlineShoppingCart size={25} />,
      path: `/storev2/cart/${store?.id}`,
      activeFn: (pathname: string) => pathname.includes('cart'),
      badge: totalQuantity,
    },
    {
      icon: <MdOutlineDiscount size={25} />,
      path: `/storev2/discount`,
      activeFn: (pathname: string) => pathname.includes('discount'),
    },
  ];

  const activeIndex = navItems.findIndex(item => item.activeFn(pathname));

  const isKnownPath = activeIndex !== -1;
  const finalActiveIndex = isKnownPath ? activeIndex : -1;

  return (
    <>
      {loading && <Loader />}
      <div
        dir="rtl"
        className="fixed right-0 bottom-3 left-0 z-50 mx-3 flex justify-between rounded-full border-x-4 border-[#292526] bg-[#292526] p-1 shadow-md md:hidden lg:hidden"
      >
        {isKnownPath && (
          <div
            className="absolute top-1 bottom-1 container rounded-full bg-white shadow-sm transition-all duration-150 ease-in-out"
            style={{
              width: `${100 / navItems.length}%`,
              right: `${(100 / navItems.length) * finalActiveIndex}%`,
            }}
          />
        )}

        {navItems.map(({ icon, path, badge, activeFn }, idx) => {
          const isActive = isKnownPath && activeFn(pathname);

          return (
            <div key={idx} className="relative flex flex-1 flex-col items-center">
              <button
                onClick={() => handleNavigation(path)}
                className={`relative flex transform items-center justify-center rounded-full p-2 transition hover:scale-105 ${
                  isActive ? 'text-black' : 'text-white opacity-80 hover:opacity-100'
                }`}
              >
                {icon}
                {(badge ?? 0) > 0 && (
                  <span className="absolute top-0 right-0 flex h-2 w-2 items-center justify-center rounded-full bg-red-600 p-2 text-xs font-bold text-white">
                    {badge}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
