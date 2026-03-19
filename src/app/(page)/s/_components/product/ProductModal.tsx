'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Check, Minus, Plus } from 'lucide-react';

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
  const { t } = useLanguage();
  const { addToCart, buyNow, setSelectedProduct } = useCart();

  const finalPrice = getDiscountedPrice(product);
  const discountValue = Math.max(0, (product.price ?? 0) - finalPrice);

  const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes?.[0]?.id ?? null);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors?.[0]?.id ?? null
  );
  const [quantity, setQuantity] = useState(1);

  const handleClose = () => setSelectedProduct(null);

  const selectedSizeLabel = useMemo(
    () => product.sizes?.find(size => size.id === selectedSize)?.size ?? null,
    [product.sizes, selectedSize]
  );

  const selectedColorData = useMemo(
    () => product.colors?.find(color => color.id === selectedColor) ?? null,
    [product.colors, selectedColor]
  );

  const buildConfiguredProduct = (): StorefrontProduct => ({
    ...product,
    selectedColor: selectedColorData?.name ?? undefined,
    selectedSize: selectedSizeLabel ?? undefined,
  });

  const handleAddToCart = () => {
    const productWithVariants = buildConfiguredProduct();

    for (let i = 0; i < quantity; i++) {
      addToCart(productWithVariants);
    }
    handleClose();
  };

  const handleBuyNow = () => {
    buyNow(buildConfiguredProduct());
  };

  return (
    <div dir="rtl" className="fixed inset-0 z-50 overflow-y-auto">
      {/* HEADER */}
      <div style={{ background: colors.bg }} className="sticky top-0 z-30 border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <button
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg border"
          >
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="truncate text-sm font-semibold">{product.name}</p>

          <div className="w-10" />
        </div>
      </div>

      {/* BODY */}
      <div style={{ background: colors.bg }} className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* IMAGE */}
          <div>
            <div className="overflow-hidden rounded-xl border">
              <div className="aspect-[4/5] w-full">
                <img
                  src={product.image as string}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* INFO */}
          <div className="space-y-8">
            {/* TITLE */}
            <div>
              <h1 className="text-3xl leading-tight font-bold" style={headingStyle}>
                {product.name}
              </h1>
            </div>

            {/* PRICE */}
            <div>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-extrabold" style={{ color: colors.primary }}>
                  {finalPrice}
                </span>

                <span className="text-muted-foreground text-sm">{t.store.currency}</span>
              </div>

              {(product.discount ?? 0) > 0 && (
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-muted-foreground text-sm line-through">
                    {product.price}
                  </span>

                  <span className="text-sm font-semibold text-green-600">
                    {t.product.youSave} {discountValue} {t.store.currency}
                  </span>
                </div>
              )}
            </div>

            {/* DESCRIPTION */}
            {product.description && (
              <p className="text-muted-foreground text-sm leading-7">{product.description}</p>
            )}

            {/* SIZES */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <p className="mb-3 text-sm font-semibold">{t.product.sizes}</p>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => {
                    const active = selectedSize === size.id;

                    return (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size.id)}
                        className={`rounded-lg border px-4 py-2 text-sm transition ${
                          active ? 'border-transparent text-white' : 'hover:bg-[var(--muted)]'
                        }`}
                        style={active ? { backgroundColor: colors.primary } : undefined}
                      >
                        {size.size}
                      </button>
                    );
                  })}
                </div>

                {selectedSizeLabel && (
                  <p className="text-muted-foreground mt-2 text-xs">المحدد: {selectedSizeLabel}</p>
                )}
              </div>
            )}

            {/* COLORS */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="mb-3 text-sm font-semibold">{t.product.colors}</p>

                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => {
                    const active = selectedColor === color.id;

                    return (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.id)}
                        className="relative flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-[var(--muted)]"
                      >
                        <span
                          className="h-5 w-5 rounded-full border border-black/10"
                          style={{ backgroundColor: color.hex ?? color.name }}
                        />
                        <span className="text-xs">{color.name}</span>

                        {active && (
                          <span
                            className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-white"
                            style={{ backgroundColor: colors.primary }}
                          >
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedColorData && (
                  <p className="text-muted-foreground mt-2 text-xs">
                    المحدد: {selectedColorData.name}
                  </p>
                )}
              </div>
            )}

            {/* QUANTITY */}
            <div>
              <p className="mb-3 text-sm font-semibold">{t.product.quantity}</p>

              <div className="container flex w-32 items-center rounded-lg border">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="flex h-10 w-10 items-center justify-center hover:bg-[var(--muted)]"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <div className="min-w-[60px] text-center font-semibold">{quantity}</div>

                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="flex h-10 w-10 items-center justify-center hover:bg-[var(--muted)]"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY ACTION BAR */}
      <div style={{ background: colors.bg }} className="sticky bottom-0 border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-muted-foreground text-xs">{t.product.total}</p>
            <p className="text-xl font-bold">
              {finalPrice * quantity} {t.store.currency}
            </p>
          </div>

          <div className="flex w-full gap-3 lg:w-auto">
            <button
              onClick={handleAddToCart}
              className="h-12 flex-1 rounded-lg border px-6 text-sm font-semibold transition hover:bg-[var(--muted)] lg:flex-none"
            >
              {t.product.addToCart}
            </button>

            <button
              onClick={handleBuyNow}
              className="h-12 flex-[1.2] rounded-lg px-8 text-sm font-semibold text-white transition active:scale-[0.98] lg:flex-none"
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
