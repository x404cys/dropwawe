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

export interface WorkItem {
  id: string;
  title: string;
  category: string;
  icon?: string;
  displayType?: 'ICON' | 'IMAGE';
  link: string;
  image?: string | null;
  order: number;
  serviceId?: string | null;
}

export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
  name: string;
  description: string;
  worksTitle: string;
  worksDesc: string;
  enabled: boolean;
  order: number;
  works: WorkItem[];
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

export type ContactType =
  | 'email'
  | 'whatsapp'
  | 'website'
  | 'phone'
  | 'instagram'
  | 'facebook'
  | 'telegram'
  | 'custom';

export interface ContactItem {
  id: string;
  type: ContactType;
  label: string;
  value: string;
  enabled: boolean;
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

// ───────────────── HERO SECTION TYPES ─────────────────

export type HeroLayout =
  | 'CENTERED'
  | 'SPLIT'
  | 'IMAGE_LEFT'
  | 'IMAGE_RIGHT'
  | 'MINIMAL'
  | 'FULLSCREEN';

export type HeroBackgroundType = 'COLOR' | 'IMAGE' | 'VIDEO' | 'GRADIENT';

export type HeroAlign = 'left' | 'center' | 'right';
export type HeroContentPosition = 'start' | 'center' | 'end';
export type HeroMediaPosition = 'left' | 'right' | 'top' | 'bottom';
export type HeroSectionHeight = 'auto' | 'sm' | 'md' | 'lg' | 'xl' | 'screen';
export type HeroContainerStyle = 'boxed' | 'full';
export type HeroVerticalPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface HeroStatItem {
  id: string;
  label: string;
  value: string;
  icon?: string;
  order: number;
  enabled: boolean;
}

export interface HeroFeatureItem {
  id: string;
  title: string;
  desc?: string;
  icon?: string;
  image?: string | null;
  link?: string;
  order: number;
  enabled: boolean;
}

export interface HeroTrustItem {
  id: string;
  text: string;
  icon?: string;
  order: number;
  enabled: boolean;
}

export interface HeroSectionItem {
  id: string;

  enabled: boolean;
  visible: boolean;
  order: number;

  badgeText?: string;
  badgeIcon?: string;
  overline?: string;

  title?: string;
  highlightText?: string;
  subtitle?: string;
  description?: string;

  trustText?: string;
  smallNote?: string;

  primaryButtonText?: string;
  primaryButtonLink?: string;
  primaryButtonIcon?: string;

  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  secondaryButtonIcon?: string;

  heroImage?: string | null;
  heroImageAlt?: string;
  heroImageMobile?: string | null;

  backgroundType: HeroBackgroundType;
  backgroundImage?: string | null;
  backgroundImageMobile?: string | null;
  backgroundColor?: string;
  backgroundGradientFrom?: string;
  backgroundGradientTo?: string;
  backgroundGradientVia?: string;

  overlayEnabled: boolean;
  overlayColor?: string;
  overlayOpacity: number;

  layout: HeroLayout;
  contentAlign: HeroAlign;
  contentPosition: HeroContentPosition;
  mediaPosition: HeroMediaPosition;

  contentMaxWidth?: string;
  sectionHeight?: HeroSectionHeight;
  containerStyle?: HeroContainerStyle;
  verticalPadding?: HeroVerticalPadding;

  showButtons: boolean;
  showStats: boolean;
  showFeatures: boolean;
  showTrustItems: boolean;

  roundedMedia: boolean;
  glassEffect: boolean;
  blurBackground: boolean;
  shadowMedia: boolean;
  borderMedia: boolean;

  promoText?: string;
  promoEndsAt?: string | null;
  urgencyText?: string;

  ariaLabel?: string;
  sectionId?: string;

  stats: HeroStatItem[];
  features: HeroFeatureItem[];
  trustItems: HeroTrustItem[];
}
export interface HeroButtonItem {
  id: string;
  label: string;
  text: string;
  actionType: 'scroll' | 'url' | 'whatsapp' | 'phone' | 'email' | 'none';
  actionDetail: string;
  order: number;
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
  contactItems: ContactItem[];
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
  heroButtons: HeroButtonItem[];
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

  // Hero
  heroSection?: HeroSectionItem | null;
}

// Color preset shape (kept in defaults.ts)
export interface ColorPreset {
  primary: string;
  accent: string;
  bg: string;
  text: string;
  name: string;
}
