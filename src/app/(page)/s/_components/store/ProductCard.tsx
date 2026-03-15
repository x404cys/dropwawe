// Purpose: Product card - "use client", reusable card used in grid and category rows.
// Pixel-perfect match to renderProductCard in Storefront.tsx.
// Connects to CartContext for add-to-cart and likes.

'use client';

import { Heart, Package, ShoppingCart, Star } from 'lucide-react';
import { ActiveColors, StorefrontProduct } from '../../_lib/types';
import { getDiscountedPrice } from '../../_utils/price';
import { useCart } from '../../_context/CartContext';
import { useLanguage } from '../../_context/LanguageContext';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import Image from 'next/image';
interface ProductCardProps {
  product: StorefrontProduct;
  colors: ActiveColors;
}

export default function ProductCard({ product, colors }: ProductCardProps) {
  const { t, locale } = useLanguage();
  const { addToCart, setSelectedProduct, liked, toggleLike } = useCart();
  const finalPrice = getDiscountedPrice(product);
  const isLiked = liked.includes(product.id);

  return (
    <div className="bg-card border-border group overflow-hidden rounded-2xl border transition-all hover:shadow-md">
      <div
        onClick={() => setSelectedProduct(product)}
        className="w-full cursor-pointer text-start"
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setSelectedProduct(product)}
      >
        <div className="from-muted/50 to-muted/20 relative flex h-32 flex-col items-center justify-center gap-1.5 bg-gradient-to-br sm:h-36">
          {product.images ? (
            <Image
              src={`${product.image}`}
              alt={product.name}
              fill
              className="h-full w-full object-cover"
            />
          ) : (
            <Package className="text-muted-foreground/15 h-8 w-8 transition-transform group-hover:scale-110" />
          )}

          {(product.discount ?? 0) > 0 && (
            <span className="bg-destructive text-destructive-foreground absolute top-2 right-2 rounded-full px-2 py-0.5 text-[8px] font-bold">
              {t.store.discount} {product.discount}%
            </span>
          )}

          <button
            onClick={e => {
              e.stopPropagation();
              toggleLike(product.id);
            }}
            className="bg-card/90 absolute top-2 left-2 flex h-7 w-7 items-center justify-center rounded-full shadow-sm"
          >
            <Heart
              className={`h-3.5 w-3.5 ${
                isLiked ? 'text-destructive fill-current' : 'text-muted-foreground'
              }`}
            />
          </button>
        </div>

        <div className="p-3">
          <p className="text-foreground mb-1 line-clamp-2 text-[11px] leading-tight font-bold">
            {product.name}
          </p>
          <span className="text-foreground mb-1 line-clamp-2 text-[11px] leading-tight font-bold">
            {product.description}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold" style={{ color: colors.primary }}>
              {formatIQD(finalPrice)}
            </span>
            <span className="text-muted-foreground text-[8px]">{t.store.currency}</span>
            {(product.discount ?? 0) > 0 && (
              <span className="text-muted-foreground text-[9px] line-through">
                {product.price.toLocaleString(locale)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-3 pb-3">
        {/* TODO: Remove this button from the card in the next iteration
            per product owner request. Keep the card click → modal flow only. */}
        <button
          onClick={() => addToCart(product)}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[11px] font-bold text-white transition-transform active:scale-95"
          style={{ backgroundColor: colors.primary }}
        >
          <ShoppingCart className="h-3 w-3" /> {t.store.addToCart}
        </button>
      </div>
    </div>
  );
}
