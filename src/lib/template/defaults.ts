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
  { name: 'ليلي',      primary: '#6366f1', accent: '#8b5cf6', bg: '#0f0f14', text: '#f4f4f5' },
  { name: 'فجري',      primary: '#f59e0b', accent: '#ef4444', bg: '#fffbf5', text: '#1c1917' },
  { name: 'مرجاني',   primary: '#ec4899', accent: '#8b5cf6', bg: '#fdf2f8', text: '#1e1b4b' },
  { name: 'زمردي',    primary: '#10b981', accent: '#06b6d4', bg: '#f0fdf4', text: '#064e3b' },
  { name: 'صخري',     primary: '#64748b', accent: '#94a3b8', bg: '#f8fafc', text: '#0f172a' },
  { name: 'نيلي',     primary: '#3b82f6', accent: '#06b6d4', bg: '#eff6ff', text: '#1e3a5f' },
  { name: 'شوكولا',   primary: '#92400e', accent: '#b45309', bg: '#fefce8', text: '#1c1917' },
  { name: 'وردي',     primary: '#db2777', accent: '#9333ea', bg: '#fdf4ff', text: '#3b0764' },
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
