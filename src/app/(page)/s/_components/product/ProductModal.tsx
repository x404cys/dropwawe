// Purpose: Product detail modal — "use client", full-screen overlay.
// Shows image, details, size/color pickers, and sticky add/buy footer.
// Reads cart state from CartContext. Matches Storefront.tsx modal design exactly.

'use client';

import {
  ArrowRight, ShoppingCart, Package, Star, Truck, Shield, Award,
  MessageCircle, Sparkles,
} from 'lucide-react';
import { ActiveColors, StorefrontProduct } from '../../_lib/types';
import { getDiscountedPrice } from '../../_utils/price';
import { useCart } from '../../_context/CartContext';

interface ProductModalProps {
  product: StorefrontProduct;
  colors: ActiveColors;
  headingStyle: React.CSSProperties;
}

export default function ProductModal({ product, colors, headingStyle }: ProductModalProps) {
  const { addToCart, buyNow, setSelectedProduct, cartCount, setShowCart, setCheckoutStep } = useCart();
  const finalPrice = getDiscountedPrice(product);
  const deliveryDays = (product as unknown as { deliveryDays?: number | null }).deliveryDays;

  const handleClose = () => setSelectedProduct(null);

  const handleOpenCart = () => {
    setSelectedProduct(null);
    setCheckoutStep('cart');
    setShowCart(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between">
        <button
          onClick={handleClose}
          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
        >
          <ArrowRight className="h-4 w-4 text-foreground" />
        </button>
        <span className="text-xs font-bold text-foreground">تفاصيل المنتج</span>
        <button onClick={handleOpenCart} className="relative">
          <ShoppingCart className="h-5 w-5 text-foreground" />
          {cartCount > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center text-white"
              style={{ backgroundColor: colors.primary }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Image */}
      <div
        className="h-52 flex flex-col items-center justify-center relative"
        style={{ background: `linear-gradient(135deg, ${colors.primary}15, ${colors.primary}08)` }}
      >
        {product.images?.[0] ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Package className="h-14 w-14" style={{ color: `${colors.primary}30` }} />
        )}
        {(product.discount ?? 0) > 0 && (
          <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold bg-destructive text-destructive-foreground">
            خصم {product.discount}٪
          </span>
        )}
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-5 space-y-5">
        <div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
            {product.category ?? 'عام'}
          </span>
          <h2 className="text-lg font-bold text-foreground mt-2 mb-1" style={headingStyle}>
            {product.name}
          </h2>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="h-3 w-3"
                  style={{ color: colors.primary, fill: s <= 4 ? 'currentColor' : 'none' }}
                />
              ))}
            </div>
            <span className="text-[11px] text-muted-foreground">(4.0) • ١٢٨ تقييم</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold" style={{ color: colors.primary }}>
              {finalPrice.toLocaleString('ar-IQ')}
            </span>
            <span className="text-sm text-muted-foreground">د.ع</span>
            {(product.discount ?? 0) > 0 && (
              <span className="text-sm line-through text-muted-foreground">
                {product.price.toLocaleString('ar-IQ')}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-xs font-bold text-foreground mb-1">الوصف</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{product.description}</p>
        </div>

        {/* Sizes */}
        {product.sizes.length > 0 && (
          <div>
            <p className="text-xs font-bold text-foreground mb-2">المقاسات المتوفرة</p>
            <div className="flex gap-2">
              {product.sizes.map((s) => (
                <span
                  key={s.id}
                  className="px-3 py-1.5 rounded-lg border border-border text-[11px] font-medium text-foreground"
                >
                  {s.size}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Colors */}
        {product.colors.length > 0 && (
          <div>
            <p className="text-xs font-bold text-foreground mb-2">الألوان</p>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <div
                  key={c.id}
                  className="w-7 h-7 rounded-full border-2 border-border"
                  style={{ backgroundColor: c.hex ?? c.color }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        <div>
          <p className="text-xs font-bold text-foreground mb-2">مميزات</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                icon: Truck,
                text: deliveryDays ? `توصيل خلال ${deliveryDays} أيام` : 'توصيل سريع',
              },
              { icon: Shield, text: 'ضمان الجودة' },
              { icon: Award, text: 'منتج أصلي' },
              { icon: MessageCircle, text: 'دعم فني' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 bg-muted/50 rounded-xl p-2.5">
                <item.icon className="h-3.5 w-3.5" style={{ color: colors.primary }} />
                <span className="text-[11px] text-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 bg-card border-t border-border p-4 flex gap-2 max-w-2xl mx-auto">
        <button
          onClick={() => { addToCart(product); handleClose(); }}
          className="h-12 px-5 rounded-xl border border-border bg-card text-foreground font-bold text-xs flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" /> أضف للسلة
        </button>
        <button
          onClick={() => buyNow(product)}
          className="flex-1 h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform text-white"
          style={{ backgroundColor: colors.primary }}
        >
          <Sparkles className="h-4 w-4" /> اشتري الآن
        </button>
      </div>
    </div>
  );
}
