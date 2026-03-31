'use client';

import { Package, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ProductCardProps } from '../../../_lib/types';
import { useCart } from '../../../_context/CartContext';
import { productHasVariants } from '../../../_utils/cart';
import { getDiscountedPrice } from '../../../_utils/price';
import { buildStorefrontProductPath } from '../../../_utils/routes';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { getReadableTextColor } from '../themeSystem';

export default function DefaultThemeProductCard({ product, colors, fonts }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const finalPrice = getDiscountedPrice(product);
  const image = product.images?.[0]?.url || product.image || null;

  const compareAtPrice =
    (product.discount ?? 0) > 0 ? (product.priceBeforeDiscount ?? product.price) : null;

  const isOutOfStock = !product.unlimited && product.quantity === 0;
  const lowStock = !product.unlimited && product.quantity > 0 && product.quantity < 5;
  const hasVariants = productHasVariants(product);
  const accentTextColor = getReadableTextColor(colors.accent);
  const openProduct = () => {
    if (isOutOfStock) return;
    router.push(buildStorefrontProductPath(product.id));
  };

  return (
    <article className="group flex h-full flex-col">
      <div
        className="relative aspect-square w-full overflow-hidden rounded-lg"
        style={{ backgroundColor: 'var(--store-surface)' }}
      >
        <button onClick={openProduct} disabled={isOutOfStock} className="h-full w-full">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div
              className="flex h-full items-center justify-center"
              style={{ color: 'var(--store-text-faint)' }}
            >
              <Package className="h-8 w-8 opacity-40" />
            </div>
          )}
        </button>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

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
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <button type="button" onClick={openProduct} className="text-start">
          <h3
            className="text-base font-semibold"
            style={{ color: 'var(--store-text)', fontFamily: fonts.heading }}
          >
            {product.name}
          </h3>
          <span className="text-sm font-semibold" style={{ color: 'var(--store-text)' }}>
            {formatIQD(finalPrice)} د.ع
          </span>

          {compareAtPrice && compareAtPrice > finalPrice && (
            <span className="text-xs line-through" style={{ color: 'var(--store-text-faint)' }}>
              {formatIQD(compareAtPrice)} د.ع
            </span>
          )}
          {product.description && (
            <p className="mt-1 line-clamp-1 text-sm" style={{ color: 'var(--store-text-muted)' }}>
              {product.description}
            </p>
          )}
        </button>

        <div className="mt-auto pt-3">
          <button
            type="button"
            onClick={() => (hasVariants ? openProduct() : addToCart(product))}
            disabled={isOutOfStock}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-sm px-4 py-2 text-sm font-medium transition disabled:opacity-50"
            style={{
              backgroundColor: 'var(--store-accent)',
              color: accentTextColor,
            }}
          >
            <span>اضف للسلة</span>
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
