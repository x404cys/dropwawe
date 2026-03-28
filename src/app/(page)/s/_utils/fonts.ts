// Purpose: Font style builders â€” converts template font fields into
// React.CSSProperties objects for spread into style props.

import { StorefrontFonts, StorefrontTemplate } from '../_lib/types';

const DEFAULT_FONT = 'IBM Plex Sans Arabic';

export interface FontStyles {
  headingStyle: React.CSSProperties;
  bodyStyle: React.CSSProperties;
}

export function resolveStorefrontFonts(template: StorefrontTemplate | null): StorefrontFonts {
  const rawHeading = template?.headingFont?.trim();
  const rawBody = template?.bodyFont?.trim();

  const heading = rawHeading || DEFAULT_FONT;
  const body = rawBody || DEFAULT_FONT;

  return { heading, body };
}

export function buildFontStyles(template: StorefrontTemplate | null): FontStyles {
  const fonts = resolveStorefrontFonts(template);
  return {
    headingStyle: { fontFamily: fonts.heading },
    bodyStyle: { fontFamily: fonts.body },
  };
}
