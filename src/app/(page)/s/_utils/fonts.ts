// Purpose: Font style builders convert template font fields into
// React.CSSProperties objects for spread into style props.

import { DEFAULT_TEMPLATE_FONT, resolveTemplateFontFamily } from '@/lib/template/font-family';
import { StorefrontFonts, StorefrontTemplate } from '../_lib/types';

export const DEFAULT_FONT = DEFAULT_TEMPLATE_FONT;
export const resolveStorefrontFontFamily = resolveTemplateFontFamily;

export interface FontStyles {
  headingStyle: React.CSSProperties;
  bodyStyle: React.CSSProperties;
}

export function resolveStorefrontFonts(template: StorefrontTemplate | null): StorefrontFonts {
  const rawHeading = template?.headingFont?.trim();
  const rawBody = template?.bodyFont?.trim();

  const heading = resolveStorefrontFontFamily(rawHeading);
  const body = resolveStorefrontFontFamily(rawBody);

  return { heading, body };
}

export function buildFontStyles(template: StorefrontTemplate | null): FontStyles {
  const fonts = resolveStorefrontFonts(template);
  return {
    headingStyle: { fontFamily: fonts.heading },
    bodyStyle: { fontFamily: fonts.body },
  };
}
