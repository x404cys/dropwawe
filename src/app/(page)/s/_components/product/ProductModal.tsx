// Purpose: Product detail modal - "use client", full-screen overlay.
// Shows image, details, size/color pickers, and sticky add/buy footer.
// Reads cart state from CartContext. Matches Storefront.tsx modal design exactly.

'use client';

import {
  ArrowRight,
  Award,
  MessageCircle,
  Package,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react';
import { ActiveColors, StorefrontProduct } from '../../_lib/types';
import { getDiscountedPrice } from '../../_utils/price';
import { useCart } from '../../_context/CartContext';
import { useLanguage } from '../../_context/LanguageContext';

interface ProductModalProps {
  product: StorefrontProduct;
  colors: ActiveColors;
  headingStyle: React.CSSProperties;
}

export default function ProductModal({ product, colors, headingStyle }: ProductModalProps) {
  const { t, locale } = useLanguage();
  const { addToCart, buyNow, setSelectedProduct, cartCount, setShowCart, setCheckoutStep } =
    useCart();
  const finalPrice = getDiscountedPrice(product);
  const deliveryDays = (product as unknown as { deliveryDays?: number | null }).deliveryDays;

  const handleClose = () => setSelectedProduct(null);

  const handleOpenCart = () => {
    setSelectedProduct(null);
    setCheckoutStep('cart');
    setShowCart(true);
  };

  const ratingSummary = t.product.ratingSummary
    .replace('{rating}', '4.0')
    .replace('{count}', new Intl.NumberFormat(locale).format(128));

  const deliveryText = deliveryDays
    ? t.product.deliveryIn.replace('{days}', new Intl.NumberFormat(locale).format(deliveryDays))
    : t.product.deliveryFast;

  return (
    <div className="bg-background fixed inset-0 z-50 overflow-y-auto">
      {/* Sticky top bar */}
      <div className="bg-background/95 border-border sticky top-0 z-10 flex items-center justify-between border-b px-4 py-3 backdrop-blur-sm">
        <button
          onClick={handleClose}
          className="bg-muted flex h-8 w-8 items-center justify-center rounded-full"
        >
          <ArrowRight className="text-foreground h-4 w-4" />
        </button>
        <span className="text-foreground text-xs font-bold">{t.product.details}</span>
        <button onClick={handleOpenCart} className="relative">
          <ShoppingCart className="text-foreground h-5 w-5" />
          {cartCount > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold text-white"
              style={{ backgroundColor: colors.primary }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Image */}
      <div
        className="relative flex h-52 flex-col items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${colors.primary}15, ${colors.primary}08)` }}
      >
        <img
          src={product.image as string}
          alt={product.name}
          className="h-full w-full object-cover"
        />

        {(product.discount ?? 0) > 0 && (
          <span className="bg-destructive text-destructive-foreground absolute top-4 right-4 rounded-full px-3 py-1 text-[10px] font-bold">
            {t.store.discount} {product.discount}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl space-y-5 p-5">
        <div>
          <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-[10px]">
            {product.category ?? t.store.general}
          </span>
          <h2 className="text-foreground mt-2 mb-1 text-lg font-bold" style={headingStyle}>
            {product.name}
          </h2>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(s => (
                <Star
                  key={s}
                  className="h-3 w-3"
                  style={{ color: colors.primary, fill: s <= 4 ? 'currentColor' : 'none' }}
                />
              ))}
            </div>
            <span className="text-muted-foreground text-[11px]">{ratingSummary}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold" style={{ color: colors.primary }}>
              {finalPrice.toLocaleString(locale)}
            </span>
            <span className="text-muted-foreground text-sm">{t.store.currency}</span>
            {(product.discount ?? 0) > 0 && (
              <span className="text-muted-foreground text-sm line-through">
                {product.price.toLocaleString(locale)}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-foreground mb-1 text-xs font-bold">{t.product.description}</p>
          <p className="text-muted-foreground text-xs leading-relaxed">{product.description}</p>
        </div>

        {/* Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <p className="text-foreground mb-2 text-xs font-bold">{t.product.sizes}</p>
            <div className="flex gap-2">
              {product.sizes.map(s => (
                <span
                  key={s.id}
                  className="border-border text-foreground rounded-lg border px-3 py-1.5 text-[11px] font-medium"
                >
                  {s.size}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div>
            <p className="text-foreground mb-2 text-xs font-bold">{t.product.colors}</p>
            <div className="flex gap-2">
              {product.colors.map(c => (
                <div
                  key={c.id}
                  className="border-border h-7 w-7 rounded-full border-2"
                  style={{ backgroundColor: c.hex ?? c.name }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        <div>
          <p className="text-foreground mb-2 text-xs font-bold">{t.product.features}</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Truck, text: deliveryText },
              { icon: Shield, text: t.product.qualityGuarantee },
              { icon: Award, text: t.product.originalProduct },
              { icon: MessageCircle, text: t.product.techSupport },
            ].map(item => (
              <div key={item.text} className="bg-muted/50 flex items-center gap-2 rounded-xl p-2.5">
                <item.icon className="h-3.5 w-3.5" style={{ color: colors.primary }} />
                <span className="text-foreground text-[11px]">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="bg-card border-border sticky bottom-0 mx-auto flex max-w-2xl gap-2 border-t p-4">
        <button
          onClick={() => {
            addToCart(product);
            handleClose();
          }}
          className="border-border bg-card text-foreground flex h-12 items-center justify-center gap-2 rounded-xl border px-5 text-xs font-bold"
        >
          <ShoppingCart className="h-4 w-4" /> {t.product.addToCart}
        </button>
        <button
          onClick={() => buyNow(product)}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition-transform active:scale-[0.98]"
          style={{ backgroundColor: colors.primary }}
        >
          <Sparkles className="h-4 w-4" /> {t.product.buyNow}
        </button>
      </div>
    </div>
  );
}
