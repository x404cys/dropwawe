// THEME: dark-luxury — StoreSection

import BaseStoreSection from '../../../_components/sections/StoreSection';
import type { StoreSectionProps } from '../../../_lib/types';

export default function DarkLuxuryStoreSection({
  products,
  template,
  colors,
  fonts,
  enabledCategorySections,
  centerBanners,
}: StoreSectionProps) {
  return (
    <BaseStoreSection
      products={products}
      template={template}
      colors={colors}
      headingStyle={{ fontFamily: fonts.heading }}
      enabledCategorySections={enabledCategorySections}
      centerBanners={centerBanners}
    />
  );
}
