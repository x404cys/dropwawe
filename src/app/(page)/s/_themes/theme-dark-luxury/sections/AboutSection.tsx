// THEME: dark-luxury — AboutSection

import BaseAboutSection from '../../../_components/sections/AboutSection';
import type { AboutSectionProps } from '../../../_lib/types';

export default function DarkLuxuryAboutSection({
  template,
  store,
  colors,
  fonts,
}: AboutSectionProps) {
  return (
    <BaseAboutSection
      template={template}
      store={store}
      colors={colors}
      headingStyle={{ fontFamily: fonts.heading }}
    />
  );
}
