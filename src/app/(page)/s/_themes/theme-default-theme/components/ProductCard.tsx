// THEME: default-theme - ProductCard

'use client';

import { Heart, Package, ShoppingCart, Star, Truck } from 'lucide-react';
import type { ProductCardProps } from '../../../_lib/types';
import { useCart } from '../../../_context/CartContext';
import { formatPrice, getDiscountedPrice } from '../../../_utils/price';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';

export default function DefaultThemeProductCard({ product, colors, fonts }: ProductCardProps) {
  const { addToCart, liked, setSelectedProduct, toggleLike } = useCart();
  const finalPrice = getDiscountedPrice(product);
  const image = product.images?.[0]?.url || product.image || null;
  const colorOptions = (product.colors ?? []).slice(0, 3);
  const compareAtPrice =
    (product.discount ?? 0) > 0 ? (product.priceBeforeDiscount ?? product.price) : null;
  const isOutOfStock = !product.unlimited && product.quantity === 0;
  const lowStock = !product.unlimited && product.quantity > 0 && product.quantity < 5;
  const isLiked = liked.includes(product.id);

  return (
    <article
      className={`group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-200 ease-in-out ${
        isOutOfStock ? 'opacity-70' : 'hover:-translate-y-0.5 hover:shadow-md'
      }`}
    >
      {/* DESIGN: The card keeps the original storefront hierarchy: media first, compact metadata, full-width add button. */}
      <div className="relative">
        <button
          type="button"
          onClick={() => !isOutOfStock && setSelectedProduct(product)}
          disabled={isOutOfStock}
          className="block w-full text-start disabled:cursor-not-allowed"
        >
          <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-50 sm:h-36">
            {image ? (
              <img
                src={image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-300">
                <Package className="h-8 w-8 transition-transform duration-300 ease-in-out group-hover:scale-110" />
              </div>
            )}

            <div className="absolute start-2 top-2 flex flex-col gap-1">
              {(product.discount ?? 0) > 0 ? (
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-[8px] font-bold text-white">
                  خصم {product.discount}%
                </span>
              ) : null}

              {isOutOfStock ? (
                <span className="rounded-full bg-gray-900 px-2 py-0.5 text-[8px] font-bold text-white">
                  نفد المخزون
                </span>
              ) : lowStock ? (
                <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[8px] font-bold text-white">
                  آخر {product.quantity} قطع
                </span>
              ) : null}
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => toggleLike(product.id)}
          className="absolute end-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm transition-transform duration-200 ease-in-out hover:scale-105"
          aria-label="إعجاب"
        >
          <Heart
            className={`h-3.5 w-3.5 ${isLiked ? 'fill-current text-red-500' : 'text-gray-500'}`}
          />
        </button>
      </div>

      <button
        type="button"
        onClick={() => !isOutOfStock && setSelectedProduct(product)}
        disabled={isOutOfStock}
        className="block w-full px-3 pt-3 text-start disabled:cursor-not-allowed"
      >
        <p
          className="mb-1 line-clamp-2 text-[11px] leading-tight font-bold text-gray-900"
          style={{ fontFamily: fonts.heading }}
        >
          {product.name}
        </p>

        <span className="my-1 line-clamp-2 text-xs">{product.description}</span>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold" style={{ color: colors.primary }}>
            {formatIQD(finalPrice)} د.ع
          </span>
          {compareAtPrice && compareAtPrice > finalPrice ? (
            <span className="text-[9px] text-gray-400 line-through">
              {formatIQD(compareAtPrice)} د.ع
            </span>
          ) : null}
        </div>

        {colorOptions.length > 0 ? (
          <div className="mt-2 flex items-center gap-1.5">
            {colorOptions.map(color => (
              <span
                key={color.id}
                className="h-4 w-4 rounded-full border border-gray-200"
                style={{ backgroundColor: color.hex || color.name }}
                title={color.name}
              />
            ))}
            {(product.colors?.length ?? 0) > colorOptions.length ? (
              <span className="text-[10px] text-gray-400">
                +{(product.colors?.length ?? 0) - colorOptions.length}
              </span>
            ) : null}
          </div>
        ) : null}
      </button>

      <div className="px-3 pt-2 pb-3">
        <button
          type="button"
          onClick={() => addToCart(product)}
          disabled={isOutOfStock}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[11px] font-bold text-white transition-transform duration-200 ease-in-out active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300"
          style={isOutOfStock ? undefined : { backgroundColor: colors.primary }}
        >
          {isOutOfStock ? <Truck className="h-3 w-3" /> : <ShoppingCart className="h-3 w-3" />}
          {isOutOfStock ? 'غير متاح حالياً' : 'أضف للسلة'}
        </button>
      </div>
    </article>
  );
}
