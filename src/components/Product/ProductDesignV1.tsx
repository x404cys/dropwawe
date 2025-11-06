'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/app/lib/context/CartContext';
import { CiBookmark } from 'react-icons/ci';
import { useFavorite } from '@/app/lib/context/FavContext';
import { useState } from 'react';
import { Product } from '@/types/Products';
import { calculateDiscountedPrice } from '@/app/lib/utils/CalculateDiscountedPrice';

export default function ProductCardV1({ product }: { product: Product }) {
  const { addToCartByKey } = useCart();
  const { addToFavoriteByKey, removeFromFavoriteByKey, isInFavoriteByKey } = useFavorite();
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="group flex h-[350px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-300 hover:shadow-md">
      <Link
        href={`/store/products/${product.id}`}
        className="relative w-full cursor-pointer overflow-hidden"
      >
        {product.discount > 0 && (
          <span className="absolute top-1 left-1 z-10 rounded-full bg-green-400 px-2 py-0.5 text-[11px] font-semibold text-white shadow">
            -{product.discount}%
          </span>
        )}

        <div className="relative h-40 w-full overflow-hidden bg-white">
          <Image
            src={product.image as string}
            alt={product.name}
            fill
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-2 p-3">
        <Link href={`/store/products/${product.id}`} className="cursor-pointer space-y-1">
          <h2 className="line-clamp-1 h-[20px] text-xs font-semibold text-gray-800 hover:text-green-600">
            {product.name}
          </h2>
          <p className="line-clamp-2 h-[30px] text-[11px] leading-tight text-gray-500">
            {product.description?.substring(0, 60) + '......' || '—'}
          </p>

          {product.category && (
            <p className="text-[10px] text-gray-400">
              <span className="font-medium text-gray-700">{product.category}</span>
            </p>
          )}
        </Link>

        <div className="flex items-center justify-between text-xs">
          <div className="flex flex-col">
            {product.discount > 0 ? (
              <>
                <p className="text-sm font-bold text-green-700">
                  {calculateDiscountedPrice(product.price, product.discount).toLocaleString()} د.ع
                </p>
                <p className="text-[12px] text-gray-500 line-through">
                  {product.price.toLocaleString()} د.ع
                </p>
              </>
            ) : (
              <p className="text-sm font-bold text-green-700">
                {product.price.toLocaleString()} د.ع
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            disabled={isAdding}
            aria-label={`أضف ${product.name} إلى السلة`}
            className={`w-full rounded-md px-3 py-1.5 text-[11px] font-medium text-white transition ${
              isAdding ? 'cursor-not-allowed bg-gray-400' : 'bg-black hover:bg-green-500'
            }`}
          >
            {isAdding ? 'جارٍ الإضافة...' : 'أضف للسلة'}
          </button>
          <button className="rounded-md border p-1 transition">
            <CiBookmark size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
