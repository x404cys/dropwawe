// THEME: dark-luxury — HeroSection

import BaseHeroSection from '../../../_components/sections/HeroSection';
import type { HeroSectionProps } from '../../../_lib/types';

export default function DarkLuxuryHeroSection({
  store,
  template,
  colors,
  fonts,
}: HeroSectionProps) {
  return (
    <BaseHeroSection
      store={store}
      template={template}
      colors={colors}
      headingStyle={{ fontFamily: fonts.heading }}
    />
  );
}
