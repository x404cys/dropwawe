// Purpose: Price formatting and discount calculation utilities.

import { StorefrontProduct } from '../_lib/types';

export function formatPrice(amount: number): string {
  return `${amount.toLocaleString('ar-IQ')} د.ع`;
}

export function getDiscountedPrice(product: StorefrontProduct): number {
  if (product.discount && product.discount > 0) {
    return product.price - (product.price * product.discount) / 100;
  }
  return product.price;
}
