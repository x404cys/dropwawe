export const DEFAULT_TEMPLATE_FONT = 'IBM Plex Sans Arabic';

export const TEMPLATE_BUILT_IN_FONT_VARIABLES = {
  'IBM Plex Sans Arabic': '--store-font-ibm-plex-sans-arabic',
  Cairo: '--store-font-cairo',
  Tajawal: '--store-font-tajawal',
  Almarai: '--store-font-almarai',
  'Noto Sans Arabic': '--store-font-noto-sans-arabic',
  Rubik: '--store-font-rubik',
} as const;

export type BuiltInTemplateFont = keyof typeof TEMPLATE_BUILT_IN_FONT_VARIABLES;

function quoteFontFamily(fontName: string) {
  const escaped = fontName.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return `'${escaped}', sans-serif`;
}

export function isBuiltInTemplateFont(fontName?: string | null): fontName is BuiltInTemplateFont {
  if (!fontName) return false;
  return fontName in TEMPLATE_BUILT_IN_FONT_VARIABLES;
}

export function resolveTemplateFontFamily(fontName?: string | null) {
  const normalized = fontName?.trim();
  const safeFont = normalized || DEFAULT_TEMPLATE_FONT;

  if (isBuiltInTemplateFont(safeFont)) {
    return `var(${TEMPLATE_BUILT_IN_FONT_VARIABLES[safeFont]}), sans-serif`;
  }

  return quoteFontFamily(safeFont);
}
