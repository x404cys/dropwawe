// THEME: clean-marketplace - ProductCard

'use client';

import Image from 'next/image';
import { Package } from 'lucide-react';
import type { ProductCardProps } from '../../../_lib/types';
import { useCart } from '../../../_context/CartContext';
import { getDiscountedPrice } from '../../../_utils/price';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';

export default function CleanMarketplaceProductCard({ product, fonts }: ProductCardProps) {
  const { setSelectedProduct } = useCart();
  const finalPrice = getDiscountedPrice(product);
  const compareAtPrice =
    product.priceBeforeDiscount || ((product.discount ?? 0) > 0 ? product.price : null);
  const image = product.images?.[0]?.url || product.image || null;
  const visibleColors = product.colors?.slice(0, 4) ?? [];
  const remainingColors = Math.max((product.colors?.length ?? 0) - visibleColors.length, 0);
  const showLowStock =
    typeof product.quantity === 'number' && product.quantity > 0 && product.quantity < 5;

  return (
    <article className="overflow-hidden rounded-xl border border-gray-100 bg-white transition-shadow duration-200 ease-in-out hover:shadow-md">
      {/* DESIGN: The card is image-first and compact so the grid feels like a real marketplace catalog, not a promo gallery. */}
      <button
        type="button"
        onClick={() => setSelectedProduct(product)}
        className="block w-full text-start"
      >
        <div className="relative aspect-square overflow-hidden rounded-t-xl bg-gray-50">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-contain p-2 transition-transform duration-300 ease-in-out hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-300">
              <Package className="h-8 w-8" />
            </div>
          )}

          <div className="absolute start-2 top-2 flex flex-col gap-1">
            {(product.discount ?? 0) > 0 ? (
              <span className="rounded-md bg-red-500 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                -{product.discount}%
              </span>
            ) : null}
            {showLowStock ? (
              <span className="rounded-md bg-orange-500 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                آخر القطع
              </span>
            ) : null}
          </div>
        </div>

        <div className="px-3 pt-2 pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1" dir="ltr">
              <span className="text-[11px] font-semibold text-gray-500">IQD</span>
              <span className="text-sm font-bold text-gray-900">{formatIQD(finalPrice)}</span>
              {compareAtPrice && compareAtPrice > finalPrice ? (
                <span className="me-1 text-xs text-gray-400 line-through">
                  {formatIQD(compareAtPrice)}
                </span>
              ) : null}
            </div>

            {(product.discount ?? 0) > 0 ? (
              <span className="rounded bg-red-50 px-1 py-0.5 text-[10px] text-red-500">خصم</span>
            ) : null}
          </div>

          <p
            className="mt-1 line-clamp-2 text-xs leading-snug text-gray-600"
            style={{ fontFamily: fonts.heading }}
          >
            {product.name}
          </p>

          {visibleColors.length > 0 ? (
            <div className="mt-2 flex items-center gap-1">
              {visibleColors.map(color => (
                <span
                  key={color.id}
                  className="h-4 w-4 rounded-full border border-gray-200"
                  style={color.hex ? { backgroundColor: color.hex } : undefined}
                  title={color.name}
                />
              ))}
              {remainingColors > 0 ? (
                <span className="text-[10px] text-gray-400">+{remainingColors}</span>
              ) : null}
            </div>
          ) : null}
        </div>
      </button>
    </article>
  );
}
