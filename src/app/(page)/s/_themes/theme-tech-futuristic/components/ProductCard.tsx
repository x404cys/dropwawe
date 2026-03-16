// THEME: tech-futuristic - ProductCard

'use client';

import Image from 'next/image';
import { Package } from 'lucide-react';
import type { ProductCardProps } from '../../../_lib/types';
import { useCart } from '../../../_context/CartContext';
import { getDiscountedPrice } from '../../../_utils/price';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';

export default function TechFuturisticProductCard({ product, colors, fonts }: ProductCardProps) {
  const { setSelectedProduct } = useCart();
  const primaryImage = product.images?.[0]?.url || product.image || null;
  const finalPrice = getDiscountedPrice(product);
  const compareAtPrice =
    product.priceBeforeDiscount || ((product.discount ?? 0) > 0 ? product.price : null);
  const isLowStock =
    typeof product.quantity === 'number' && product.quantity > 0 && product.quantity < 5;

  return (
    <article className="group h-full bg-[#0f0f0f] transition-all duration-150 ease-out hover:bg-[#141414]">
      {/* DESIGN: The card keeps a visible 1px shell so the catalog reads like a control grid. */}
      <button
        type="button"
        onClick={() => setSelectedProduct(product)}
        className="flex h-full w-full flex-col border border-white/[0.06] text-start transition-all duration-150 ease-out hover:border-white/[0.12] focus:outline-none"
      >
        <div className="relative aspect-square border-b border-white/[0.06] bg-[#161616]">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className="object-contain p-6 transition-all duration-150 ease-out group-hover:brightness-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white/20">
              <Package className="h-8 w-8" />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <p
            className="font-mono text-[10px] tracking-[0.22em] text-white/30 uppercase"
            style={{ fontFamily: fonts.body }}
          >
            {product.category}
          </p>

          <h3
            className="mt-1 font-mono text-sm leading-tight text-[#f2f2f2]"
            style={{ fontFamily: fonts.heading }}
          >
            {product.name}
          </h3>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {compareAtPrice && compareAtPrice > finalPrice ? (
                <span
                  className="font-mono text-xs text-white/30 line-through"
                  style={{ fontFamily: fonts.body }}
                >
                  {formatIQD(compareAtPrice)}
                </span>
              ) : null}
              <span
                className="font-mono text-sm text-[#f2f2f2]"
                style={{ color: colors.accent, fontFamily: fonts.body }}
              >
                {formatIQD(finalPrice)}
              </span>
            </div>

            {isLowStock ? (
              <span
                className="font-mono text-[10px] tracking-[0.2em] uppercase"
                style={{ color: colors.accent, fontFamily: fonts.body }}
              >
                LOW STOCK
              </span>
            ) : null}
          </div>
        </div>
      </button>
    </article>
  );
}
