'use client';

import Image from 'next/image';
import { Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ActiveColors, StorefrontProduct } from '../../_lib/types';
import { getDiscountedPrice } from '../../_utils/price';
import { buildStorefrontProductPath } from '../../_utils/routes';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';

interface ProductCardProps {
  product: StorefrontProduct;
  colors: ActiveColors;
}

export default function ProductCard({ product, colors }: ProductCardProps) {
  const router = useRouter();

  const finalPrice = getDiscountedPrice(product);
  const primaryImage = product.images?.[0]?.url || product.image || null;
  const compareAtPrice =
    product.priceBeforeDiscount || ((product.discount ?? 0) > 0 ? product.price : null);

  return (
    <article
      // REDESIGN: product cards become editorial tiles with image-led hierarchy and no utility buttons.
      className="group bg-white/[0.03] transition-colors duration-200 hover:bg-white/[0.05]"
    >
      <button
        type="button"
        onClick={() => router.push(buildStorefrontProductPath(product.id))}
        className="block w-full text-right"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-white/[0.02]">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-8 w-8 opacity-20" style={{ color: colors.text }} />
            </div>
          )}
        </div>

        <div className="space-y-2 p-4">
          <p
            className="text-[10px] font-light tracking-[0.28em] uppercase opacity-50"
            style={{ color: colors.text }}
          >
            {product.category}
          </p>

          <h3 className="text-sm font-light tracking-[0.05em]" style={{ color: colors.text }}>
            {product.name}
          </h3>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span style={{ color: colors.text }}>{formatIQD(finalPrice)}</span>

            {compareAtPrice && compareAtPrice > finalPrice ? (
              <span className="text-xs line-through opacity-40" style={{ color: colors.text }}>
                {formatIQD(compareAtPrice)}
              </span>
            ) : null}
          </div>
        </div>
      </button>
    </article>
  );
}
