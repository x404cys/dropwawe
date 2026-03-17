'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  Check,
  Plus,
  Minus,
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

  const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes?.[0]?.id ?? null);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors?.[0]?.id ?? null
  );
  const [quantity, setQuantity] = useState(1);

  const discountValue = Math.max(0, (product.price ?? 0) - finalPrice);

  const deliveryText = deliveryDays
    ? t.product.deliveryIn.replace('{days}', new Intl.NumberFormat(locale).format(deliveryDays))
    : t.product.deliveryFast;

  const handleClose = () => setSelectedProduct(null);

  const handleOpenCart = () => {
    setSelectedProduct(null);
    setCheckoutStep('cart');
    setShowCart(true);
  };

  const selectedSizeLabel = useMemo(
    () => product.sizes?.find(s => s.id === selectedSize)?.size ?? null,
    [product.sizes, selectedSize]
  );

  const selectedColorData = useMemo(
    () => product.colors?.find(c => c.id === selectedColor) ?? null,
    [product.colors, selectedColor]
  );

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    handleClose();
  };

  const handleBuyNow = () => {
    buyNow(product);
  };

  const infoCards = [
    {
      icon: Truck,
      title: t.product.delivery ?? 'التوصيل',
      value: deliveryText,
    },
    {
      icon: Shield,
      title: t.product.guarantee ?? 'الضمان',
      value: t.product.qualityGuarantee,
    },
    {
      icon: Award,
      title: t.product.authenticity ?? 'الأصالة',
      value: t.product.originalProduct,
    },
    {
      icon: MessageCircle,
      title: t.product.support ?? 'الدعم',
      value: t.product.techSupport,
    },
  ];

  return (
    <div dir="rtl" className="bg-background scrollbar-none fixed inset-0 z-50 overflow-y-auto">
      <div className="border-border bg-background/90 sticky top-0 z-30 border-b backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <button
            onClick={handleClose}
            className="border-border bg-card hover:bg-muted flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
            aria-label="Close product details"
          >
            <ArrowRight className="text-foreground h-4 w-4" />
          </button>

          <div className="min-w-0 text-center">
            <p className="text-foreground truncate text-sm font-semibold">{product.name}</p>
            <p className="text-muted-foreground text-[11px]">{t.product.details}</p>
          </div>

          <button onClick={handleOpenCart} className="relative">
            <div className="border-border bg-card flex h-10 w-10 items-center justify-center rounded-full border">
              <ShoppingCart className="text-foreground h-4 w-4" />
            </div>

            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                style={{ backgroundColor: colors.primary }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-5 md:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:py-8">
        {/* Left side / media */}
        <div className="space-y-4">
          <div
            className="border-border relative overflow-hidden rounded-3xl border"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}18, ${colors.primary}08 45%, transparent 100%)`,
            }}
          >
            <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4">
              <div className="flex flex-wrap gap-2">
                <span className="border-border bg-background/80 text-foreground rounded-full border px-3 py-1 text-[11px] font-semibold backdrop-blur">
                  {product.category ?? t.store.general}
                </span>

                {(product.discount ?? 0) > 0 && (
                  <span className="bg-destructive text-destructive-foreground rounded-full px-3 py-1 text-[11px] font-bold shadow-sm">
                    {t.store.discount} {product.discount}%
                  </span>
                )}
              </div>

              <div className="border-border bg-background/80 text-muted-foreground rounded-full border px-3 py-1 text-[11px] font-medium backdrop-blur">
                SKU #{product.id?.slice?.(0, 8) ?? 'PRD'}
              </div>
            </div>

            <div className="relative aspect-[4/3] w-full sm:aspect-[16/11]">
              <img
                src={product.image as string}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="border-border bg-card rounded-3xl border p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" style={{ color: colors.primary }} />
              <h3 className="text-foreground text-sm font-bold">{t.product.description}</h3>
            </div>

            <p className="text-muted-foreground text-sm leading-7">
              {product.description || t.product.noDescription || 'لا توجد تفاصيل إضافية حالياً.'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border-border bg-card rounded-3xl border p-5 shadow-sm md:p-6">
            <div className="mb-5">
              <h1
                className="text-foreground text-2xl leading-tight font-bold md:text-3xl"
                style={headingStyle}
              >
                {product.name}
              </h1>
            </div>

            <div className="border-border bg-muted/30 mb-5 rounded-2xl border p-4">
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-3xl font-extrabold tracking-tight"
                    style={{ color: colors.primary }}
                  >
                    {finalPrice}
                  </span>
                  <span className="text-muted-foreground text-sm font-medium">
                    {t.store.currency}
                  </span>
                </div>

                {(product.discount ?? 0) > 0 && (
                  <>
                    <span className="text-muted-foreground text-sm line-through">
                      {product.price}
                    </span>
                    <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-[11px] font-bold text-green-600 dark:text-green-400">
                      {t.product.youSave ?? 'توفر'} {discountValue} {t.store.currency}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Size selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-foreground text-sm font-semibold">{t.product.sizes}</p>
                  {selectedSizeLabel && (
                    <p className="text-muted-foreground text-xs">
                      {t.product.selected ?? 'المحدد'}: {selectedSizeLabel}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => {
                    const isActive = selectedSize === size.id;

                    return (
                      <button
                        key={size.id}
                        type="button"
                        onClick={() => setSelectedSize(size.id)}
                        className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
                          isActive
                            ? 'scale-[1.02] border-transparent text-white shadow-sm'
                            : 'border-border bg-background text-foreground hover:bg-muted'
                        }`}
                        style={
                          isActive
                            ? {
                                backgroundColor: colors.primary,
                              }
                            : undefined
                        }
                      >
                        {size.size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-foreground text-sm font-semibold">{t.product.colors}</p>
                  {selectedColorData && (
                    <p className="text-muted-foreground text-xs">
                      {t.product.selected ?? 'المحدد'}: {selectedColorData.name}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => {
                    const isActive = selectedColor === color.id;

                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => setSelectedColor(color.id)}
                        className={`relative flex items-center gap-2 rounded-full border px-2 py-2 transition-all ${
                          isActive
                            ? 'border-foreground/20 bg-muted shadow-sm'
                            : 'border-border bg-background hover:bg-muted'
                        }`}
                      >
                        <span
                          className="h-6 w-6 rounded-full border border-black/10"
                          style={{ backgroundColor: color.hex ?? color.name }}
                        />
                        <span className="text-foreground pr-2 text-xs font-medium">
                          {color.name}
                        </span>

                        {isActive && (
                          <span
                            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-white shadow"
                            style={{ backgroundColor: colors.primary }}
                          >
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-foreground mb-2 text-sm font-semibold">
                {t.product.quantity ?? 'الكمية'}
              </p>

              <div className="border-border bg-background inline-flex items-center rounded-2xl border p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="hover:bg-muted flex h-10 w-10 items-center justify-center rounded-xl"
                  aria-label="Decrease quantity"
                >
                  <Minus className="text-foreground h-4 w-4" />
                </button>

                <div className="text-foreground min-w-[56px] text-center text-sm font-bold">
                  {quantity}
                </div>

                <button
                  type="button"
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="hover:bg-muted flex h-10 w-10 items-center justify-center rounded-xl"
                  aria-label="Increase quantity"
                >
                  <Plus className="text-foreground h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Summary bullets */}
          </div>
        </div>
      </div>

      {/* Sticky bottom action bar */}
      <div className="border-border bg-background/92 sticky bottom-0 z-30 border-t backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-muted-foreground text-xs">{t.product.total ?? 'الإجمالي'}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-foreground text-xl font-extrabold">
                {finalPrice * quantity}
              </span>
              <span className="text-muted-foreground text-sm">{t.store.currency}</span>
            </div>
          </div>

          <div className="flex w-full gap-2 lg:w-auto">
            <button
              onClick={handleAddToCart}
              className="border-border bg-card text-foreground hover:bg-muted flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl border px-8 text-sm font-bold transition"
            >
              <ShoppingCart className="h-4 w-4" />
              {t.product.addToCart}
            </button>

            <button
              onClick={handleBuyNow}
              className="flex h-12 flex-[1.2] cursor-pointer items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold text-white shadow-sm transition-transform active:scale-[0.99]"
              style={{ backgroundColor: colors.primary }}
            >
              {t.product.buyNow}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
