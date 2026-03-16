// THEME: minimal-light — ProductCard

'use client';

import Image from 'next/image';
import { Package } from 'lucide-react';
import type { ProductCardProps } from '../../../_lib/types';
import { getDiscountedPrice } from '../../../_utils/price';
import { useCart } from '../../../_context/CartContext';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';

export default function MinimalLightProductCard({ product, colors, fonts }: ProductCardProps) {
  const { setSelectedProduct } = useCart();
  const finalPrice = getDiscountedPrice(product);
  const primaryImage = product.images?.[0]?.url || product.image || null;
  const compareAtPrice =
    product.priceBeforeDiscount || ((product.discount ?? 0) > 0 ? product.price : null);

  return (
    <article className="group h-full bg-white transition-colors duration-200 hover:bg-stone-50">
      <button
        type="button"
        onClick={() => setSelectedProduct(product)}
        className="flex h-full w-full flex-col text-start"
      >
        <div className="relative aspect-square overflow-hidden bg-stone-100">
          {primaryImage ? (
            <Image src={primaryImage} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-8 w-8 text-stone-300" />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <p
            className="text-[10px] font-medium tracking-[0.18em] text-stone-500 uppercase"
            style={{ fontFamily: fonts.body }}
          >
            {product.category}
          </p>

          <h3
            className="text-sm leading-6 font-medium text-stone-900"
            style={{ fontFamily: fonts.heading }}
          >
            {product.name}
          </h3>

          <div className="mt-auto flex items-center gap-3">
            <span className="text-sm font-semibold text-stone-900" style={{ color: colors.accent }}>
              {formatIQD(finalPrice)}
            </span>

            {compareAtPrice && compareAtPrice > finalPrice ? (
              <span className="text-xs text-stone-400 line-through">
                {formatIQD(compareAtPrice)}
              </span>
            ) : null}
          </div>
        </div>
      </button>
    </article>
  );
}
