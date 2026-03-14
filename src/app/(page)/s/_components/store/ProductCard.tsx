// Purpose: Product card - "use client", reusable card used in grid and category rows.
// Pixel-perfect match to renderProductCard in Storefront.tsx.
// Connects to CartContext for add-to-cart and likes.

'use client';

import { Heart, Package, ShoppingCart, Star } from 'lucide-react';
import { ActiveColors, StorefrontProduct } from '../../_lib/types';
import { getDiscountedPrice } from '../../_utils/price';
import { useCart } from '../../_context/CartContext';
import { useLanguage } from '../../_context/LanguageContext';

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
    <div className="rounded-2xl overflow-hidden bg-card border border-border hover:shadow-md transition-all group">
      <div
        onClick={() => setSelectedProduct(product)}
        className="w-full text-start cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setSelectedProduct(product)}
      >
        <div className="h-32 sm:h-36 relative flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-muted/50 to-muted/20">
          {product.images?.[0] ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package className="h-8 w-8 text-muted-foreground/15 group-hover:scale-110 transition-transform" />
          )}

          {(product.discount ?? 0) > 0 && (
            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[8px] font-bold bg-destructive text-destructive-foreground">
              {t.store.discount} {product.discount}%
            </span>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(product.id);
            }}
            className="absolute top-2 left-2 w-7 h-7 rounded-full bg-card/90 flex items-center justify-center shadow-sm"
          >
            <Heart
              className={`h-3.5 w-3.5 ${
                isLiked ? 'text-destructive fill-current' : 'text-muted-foreground'
              }`}
            />
          </button>
        </div>

        <div className="p-3">
          <p className="text-[11px] font-bold text-foreground mb-1 leading-tight line-clamp-2">
            {product.name}
          </p>
          <div className="flex items-center gap-1 mb-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className="h-2.5 w-2.5"
                style={{ color: colors.primary, fill: s <= 4 ? 'currentColor' : 'none' }}
              />
            ))}
            <span className="text-[8px] text-muted-foreground">(4.0)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold" style={{ color: colors.primary }}>
              {finalPrice.toLocaleString(locale)}
            </span>
            <span className="text-[8px] text-muted-foreground">{t.store.currency}</span>
            {(product.discount ?? 0) > 0 && (
              <span className="text-[9px] line-through text-muted-foreground">
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
          className="w-full py-2.5 rounded-xl text-[11px] font-bold text-white flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
          style={{ backgroundColor: colors.primary }}
        >
          <ShoppingCart className="h-3 w-3" /> {t.store.addToCart}
        </button>
      </div>
    </div>
  );
}
