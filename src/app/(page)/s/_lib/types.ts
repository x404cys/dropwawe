// Purpose: Centralized TypeScript types for the /s storefront route group.
// All types are derived from the Prisma schema + UI-specific shapes.

import type { CSSProperties } from 'react';
import { ProductPricing, subInfo } from '@/types/Products';
import { StoreProps } from '@/types/store/StoreType';

export type ActiveColors = {
  primary: string;
  accent: string;
  bg: string;
  text: string;
};

export type StorefrontFonts = {
  heading: string;
  body: string;
};

export type AnnouncementBarConfig = {
  enabled: boolean;
  text: string;
  bgColor: string;
  textColor: string;
  postion: string;
};

export type SectionsConfig = {
  hero: boolean;
  services: boolean;
  works: boolean;
  testimonials: boolean;
  cta: boolean;
  about: boolean;
  store: boolean;
};

export type ColorConfig = {
  primary: string;
  accent: string;
  bg: string;
  text: string;
};

export type StorefrontWork = {
  id: string;
  title: string;
  category: string;
  icon?: string;
  displayType?: 'ICON' | 'IMAGE';
  link: string;
  image?: string | null;
  order: number;
  serviceId?: string | null;
};

export type StorefrontService = {
  id: string;
  icon: string;
  title: string;
  desc: string | null;
  name?: string | null;
  description?: string | null;
  worksTitle: string | null;
  worksDesc: string | null;
  enabled: boolean;
  order: number;
  works: StorefrontWork[];
};

export type StorefrontTestimonial = {
  id: string;
  name: string;
  role: string | null;
  text: string;
  rating: number;
  order: number;
};

export type StorefrontBanner = {
  id: string;
  url: string;
  order: number;
  postion: string;
};

export type StorefrontCategorySection = {
  id: string;
  category: string;
  enabled: boolean;
  order: number;
};

export type StorefrontCategoryIcon = {
  id: string;
  category: string;
  icon: string;
  image: string | null;
};

export type StorefrontCustomFont = {
  id: string;
  name: string;
  url: string;
};

export type StorefrontContactType =
  | 'email'
  | 'whatsapp'
  | 'website'
  | 'phone'
  | 'instagram'
  | 'facebook'
  | 'telegram'
  | 'custom';

export type StorefrontContactItem = {
  id: string;
  type: StorefrontContactType;
  label: string;
  value: string;
  enabled: boolean;
};

export type StorefrontHeroStat = {
  id: string;
  label: string;
  value: string;
  icon: string | null;
  order: number;
  enabled: boolean;
};

export type StorefrontHeroFeature = {
  id: string;
  title: string;
  desc: string | null;
  icon: string | null;
  image: string | null;
  link: string | null;
  order: number;
  enabled: boolean;
};

export type StorefrontHeroTrustItem = {
  id: string;
  text: string;
  icon: string | null;
  order: number;
  enabled: boolean;
};

export type StorefrontHeroBadge = {
  id: string;
  text: string;
  icon: string | null;
  color: string | null;
  order: number;
  enabled: boolean;
};

export type StorefrontHeroSocialLink = {
  id: string;
  platform: string;
  label: string | null;
  url: string;
  icon: string | null;
  order: number;
  enabled: boolean;
};

export type StorefrontHeroSection = {
  id: string;
  templateId: string;
  enabled: boolean;
  visible: boolean;
  order: number;
  badgeText: string | null;
  badgeIcon: string | null;
  overline: string | null;
  title: string | null;
  highlightText: string | null;
  subtitle: string | null;
  description: string | null;
  trustText: string | null;
  smallNote: string | null;
  primaryButtonText: string | null;
  primaryButtonLink: string | null;
  primaryButtonIcon: string | null;
  primaryButtonTarget: string | null;
  secondaryButtonText: string | null;
  secondaryButtonLink: string | null;
  secondaryButtonIcon: string | null;
  secondaryButtonTarget: string | null;
  tertiaryButtonText: string | null;
  tertiaryButtonLink: string | null;
  tertiaryButtonIcon: string | null;
  tertiaryButtonTarget: string | null;
  heroImage: string | null;
  heroImageAlt: string | null;
  heroImageMobile: string | null;
  heroVideo: string | null;
  heroVideoPoster: string | null;
  backgroundType: string | null;
  backgroundImage: string | null;
  backgroundImageMobile: string | null;
  backgroundVideo: string | null;
  backgroundColor: string | null;
  backgroundGradientFrom: string | null;
  backgroundGradientTo: string | null;
  backgroundGradientVia: string | null;
  overlayEnabled: boolean;
  overlayColor: string | null;
  overlayOpacity: number;
  layout: string;
  contentAlign: string;
  contentPosition: string;
  mediaPosition: string;
  contentMaxWidth: string | null;
  sectionHeight: string | null;
  containerStyle: string | null;
  verticalPadding: string | null;
  showButtons: boolean;
  showBadge: boolean;
  showStats: boolean;
  showFeatures: boolean;
  showTrustItems: boolean;
  showScrollHint: boolean;
  roundedMedia: boolean;
  glassEffect: boolean;
  blurBackground: boolean;
  shadowMedia: boolean;
  borderMedia: boolean;
  promoText: string | null;
  promoEndsAt: string | null;
  urgencyText: string | null;
  ariaLabel: string | null;
  sectionId: string | null;
  createdAt: string;
  updatedAt: string;
  stats: StorefrontHeroStat[];
  features: StorefrontHeroFeature[];
  trustItems: StorefrontHeroTrustItem[];
  badges: StorefrontHeroBadge[];
  socials: StorefrontHeroSocialLink[];
  heroButtons: StorefrontHeroButton[];
};

