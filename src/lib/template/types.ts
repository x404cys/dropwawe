// src/lib/template/types.ts
// Shared TypeScript types for the StoreTemplate feature.
// These mirror the Prisma models but are shaped for the client-side form state.

export interface AnnouncementBarConfig {
  enabled: boolean;
  text: string;
  bgColor: string;
  textColor: string;
}

export interface SectionsConfig {
  hero: boolean;
  services: boolean;
  works: boolean;
  testimonials: boolean;
  cta: boolean;
  about: boolean;
  store: boolean;
}

export interface ColorConfig {
  primary: string;
  accent: string;
  bg: string;
  text: string;
}

export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
  order: number;
}

export interface WorkItem {
  id: string;
  title: string;
  category: string;
  link: string;
  image: string | null;
  order: number;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  order: number;
}

export interface BannerItem {
  id: string;
  url: string;
  order: number;
  postion: string;
}

export interface CategorySectionItem {
  id: string;
  category: string;
  enabled: boolean;
  order: number;
}

export interface CategoryIconItem {
  id: string;
  category: string;
  icon: string;
  image: string | null;
}

export interface CustomFontItem {
  id: string;
  name: string;
  url: string;
}

export interface TemplateFormState {
  // Scalars
  tagline: string;
  heroButtonText: string;
  heroSecondaryButton: string;
  aboutText: string;
  storeDescription: string;
  ctaTitle: string;
  ctaDesc: string;
  ctaButton: string;
  contactEmail: string;
  contactWebsite: string;
  whatsappNumber: string;
  headingFont: string;
  bodyFont: string;
  selectedPreset: number;
  useCustomColors: boolean;
  colorPrimary: string;
  colorAccent: string;
  colorBg: string;
  colorText: string;
  categoryDisplayMode: 'icons' | 'pills';
  isDraft: boolean;

  // JSON fields (parsed)
  announcementBar: AnnouncementBarConfig;
  sectionsConfig: SectionsConfig;

  // Relations
  services: ServiceItem[];
  works: WorkItem[];
  testimonials: TestimonialItem[];
  bannerImages: BannerItem[];
  categorySections: CategorySectionItem[];
  categoryIcons: CategoryIconItem[];
  customFonts: CustomFontItem[];
}

// Color preset shape (kept in defaults.ts)
export interface ColorPreset {
  primary: string;
  accent: string;
  bg: string;
  text: string;
  name: string;
}
