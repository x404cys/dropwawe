// Purpose: Horizontal scrolling category row - "use client".
// Shows a header with icon + category name + count + "View all" button,
// then a horizontal scroll of compact product cards.

'use client';

import { ChevronLeft, Heart, Package, ShoppingCart, Star } from 'lucide-react';
import { ActiveColors, StorefrontCategoryIcon, StorefrontProduct } from '../../_lib/types';
import { getCategoryIcon } from '../../_utils/icons';
import { getDiscountedPrice } from '../../_utils/price';
import { useCart } from '../../_context/CartContext';
import { useLanguage } from '../../_context/LanguageContext';

interface CategoryRowProps {
  category: string;
  products: StorefrontProduct[];
  colors: ActiveColors;
  headingStyle: React.CSSProperties;
  categoryIcons: StorefrontCategoryIcon[];
  onViewAll: (cat: string) => void;
}

export default function CategoryRow({
  category,
  products,
  colors,
  headingStyle,
  categoryIcons,
  onViewAll,
}: CategoryRowProps) {
  const { t, locale } = useLanguage();
  const { addToCart, setSelectedProduct, liked, toggleLike } = useCart();

  if (products.length === 0) return null;

  const iconItem = categoryIcons.find((ci) => ci.category === category);
  const CI = getCategoryIcon(iconItem?.icon ?? 'Package');

  return (
    <div>
      {/* Row header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${colors.primary}15` }}
          >
            <CI className="h-4 w-4" style={{ color: colors.primary }} />
          </div>
          <h3 className="text-sm font-bold text-foreground" style={headingStyle}>
            {category}
          </h3>
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {products.length.toLocaleString(locale)}
          </span>
        </div>
        <button
          onClick={() => onViewAll(category)}
          className="text-[11px] font-semibold flex items-center gap-1"
          style={{ color: colors.primary }}
        >
          {t.store.viewAll} <ChevronLeft className="h-3 w-3" />
        </button>
      </div>

      {/* Horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {products.map((product) => {
          const finalPrice = getDiscountedPrice(product);
          const isLiked = liked.includes(product.id);
          return (
            <div
              key={product.id}
              className="flex-shrink-0 w-40 sm:w-48 rounded-2xl overflow-hidden bg-card border border-border hover:shadow-md transition-all group"
            >
              <div
                onClick={() => setSelectedProduct(product)}
                className="w-full text-start cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedProduct(product)}
              >
                <div className="h-32 relative flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-muted/50 to-muted/20">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="h-8 w-8 text-muted-foreground/15" />
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
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold" style={{ color: colors.primary }}>
                      {finalPrice.toLocaleString(locale)}
                    </span>
                    <span className="text-[8px] text-muted-foreground">{t.store.currency}</span>
                  </div>
                </div>
              </div>
              <div className="px-3 pb-3">
                <button
                  onClick={() => addToCart(product)}
                  className="w-full py-2 rounded-xl text-[10px] font-bold text-white flex items-center justify-center gap-1 active:scale-95 transition-transform"
                  style={{ backgroundColor: colors.primary }}
                >
                  <ShoppingCart className="h-3 w-3" /> {t.store.addToCart}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
