// THEME: dark-luxury — Navbar

import BaseNavbar from '../../_components/Navbar';
import type { NavbarProps } from '../../_lib/types';

export default function DarkLuxuryNavbar({
  store,
  template,
  colors,
  fonts,
  sections,
  hasAnnouncementBar,
}: NavbarProps) {
  return (
    <BaseNavbar
      store={store}
      template={template}
      colors={colors}
      headingStyle={{ fontFamily: fonts.heading }}
      sections={sections}
      hasAnnouncementBar={hasAnnouncementBar}
    />
  );
}
