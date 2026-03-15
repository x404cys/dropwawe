// Purpose: Centralized TypeScript types for the /s storefront route group.
// All types are derived from the Prisma schema + UI-specific shapes.

import { ProductPricing, subInfo } from '@/types/Products';
import { StoreProps } from '@/types/store/StoreType';

export type ActiveColors = {
  primary: string;
  accent: string;
  bg: string;
  text: string;
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

export type StorefrontTemplate = {
  id: string;
  storeId: string;
  tagline: string | null;
  heroButtonText: string | null;
  heroSecondaryButton: string | null;
  aboutText: string | null;
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
  color: string;
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
  selectedColor?: string;
  selectedSize?: string;
  hasReturnPolicy?: string;
  shippingType?: string;
  images?: { id: string; url: string }[];
  sizes?: { id: string; size: string; stock: number }[];
  colors?: { id: string; name: string; hex: string; stock: number }[];
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
};
