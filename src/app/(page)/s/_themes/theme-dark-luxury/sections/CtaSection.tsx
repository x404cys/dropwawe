// THEME: dark-luxury — CtaSection

import BaseCtaSection from '../../../_components/sections/CtaSection';
import type { CtaSectionProps } from '../../../_lib/types';

export default function DarkLuxuryCtaSection({ template, store, colors, fonts }: CtaSectionProps) {
  return (
    <BaseCtaSection
      template={template}
      store={store}
      colors={colors}
      headingStyle={{ fontFamily: fonts.heading }}
    />
  );
}
