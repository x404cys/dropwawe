// Purpose: Color presets and getActiveColors utility for the storefront.
// Resolves the active color palette from template DB fields or preset index.

import { ActiveColors, ColorConfig, StorefrontTemplate } from '../_lib/types';

export const COLOR_PRESETS: ColorConfig[] = [
  { primary: '#0EA5E9', accent: '#06B6D4', bg: '#FFFFFF', text: '#1a2332' },
  { primary: '#8B5CF6', accent: '#A78BFA', bg: '#FFFFFF', text: '#1a1a2e' },
  { primary: '#10B981', accent: '#34D399', bg: '#FFFFFF', text: '#1a2e1a' },
  { primary: '#F97316', accent: '#FB923C', bg: '#FFFFFF', text: '#2e1a0c' },
  { primary: '#EC4899', accent: '#F472B6', bg: '#FFFFFF', text: '#2e1a24' },
  { primary: '#6366F1', accent: '#818CF8', bg: '#0F172A', text: '#F1F5F9' },
  { primary: '#D4AF37', accent: '#F0D060', bg: '#1A1A1A', text: '#FAFAFA' },
  { primary: '#E85D8E', accent: '#F9B4CC', bg: '#FFF8FB', text: '#4B3340' },
];

export function getActiveColors(template: StorefrontTemplate | null): ActiveColors {
  if (!template) return COLOR_PRESETS[7];
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
  return COLOR_PRESETS[template.selectedPreset] ?? COLOR_PRESETS[7];
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
  selectedPreset: 7,
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
