// THEME: glassmorphism — ProductCard

'use client';

import Image from 'next/image';
import { Heart, Package } from 'lucide-react';
import type { MouseEvent } from 'react';
import type { ProductCardProps } from '../../../_lib/types';
import { useCart } from '../../../_context/CartContext';
import { useLikes } from '../../../_hooks/useLikes';
import { productHasVariants } from '../../../_utils/cart';
import { formatPrice, getDiscountedPrice } from '../../../_utils/price';

export default function GlassmorphismProductCard({ product, colors, fonts }: ProductCardProps) {
  const { addToCart, setSelectedProduct } = useCart();
  const { liked, toggleLike } = useLikes();
  const image = product.images?.[0]?.url || product.image || null;
  const discountedPrice = getDiscountedPrice(product);
  const isLiked = liked.includes(product.id);
  const isSoldOut = !product.unlimited && product.quantity === 0;
  const isLowStock = !product.unlimited && product.quantity > 0 && product.quantity < 5;
  const visibleColors = product.colors?.slice(0, 5) ?? [];
  const remainingColors = Math.max((product.colors?.length ?? 0) - visibleColors.length, 0);

  const openProduct = () => {
    if (isSoldOut) return;
    setSelectedProduct(product);
  };

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (isSoldOut) return;
    if (productHasVariants(product)) {
      setSelectedProduct(product);
      return;
    }
    addToCart(product);
  };

  const handleToggleLike = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    toggleLike(product.id);
  };

  return (
    <div className="group relative">
      {/* DESIGN: Product cards stay translucent and layered so interactions feel like floating glass panels rather than opaque retail tiles. */}
      <article
        className={`overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.05] backdrop-blur-xl transition-all duration-200 ease-in-out ${
          isSoldOut
            ? 'cursor-not-allowed opacity-60'
            : 'cursor-pointer hover:border-white/[0.15] hover:bg-white/[0.09]'
        }`}
      >
        <button
          type="button"
          onClick={openProduct}
          disabled={isSoldOut}
          className="block w-full text-start"
        >
          <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-white/[0.03]">
            {image ? (
              <Image
                src={image}
                alt={product.name}
                fill
                className="object-contain p-3 transition-transform duration-500 ease-in-out group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-white/25">
                <Package className="h-8 w-8" />
              </div>
            )}

            <div className="absolute start-3 top-3 flex flex-wrap gap-1.5">
              {(product.discount ?? 0) > 0 ? (
                <span
                  className="rounded-lg border border-white/10 bg-black/40 px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm"
                  style={{
                    borderColor: `${colors.accent}40`,
                    color: colors.accent,
                    fontFamily: fonts.body,
                  }}
                >
                  -{product.discount}%
                </span>
              ) : null}
              {product.isFromSupplier ? (
                <span className="rounded-lg border border-white/10 bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                  مورد
                </span>
              ) : null}
              {isSoldOut ? (
                <span className="rounded-lg border border-white/10 bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                  نفد المخزون
                </span>
              ) : null}
              {isLowStock ? (
                <span className="rounded-lg border border-amber-300/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300 backdrop-blur-sm">
                  آخر {product.quantity} قطع
                </span>
              ) : null}
            </div>
          </div>

          <div className="border-t border-white/[0.06] p-4">
            <p
              className="mb-1.5 text-[10px] tracking-widest text-white/35 uppercase"
              style={{ fontFamily: fonts.body }}
            >
              {product.category}
            </p>

            <h3
              className="line-clamp-2 text-sm leading-snug font-medium text-white/85"
              style={{ fontFamily: fonts.heading }}
            >
              {product.name}
            </h3>

            <div className="mt-2 flex items-center gap-2">
              <span
                className="text-base font-semibold text-white/90"
                style={{ fontFamily: fonts.heading }}
              >
                {formatPrice(discountedPrice)}
              </span>
              {(product.discount ?? 0) > 0 ? (
                <span className="text-xs text-white/35 line-through">
                  {formatPrice(product.price)}
                </span>
              ) : null}
            </div>

            {visibleColors.length > 0 ? (
              <div className="mt-2.5 flex items-center gap-1.5">
                {visibleColors.map(color => (
                  <span
                    key={color.id}
                    className="h-3.5 w-3.5 rounded-full border border-white/20"
                    style={color.hex ? { backgroundColor: color.hex } : undefined}
                    title={color.name}
                  />
                ))}
                {remainingColors > 0 ? (
                  <span className="text-xs text-white/35">+{remainingColors}</span>
                ) : null}
              </div>
            ) : null}
          </div>
        </button>
      </article>

      <button
        type="button"
        onClick={handleToggleLike}
        className="absolute end-3 top-3 z-[1] flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-white/70 backdrop-blur-sm transition-all duration-200 ease-in-out hover:border-white/[0.18] hover:text-white"
        style={isLiked ? { color: '#ff4d6d', borderColor: '#ff4d6d40' } : undefined}
        aria-label={isLiked ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
      >
        <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
      </button>

      {!isSoldOut ? (
        <button
          type="button"
          onClick={handleAddToCart}
          className="absolute inset-x-0 bottom-0 translate-y-full border-t border-white/10 bg-black/60 py-3 text-center text-xs text-white/80 backdrop-blur-md transition-transform duration-200 ease-in-out group-hover:translate-y-0"
          style={{ fontFamily: fonts.body }}
        >
          أضف إلى السلة
        </button>
      ) : null}
    </div>
  );
}
