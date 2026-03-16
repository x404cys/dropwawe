// THEME: dark-luxury — Footer

import BaseFooter from '../../_components/Footer';
import type { FooterProps } from '../../_lib/types';

export default function DarkLuxuryFooter({
  store,
  template,
  colors,
  fonts,
  sections,
}: FooterProps) {
  return (
    <BaseFooter
      store={store}
      template={template}
      colors={colors}
      sections={sections}
      headingStyle={{ fontFamily: fonts.heading }}
    />
  );
}
