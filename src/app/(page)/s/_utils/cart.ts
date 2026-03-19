import type { StorefrontProduct } from '../_lib/types';

type CartProductIdentity = Pick<StorefrontProduct, 'id' | 'selectedColor' | 'selectedSize'>;

export function productHasVariants(
  product: Pick<StorefrontProduct, 'colors' | 'sizes'>
): boolean {
  return (product.colors?.length ?? 0) > 0 || (product.sizes?.length ?? 0) > 0;
}

export function productNeedsVariantSelection(
  product: Pick<StorefrontProduct, 'colors' | 'sizes' | 'selectedColor' | 'selectedSize'>
): boolean {
  const needsColor = (product.colors?.length ?? 0) > 0 && !product.selectedColor;
  const needsSize = (product.sizes?.length ?? 0) > 0 && !product.selectedSize;

  return needsColor || needsSize;
}

export function getCartItemKey(product: CartProductIdentity): string {
  return `${product.id}-${product.selectedColor ?? ''}-${product.selectedSize ?? ''}`;
}

export function isSameCartLine(
  product: CartProductIdentity,
  target: CartProductIdentity
): boolean {
  return (
    product.id === target.id &&
    product.selectedColor === target.selectedColor &&
    product.selectedSize === target.selectedSize
  );
}
