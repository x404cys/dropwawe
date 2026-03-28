// Purpose: Color presets and getActiveColors utility for the storefront.
// Resolves the active color palette from template DB fields or preset index.

import {
  COLOR_PRESETS as TEMPLATE_COLOR_PRESETS,
  DEFAULT_TEMPLATE_STATE,
} from '@/lib/template/defaults';

import { ActiveColors, ColorConfig, StorefrontTemplate } from '../_lib/types';

export const COLOR_PRESETS: ColorConfig[] = TEMPLATE_COLOR_PRESETS.map(
  ({ primary, accent, bg, text }) => ({
    primary,
    accent,
    bg,
    text,
  })
);

const DEFAULT_PRESET_INDEX = DEFAULT_TEMPLATE_STATE.selectedPreset;
const FALLBACK_PRESET = COLOR_PRESETS[DEFAULT_PRESET_INDEX] ?? COLOR_PRESETS[0];

function getPresetByIndex(selectedPreset: number | null | undefined): ColorConfig {
  if (typeof selectedPreset !== 'number') {
    return FALLBACK_PRESET;
  }

  return COLOR_PRESETS[selectedPreset] ?? FALLBACK_PRESET;
}

export function getActiveColors(template: StorefrontTemplate | null): ActiveColors {
  if (!template) return FALLBACK_PRESET;
  if (
    template.useCustomColors &&
    template.colorPrimary &&
    template.colorAccent &&
    template.colorBg &&
    template.colorText
  ) {
    return {
      primary: template.colorPrimary,
      accent: template.colorAccent,
      bg: template.colorBg,
      text: template.colorText,
    };
  }
  return getPresetByIndex(template.selectedPreset);
}

export const DEFAULT_TEMPLATE = {
  id: '',
  storeId: '',
  tagline: 'أفضل المنتجات بأفضل الأسعار',
  heroButtonText: 'تسوق الآن',
  heroSecondaryButton: 'تعرف علينا',
  aboutText: 'نحن متجر متخصص نقدم أفضل المنتجات لعملائنا الكرام',
  storeDescription: null,
  ctaTitle: 'جاهز للبدء؟',
  ctaDesc: 'انضم إلى آلاف العملاء الراضين',
  ctaButton: 'تسوق الآن',
  contactEmail: null,
  contactWebsite: null,
  whatsappNumber: null,
  headingFont: 'IBM Plex Sans Arabic',
  bodyFont: 'IBM Plex Sans Arabic',
  selectedPreset: DEFAULT_PRESET_INDEX,
  useCustomColors: false,
  colorPrimary: null,
  colorAccent: null,
  colorBg: null,
  colorText: null,
  categoryDisplayMode: 'icons',
  announcementBar: null,
  sectionsConfig: null,
  services: [],
  testimonials: [],
  bannerImages: [],
  categorySections: [],
  categoryIcons: [],
  customFonts: [],
  heroSection: null,
} satisfies StorefrontTemplate;

export const DEFAULT_SECTIONS = {
  hero: false,
  services: false,
  works: false,
  testimonials: false,
  cta: false,
  about: false,
  store: true,
};
