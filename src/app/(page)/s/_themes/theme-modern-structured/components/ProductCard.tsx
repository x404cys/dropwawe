// THEME: modern-structured — ProductCard

'use client';

import Image from 'next/image';
import { Package } from 'lucide-react';
import type { ProductCardProps } from '../../../_lib/types';
import { useCart } from '../../../_context/CartContext';
import { productHasVariants } from '../../../_utils/cart';
import { getDiscountedPrice } from '../../../_utils/price';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';

export default function ModernStructuredProductCard({ product, colors, fonts }: ProductCardProps) {
  const { addToCart, setSelectedProduct } = useCart();
  const image = product.images?.[0]?.url || product.image || null;
  const finalPrice = getDiscountedPrice(product);
  const compareAtPrice =
    product.priceBeforeDiscount || ((product.discount ?? 0) > 0 ? product.price : null);
  const lowStock =
    typeof product.quantity === 'number' && product.quantity > 0 && product.quantity < 5;
  const visibleColors = product.colors?.slice(0, 5) ?? [];
  const remainingColors = Math.max((product.colors?.length ?? 0) - visibleColors.length, 0);
  const hasVariants = productHasVariants(product);

  return (
    <div className="group relative overflow-hidden rounded-xl">
      {/* DESIGN: The card exposes structure through consistent borders and reveals the add-to-cart action only when intent is clear. */}
      <article className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-150 ease-in-out hover:border-gray-300 hover:shadow-sm">
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
                className="object-contain p-4 transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-300">
                <Package className="h-8 w-8" />
              </div>
            )}

            <div className="absolute start-3 top-3 flex flex-wrap gap-1.5">
              {(product.discount ?? 0) > 0 ? (
                <span
                  className="rounded-md px-2 py-0.5 text-[10px] font-medium text-white"
                  style={{ backgroundColor: colors.accent, fontFamily: fonts.body }}
                >
                  SALE
                </span>
              ) : null}
              {lowStock ? (
                <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600">
                  Low stock
                </span>
              ) : null}
              {!lowStock && (product.discount ?? 0) === 0 ? (
                <span className="rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-white">
                  New
                </span>
              ) : null}
            </div>
          </div>

          <div className="border-t border-gray-100 p-4">
            <p
              className="mb-1.5 text-xs tracking-wide text-slate-400 uppercase"
              style={{ fontFamily: fonts.body }}
            >
              {product.category}
            </p>

            <h3
              className="line-clamp-2 text-sm leading-snug font-medium text-slate-900"
              style={{ fontFamily: fonts.heading }}
            >
              {product.name}
            </h3>

            <div className="mt-3 flex items-baseline gap-2">
              <span
                className="text-base font-semibold text-slate-900"
                style={{ fontFamily: fonts.heading }}
              >
                IQD {formatIQD(finalPrice)}
              </span>
              {compareAtPrice && compareAtPrice > finalPrice ? (
                <span className="text-sm text-slate-400 line-through">
                  {formatIQD(compareAtPrice)}
                </span>
              ) : null}
              {(product.discount ?? 0) > 0 ? (
                <span className="ms-auto text-xs font-medium" style={{ color: colors.accent }}>
                  -{product.discount}%
                </span>
              ) : null}
            </div>

            {visibleColors.length > 0 ? (
              <div className="mt-3 flex items-center gap-1.5">
                {visibleColors.map(color => (
                  <span
                    key={color.id}
                    className="h-4 w-4 rounded-full border border-gray-200"
                    style={color.hex ? { backgroundColor: color.hex } : undefined}
                    title={color.name}
                  />
                ))}
                {remainingColors > 0 ? (
                  <span className="text-xs text-slate-400">+{remainingColors}</span>
                ) : null}
              </div>
            ) : null}
          </div>
        </button>
      </article>

      <button
        type="button"
        onClick={() => (hasVariants ? setSelectedProduct(product) : addToCart(product))}
        className="absolute inset-x-0 bottom-0 translate-y-full bg-slate-900 py-2.5 text-center text-xs font-medium text-white transition-transform duration-200 ease-in-out group-hover:translate-y-0 hover:bg-slate-800"
        style={{ fontFamily: fonts.body }}
      >
        Add to cart
      </button>
    </div>
  );
}
