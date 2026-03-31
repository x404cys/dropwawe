// THEME: tech-futuristic - ProductCard

'use client';

import Image from 'next/image';
import { Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ProductCardProps } from '../../../_lib/types';
import { getDiscountedPrice } from '../../../_utils/price';
import { buildStorefrontProductPath } from '../../../_utils/routes';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';

export default function TechFuturisticProductCard({ product, colors, fonts }: ProductCardProps) {
  const router = useRouter();
  const primaryImage = product.images?.[0]?.url || product.image || null;
  const finalPrice = getDiscountedPrice(product);
  const compareAtPrice =
    product.priceBeforeDiscount || ((product.discount ?? 0) > 0 ? product.price : null);
  const isLowStock =
    typeof product.quantity === 'number' && product.quantity > 0 && product.quantity < 5;
  const isOutOfStock = !product.unlimited && product.quantity === 0;

  return (
    <article
      className="group h-full transition-all duration-150 ease-out"
      style={{ background: colors.bg }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = colors.text + '08';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = colors.bg;
      }}
    >
      <button
        type="button"
        onClick={() => router.push(buildStorefrontProductPath(product.id))}
        className="flex h-full w-full flex-col text-start transition-all duration-150 ease-out focus:outline-none"
        style={{
          border: `0.5px solid ${colors.text + '0f'}`,
          opacity: isOutOfStock ? 0.5 : 1,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = colors.text + '1f';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = colors.text + '0f';
        }}
      >
        {/* ── IMAGE ── */}
        <div
          className="relative aspect-square border-b"
          style={{
            background: colors.text + '08',
            borderColor: colors.text + '0f',
          }}
        >
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className="object-contain p-6 transition-all duration-150 ease-out group-hover:brightness-110"
            />
          ) : (
            <div
              className="flex h-full items-center justify-center"
              style={{ color: colors.text + '33' }}
            >
              <Package className="h-8 w-8" />
            </div>
          )}

          {/* Discount badge */}
          {(product.discount ?? 0) > 0 && (
            <div
              className="absolute start-2 top-2 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.16em] uppercase"
              style={{
                background: colors.accent,
                color: colors.bg,
                fontFamily: fonts.body,
              }}
            >
              -{product.discount}%
            </div>
          )}
        </div>

        {/* ── BODY ── */}
        <div className="flex flex-1 flex-col p-4">
          {/* Category */}
          <p
            className="font-mono text-[10px] tracking-[0.22em] uppercase"
            style={{ fontFamily: fonts.body, color: colors.text + '4d' }}
          >
            {product.category}
          </p>

          {/* Name */}
          <h3
            className="mt-1 font-mono text-sm leading-tight"
            style={{ fontFamily: fonts.heading, color: colors.text }}
          >
            {product.name}
          </h3>

          {/* Price row */}
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {compareAtPrice && compareAtPrice > finalPrice && (
                <span
                  className="font-mono text-xs line-through"
                  style={{ fontFamily: fonts.body, color: colors.text + '4d' }}
                >
                  {formatIQD(compareAtPrice)}
                </span>
              )}
              <span
                className="font-mono text-sm"
                style={{ color: colors.accent, fontFamily: fonts.body }}
              >
                {formatIQD(finalPrice)}
              </span>
            </div>

            {/* Stock status */}
            {isOutOfStock ? (
              <span
                className="font-mono text-[10px] tracking-[0.2em] uppercase"
                style={{ fontFamily: fonts.body, color: colors.text + '4d' }}
              >
                OUT OF STOCK
              </span>
            ) : isLowStock ? (
              <span
                className="font-mono text-[10px] tracking-[0.2em] uppercase"
                style={{ fontFamily: fonts.body, color: colors.accent }}
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
