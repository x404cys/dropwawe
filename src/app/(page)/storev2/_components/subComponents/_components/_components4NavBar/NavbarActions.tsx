'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PiShoppingCartSimple } from 'react-icons/pi';
import { BsBookmarks } from 'react-icons/bs';
import { useCart } from '@/app/lib/context/CartContext';
type NavbarActionsProps = {
  userId: string;
  storeSlug: string;
};
export default function NavbarActions({ userId, storeSlug }: NavbarActionsProps) {
  const [showCart, setShowCart] = useState(false);
  const { getCartByKey, getTotalQuantityByKey } = useCart();

  const cartKey = `cart/${userId}`;

  const cartItems = getCartByKey(cartKey);
  const totalQuantity = getTotalQuantityByKey(cartKey);

  return (
    <div className="relative hidden items-center gap-4 md:flex">
      <button
        onClick={() => setShowCart(prev => !prev)}
        className="relative cursor-pointer rounded-lg border border-gray-300 p-2"
      >
        <PiShoppingCartSimple className="text-xl" />
        {totalQuantity > 0 && (
          <span className="absolute -top-1 -right-3 rounded-full bg-red-500 px-1 py-0.5 text-xs text-white">
            {totalQuantity}
          </span>
        )}
      </button>

      <Link
        className="rounded-lg border border-gray-300 p-2"
        href={userId ? `/store/favorits/${userId}` : '#'}
      >
        <BsBookmarks className="text-xl" />
      </Link>

      {showCart && (
        <div
          className="absolute top-12 left-14 z-50 w-screen max-w-sm rounded-md border border-gray-600 bg-white px-4 py-8 shadow-lg sm:px-6 lg:px-8"
          aria-modal="true"
          role="dialog"
        >
          <button
            onClick={() => setShowCart(false)}
            className="absolute end-4 top-4 text-gray-600 transition hover:scale-110"
          >
            <span className="sr-only">Close cart</span>✕
          </button>

          <div className="mt-4 space-y-6">
            <ul className="max-h-60 space-y-4 overflow-auto">
              {cartItems.length > 0 ? (
                cartItems.map(item => (
                  <li key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="size-16 rounded-sm object-cover"
                    />
                    <div>
                      <h3 className="text-sm text-gray-900">{item.name}</h3>
                      <p className="text-xs text-gray-600">{item.price} ر.س</p>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-center text-sm text-gray-500">السلة فارغة</p>
              )}
            </ul>

            <div className="space-y-4 text-center">
              <Link
                onClick={() => setShowCart(false)}
                href={`/store/cart/${userId}`}
                className="block rounded-sm border border-gray-600 bg-gray-950 px-5 py-3 text-sm text-white transition hover:ring-1 hover:ring-gray-400"
              >
                عرض السلة ({totalQuantity})
              </Link>

              <button
                onClick={() => setShowCart(false)}
                className="block w-full rounded-sm border border-gray-600 px-5 py-3 text-sm text-gray-600 transition hover:ring-1 hover:ring-gray-400"
              >
                متابعة التسوق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
