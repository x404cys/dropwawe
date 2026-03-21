// Purpose: Font style builders â€” converts template font fields into
// React.CSSProperties objects for spread into style props.

import { StorefrontFonts, StorefrontTemplate } from '../_lib/types';

const DEFAULT_FONT = 'IBM Plex Sans Arabic';
const HANDCARE_THEME_FONTS: StorefrontFonts = {
  heading: 'Cormorant Garamond, serif',
  body: 'DM Sans, sans-serif',
};

export interface FontStyles {
  headingStyle: React.CSSProperties;
  bodyStyle: React.CSSProperties;
}

export function resolveStorefrontFonts(template: StorefrontTemplate | null): StorefrontFonts {
  const isHandcarePreset = template?.selectedPreset === 7;
  const rawHeading = template?.headingFont?.trim();
  const rawBody = template?.bodyFont?.trim();

  const fallbackFonts = isHandcarePreset
    ? HANDCARE_THEME_FONTS
    : { heading: DEFAULT_FONT, body: DEFAULT_FONT };

  const heading =
    rawHeading && (!isHandcarePreset || rawHeading !== DEFAULT_FONT)
      ? rawHeading
      : fallbackFonts.heading;
  const body =
    rawBody && (!isHandcarePreset || rawBody !== DEFAULT_FONT) ? rawBody : fallbackFonts.body;

  return { heading, body };
}

export function buildFontStyles(template: StorefrontTemplate | null): FontStyles {
  const fonts = resolveStorefrontFonts(template);
  return {
    headingStyle: { fontFamily: fonts.heading },
    bodyStyle: { fontFamily: fonts.body },
  };
}
