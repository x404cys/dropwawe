// THEME: dark-luxury — ProductCard

import BaseProductCard from '../../../_components/store/ProductCard';
import type { ProductCardProps } from '../../../_lib/types';

export default function DarkLuxuryProductCard({ product, colors }: ProductCardProps) {
  return <BaseProductCard product={product} colors={colors} />;
}
