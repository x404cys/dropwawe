// src/lib/template/defaults.ts
// Default values and color presets for the StoreTemplate.
// Used when a template has not been created yet, or for fallback values.

import type {
  AnnouncementBarConfig,
  SectionsConfig,
  ColorPreset,
  TemplateFormState,
} from './types';

export const COLOR_PRESETS: ColorPreset[] = [
  {
    name: 'سماوي',
    primary: '#0EA5E9',
    accent: '#06B6D4',
    bg: '#FFFFFF',
    text: '#1a2332',
  },
  {
    name: 'بنفسجي',
    primary: '#8B5CF6',
    accent: '#A78BFA',
    bg: '#FFFFFF',
    text: '#1a1a2e',
  },
  {
    name: 'زمردي',
    primary: '#10B981',
    accent: '#34D399',
    bg: '#FFFFFF',
    text: '#1a2e1a',
  },
  {
    name: 'برتقالي',
    primary: '#F97316',
    accent: '#FB923C',
    bg: '#FFFFFF',
    text: '#2e1a0c',
  },
  {
    name: 'مرجاني',
    primary: '#EC4899',
    accent: '#F472B6',
    bg: '#FFFFFF',
    text: '#2e1a24',
  },
  {
    name: 'ليلي',
    primary: '#6366F1',
    accent: '#818CF8',
    bg: '#0F172A',
    text: '#F1F5F9',
  },
  {
    name: 'ذهبي',
    primary: '#D4AF37',
    accent: '#F0D060',
    bg: '#1A1A1A',
    text: '#FAFAFA',
  },
  {
    name: 'أحمر',
    primary: '#EF4444',
    accent: '#F87171',
    bg: '#FFFFFF',
    text: '#1a1a1a',
  },
];

export const DEFAULT_ANNOUNCEMENT_BAR: AnnouncementBarConfig = {
  enabled: false,
  text: 'مرحباً بكم في متجرنا! استمتع بالتسوق.',
  bgColor: '#6366f1',
  textColor: '#ffffff',
};

export const DEFAULT_SECTIONS_CONFIG: SectionsConfig = {
  hero: true,
  services: true,
  works: true,
  testimonials: true,
  cta: true,
  about: true,
  store: true,
};

export const DEFAULT_TEMPLATE_STATE: TemplateFormState = {
  tagline: '',
  heroButtonText: 'تسوق الآن',
  heroSecondaryButton: 'تعرف علينا',
  aboutText: '',
  storeDescription: '',
  ctaTitle: '',
  ctaDesc: '',
  ctaButton: 'ابدأ الآن',
  contactEmail: '',
  contactWebsite: '',
  whatsappNumber: '',
  contactItems: [],
  headingFont: 'IBM Plex Sans Arabic',
  bodyFont: 'IBM Plex Sans Arabic',
  selectedPreset: 0,
  useCustomColors: false,
  colorPrimary: COLOR_PRESETS[0].primary,
  colorAccent: COLOR_PRESETS[0].accent,
  colorBg: COLOR_PRESETS[0].bg,
  colorText: COLOR_PRESETS[0].text,
  categoryDisplayMode: 'icons',
  isDraft: true,
  heroButtons: [],
  announcementBar: DEFAULT_ANNOUNCEMENT_BAR,
  sectionsConfig: DEFAULT_SECTIONS_CONFIG,
  services: [],
  works: [],
  testimonials: [],
  bannerImages: [],
  categorySections: [],
  categoryIcons: [],
  customFonts: [],
};
