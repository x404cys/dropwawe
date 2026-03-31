export function buildStorefrontHomePath() {
  return '/s';
}

export function buildStorefrontProductPath(productId: string) {
  return `/s/product/${encodeURIComponent(productId)}`;
}

export function buildStorefrontCheckoutPath(successOrderId?: string | null) {
  if (!successOrderId) return '/s/checkout';

  const params = new URLSearchParams({ success: successOrderId });
  return `/s/checkout?${params.toString()}`;
}
