'use client';

import { useMemo, useState, type CSSProperties } from 'react';

import type { ActiveColors, StorefrontProduct } from '../../../_lib/types';
import { useCart } from '../../../_context/CartContext';
import { useLanguage } from '../../../_context/LanguageContext';
import { getDiscountedPrice } from '../../../_utils/price';
import ProductModalActions from './ProductModalActions';
import ProductModalColors from './ProductModalColors';
import ProductModalGallery from './ProductModalGallery';
import ProductModalHeader from './ProductModalHeader';
import ProductModalInfo from './ProductModalInfo';
import ProductModalQuantity from './ProductModalQuantity';
import ProductModalSizes from './ProductModalSizes';

interface ProductModalProps {
  product: StorefrontProduct;
  colors: ActiveColors;
  headingStyle: CSSProperties;
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
    <div dir="rtl" className="fixed inset-0 z-50 h-screen overflow-y-auto">
      <ProductModalHeader title={product.name} backgroundColor={colors.bg} onClose={handleClose} />

      <div style={{ background: colors.bg }} className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
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
              description={product.description}
              headingStyle={headingStyle}
              primaryColor={colors.primary}
              currencyLabel={t.store.currency}
              youSaveLabel={t.product.youSave}
            />

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