export type StorefrontHeroButton = {
  label: string;
  text: string | null;
  actionType: string;
  actionTarget: string;
  actionUrl: string;
  actionMessage: string;
  order: number;
};

export type StorefrontTemplate = {
  id: string;
  storeId: string;
  tagline: string | null;
  heroButtonText: string | null;
  heroSecondaryButton: string | null;
  aboutText: string | null;
  storeDescription: string | null;
  ctaTitle: string | null;
  ctaDesc: string | null;
  ctaButton: string | null;
  contactEmail: string | null;
  contactWebsite: string | null;
  whatsappNumber: string | null;
  contactItems?: StorefrontContactItem[] | null;
  headingFont: string;
  bodyFont: string;
  selectedPreset: number;
  useCustomColors: boolean;
  colorPrimary: string | null;
  colorAccent: string | null;
  colorBg: string | null;
  colorText: string | null;
  categoryDisplayMode: string;
  announcementBar: AnnouncementBarConfig | null;
  sectionsConfig: SectionsConfig | null;
  services: StorefrontService[];
  testimonials: StorefrontTestimonial[];
  bannerImages: StorefrontBanner[];
  categorySections: StorefrontCategorySection[];
  categoryIcons: StorefrontCategoryIcon[];
  customFonts: StorefrontCustomFont[];
  heroSection: StorefrontHeroSection | null;
};

export type StorefrontStore = {
  id: string;
  name: string | null;
  subLink: string | null;
  image: string | null;
  phone: string | null;
  instaLink: string | null;
  facebookLink: string | null;
  telegram: string | null;
  description: string | null;
  shippingPrice?: number;
};

export type StorefrontProductImage = {
  id: string;
  url: string;
};

export type StorefrontProductSize = {
  id: string;
  size: string;
  stock: number;
};

export type StorefrontProductColor = {
  id: string;
  name: string;
  hex: string | null;
  stock: number;
};

export type StorefrontProduct = {
  priceBeforeDiscount?: number;
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  discount: number;
  image?: string;
  description?: string;
  selectedColor?: string | undefined;
  selectedSize?: string | undefined;
  hasReturnPolicy?: string;
  shippingType?: string;
  isDigital?: boolean;
  images?: StorefrontProductImage[];
  sizes?: StorefrontProductSize[];
  colors?: StorefrontProductColor[];
  unlimited?: boolean;
  isFromSupplier?: boolean;
  user?: {
    id: string;
    storeName?: string;
    storeSlug?: string;
    shippingPrice?: number;
    stores?: { store: StoreProps }[];
  };
  pricingDetails?: ProductPricing;
  subInfo?: subInfo;
};

export type CartItem = {
  product: StorefrontProduct;
  qty: number;
};

export type CheckoutStep = 'cart' | 'info' | 'success';

export type CustomerInfo = {
  name: string;
  phone: string;
  email: string;
  notes: string;
  location: string;
};

export interface AnnouncementBarProps {
  config: AnnouncementBarConfig;
}

export interface BannerCarouselProps {
  banners: string[];
  colors: ActiveColors;
}

export interface NavbarProps {
  store: StorefrontStore;
  template: StorefrontTemplate;
  colors: ActiveColors;
  fonts: StorefrontFonts;
  sections: SectionsConfig;
  hasAnnouncementBar: boolean;
}

export interface FooterProps {
  store: StorefrontStore;
  template: StorefrontTemplate;
  colors: ActiveColors;
  fonts: StorefrontFonts;
  sections: SectionsConfig;
}

export interface HeroSectionProps {
  store: StorefrontStore;
  template: StorefrontTemplate;
  colors: ActiveColors;
  fonts: StorefrontFonts;
}

export interface ServicesSectionProps {
  services: StorefrontService[];
  colors: ActiveColors;
  fonts: StorefrontFonts;
  showWorksSection?: boolean;
}

export interface StoreSectionProps {
  products: StorefrontProduct[];
  template: StorefrontTemplate;
  colors: ActiveColors;
  fonts: StorefrontFonts;
  upStoreBanners?: string[];
  btwCatBanners?: string[];
  enabledCategorySections: StorefrontCategorySection[];
  centerBanners?: string[];
}

export interface AboutSectionProps {
  template: StorefrontTemplate;
  store: StorefrontStore;
  colors: ActiveColors;
  fonts: StorefrontFonts;
}

export interface CtaSectionProps {
  template: StorefrontTemplate;
  store: StorefrontStore;
  colors: ActiveColors;
  fonts: StorefrontFonts;
}

export interface TestimonialsSectionProps {
  testimonials: StorefrontTestimonial[];
  colors: ActiveColors;
  fonts: StorefrontFonts;
}

export interface ProductCardProps {
  product: StorefrontProduct;
  colors: ActiveColors;
  fonts: StorefrontFonts;
}

export interface SearchBarProps {
  value: string;
  onChange: (q: string) => void;
  colors: ActiveColors;
  fonts: StorefrontFonts;
}

export interface StorefrontShellProps {
  store: StorefrontStore;
  template: StorefrontTemplate;
  products: StorefrontProduct[];
  colors: ActiveColors;
  fonts: StorefrontFonts;
  sections: SectionsConfig;
  announcement: AnnouncementBarConfig | null;
  topBanners: string[];
  upStoreBanners?: string[];
  btwCatBanners?: string[];
  centerBanners?: string[];
  enabledCategorySections: StorefrontCategorySection[];
  style?: CSSProperties;
  className?: string;
}
