'use client';

import { Heart, Package, ShoppingCart } from 'lucide-react';
import type { ProductCardProps } from '../../../_lib/types';
import { useCart } from '../../../_context/CartContext';
import { productHasVariants } from '../../../_utils/cart';
import { getDiscountedPrice } from '../../../_utils/price';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';

export default function DefaultThemeProductCard({ product, colors, fonts }: ProductCardProps) {
  const { addToCart, liked, setSelectedProduct, toggleLike } = useCart();

  const finalPrice = getDiscountedPrice(product);
  const image = product.images?.[0]?.url || product.image || null;

  const compareAtPrice =
    (product.discount ?? 0) > 0 ? (product.priceBeforeDiscount ?? product.price) : null;

  const isOutOfStock = !product.unlimited && product.quantity === 0;
  const lowStock = !product.unlimited && product.quantity > 0 && product.quantity < 5;

  const isLiked = liked.includes(product.id);
  const hasVariants = productHasVariants(product);

  return (
    <article className="group flex h-full flex-col">
      {/* IMAGE */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[var(--muted)]">
        <button
          onClick={() => !isOutOfStock && setSelectedProduct(product)}
          disabled={isOutOfStock}
          className="h-full w-full"
        >
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[var(--muted-foreground)]">
              <Package className="h-8 w-8 opacity-40" />
            </div>
          )}
        </button>

        {/* bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

        {/* badges */}
        <div className="absolute start-3 top-3 flex flex-col gap-1">
          {(product.discount ?? 0) > 0 && (
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white">
              خصم {product.discount}%
            </span>
          )}

          {isOutOfStock && (
            <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-semibold text-white">
              نفد المخزون
            </span>
          )}

          {lowStock && !isOutOfStock && (
            <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white">
              آخر {product.quantity}
            </span>
          )}
        </div>

        {/* like */}
        {/* <button
          onClick={() => toggleLike(product.id)}
          className="absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur transition"
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current text-red-500' : 'text-gray-600'}`} />
        </button> */}
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col pt-4">
        <button className="text-start">
          <h3 className="text-base font-semibold" style={{ fontFamily: fonts.heading }}>
            {product.name}
          </h3>
          <span className="text-sm font-semibold">{formatIQD(finalPrice)} د.ع</span>

          {compareAtPrice && compareAtPrice > finalPrice && (
            <span className="text-xs line-through opacity-80">{formatIQD(compareAtPrice)} د.ع</span>
          )}
          {product.description && (
            <p className="mt-1 line-clamp-1 text-sm">{product.description}</p>
          )}
        </button>

        {/* fixed button */}
        <div className="mt-auto pt-3">
          <button
            type="button"
            onClick={() => (hasVariants ? setSelectedProduct(product) : addToCart(product))}
            disabled={isOutOfStock}
            style={{ background: colors.accent }}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-sm px-4 py-2 text-sm font-medium text-[var(--foreground)] transition disabled:opacity-50"
          >
            <span>اضف للسلة </span>
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
