'use client';

import { ArrowRight, ShieldCheck, ShoppingBag, Store, Truck } from 'lucide-react';
import { useMemo, useState, type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';

import type {
  ActiveColors,
  StorefrontFonts,
  StorefrontProduct,
  StorefrontStore,
} from '../../_lib/types';
import { useCart } from '../../_context/CartContext';
import { useLanguage } from '../../_context/LanguageContext';
import { getDiscountedPrice } from '../../_utils/price';
import { buildStorefrontCheckoutPath, buildStorefrontHomePath } from '../../_utils/routes';
import ProductModalActions from './ProductModal/ProductModalActions';
import ProductModalColors from './ProductModal/ProductModalColors';
import ProductModalGallery from './ProductModal/ProductModalGallery';
import ProductModalInfo from './ProductModal/ProductModalInfo';
import ProductModalQuantity from './ProductModal/ProductModalQuantity';
import ProductModalSizes from './ProductModal/ProductModalSizes';

interface ProductDetailsPageProps {
  product: StorefrontProduct;
  store: StorefrontStore;
  colors: ActiveColors;
  fonts: StorefrontFonts;
  headingStyle: CSSProperties;
}

export default function ProductDetailsPage({
  product,
  store,
  colors,
  fonts,
  headingStyle,
}: ProductDetailsPageProps) {
  const router = useRouter();
  const { addToCart, buyNow, cartCount } = useCart();
  const { t } = useLanguage();

  const finalPrice = getDiscountedPrice(product);
  const discountValue = Math.max(0, (product.price ?? 0) - finalPrice);

  const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes?.[0]?.id ?? null);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors?.[0]?.id ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
    const configuredProduct = buildConfiguredProduct();

    for (let index = 0; index < quantity; index += 1) {
      addToCart(configuredProduct);
    }
  };

  const handleBuyNow = () => {
    buyNow(buildConfiguredProduct());
    router.push(buildStorefrontCheckoutPath());
  };

  const detailCards = [
    {
      label: t.product.delivery,
      value: product.shippingType?.trim() || t.product.deliveryFast,
      Icon: Truck,
    },
    {
      label: t.product.guarantee,
      value: product.hasReturnPolicy?.trim() || t.product.qualityGuarantee,
      Icon: ShieldCheck,
    },
    {
      label: t.product.support,
      value: store.name ?? t.nav.store,
      Icon: Store,
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen">
      <div
        className="sticky top-0 z-40 border-b backdrop-blur-xl"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--store-bg) 92%, transparent)',
          borderColor: 'var(--store-border)',
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 md:px-6">
          <button
            type="button"
            onClick={() => router.push(buildStorefrontHomePath())}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border transition-opacity hover:opacity-80"
            style={{ borderColor: 'var(--store-border)', color: 'var(--store-text)' }}
            aria-label={t.nav.home}
          >
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="min-w-0 text-center">
            <p className="truncate text-xs" style={{ color: 'var(--store-text-muted)' }}>
              {store.name ?? t.nav.store}
            </p>
            <p
              className="truncate text-sm font-semibold"
              style={{ color: 'var(--store-text)', fontFamily: fonts.heading }}
            >
              {t.product.details}
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push(buildStorefrontCheckoutPath())}
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl border transition-opacity hover:opacity-80"
            style={{ borderColor: 'var(--store-border)', color: 'var(--store-text)' }}
            aria-label={t.checkout.title}
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 ? (
              <span
                className="absolute -end-1.5 -top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white"
                style={{ backgroundColor: colors.primary }}
              >
                {cartCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <div
          className="mb-6 flex flex-wrap items-center gap-2 text-xs"
          style={{ color: 'var(--store-text-muted)' }}
        >
          <button
            type="button"
            onClick={() => router.push(buildStorefrontHomePath())}
            className="transition-opacity hover:opacity-70"
          >
            {store.name ?? t.nav.store}
          </button>
          <span>/</span>
          <span>{product.category || t.store.general}</span>
          <span>/</span>
          <span style={{ color: 'var(--store-text)' }}>{product.name}</span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div style={{ '--product-modal-primary': colors.primary } as CSSProperties}>
            <ProductModalGallery
              images={product.images}
              fallbackImage={product.image}
              selectedIndex={selectedImageIndex}
              onSelect={setSelectedImageIndex}
              productName={product.name}
            />
          </div>

          <div className="space-y-8">
            <ProductModalInfo
              name={product.name}
              finalPrice={finalPrice}
              price={product.price}
              discount={product.discount}
              discountValue={discountValue}
              description={product.description || t.product.noDescription}
              headingStyle={headingStyle}
              primaryColor={colors.primary}
              currencyLabel={t.store.currency}
              youSaveLabel={t.product.youSave}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              {detailCards.map(({ label, value, Icon }) => (
                <div
                  key={label}
                  className="rounded-3xl border p-4"
                  style={{
                    borderColor: 'var(--store-border-soft)',
                    backgroundColor: 'var(--store-surface)',
                  }}
                >
                  <Icon className="mb-3 h-4 w-4" style={{ color: colors.primary }} />
                  <p className="text-xs" style={{ color: 'var(--store-text-muted)' }}>
                    {label}
                  </p>
                  <p
                    className="mt-1 text-sm font-semibold"
                    style={{ color: 'var(--store-text)', fontFamily: fonts.heading }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <ProductModalSizes
              sizes={product.sizes}
              selectedSize={selectedSize}
              selectedSizeLabel={selectedSizeLabel}
              onSelect={setSelectedSize}
              primaryColor={colors.primary}
              label={t.product.sizes}
            />

            <ProductModalColors
              colors={product.colors}
              selectedColor={selectedColor}
              selectedColorName={selectedColorData?.name ?? null}
              onSelect={setSelectedColor}
              primaryColor={colors.primary}
              label={t.product.colors}
            />

            <ProductModalQuantity
              quantity={quantity}
              onDecrease={() => setQuantity(prev => Math.max(1, prev - 1))}
              onIncrease={() => setQuantity(prev => prev + 1)}
              label={t.product.quantity}
            />
          </div>
        </div>
      </div>

      <ProductModalActions
        backgroundColor={colors.bg}
        primaryColor={colors.primary}
        total={finalPrice * quantity}
        currencyLabel={t.store.currency}
        totalLabel={t.product.total}
        addToCartLabel={t.product.addToCart}
        buyNowLabel={t.product.buyNow}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
    </div>
  );
}
