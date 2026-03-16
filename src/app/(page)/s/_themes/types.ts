import type { ComponentType } from 'react';
import type {
  AboutSectionProps,
  AnnouncementBarProps,
  BannerCarouselProps,
  CtaSectionProps,
  FooterProps,
  HeroSectionProps,
  NavbarProps,
  ProductCardProps,
  SearchBarProps,
  ServicesSectionProps,
  StoreSectionProps,
  TestimonialsSectionProps,
} from '../_lib/types';

export interface ThemeComponents {
  Navbar: ComponentType<NavbarProps>;
  Footer: ComponentType<FooterProps>;
  AnnouncementBar: ComponentType<AnnouncementBarProps>;
  BannerCarousel: ComponentType<BannerCarouselProps>;
  HeroSection: ComponentType<HeroSectionProps>;
  StoreSection: ComponentType<StoreSectionProps>;
  AboutSection: ComponentType<AboutSectionProps>;
  CtaSection: ComponentType<CtaSectionProps>;
  ServicesSection: ComponentType<ServicesSectionProps>;
  TestimonialsSection: ComponentType<TestimonialsSectionProps>;
  ProductCard: ComponentType<ProductCardProps>;
  SearchBar: ComponentType<SearchBarProps>;
}

export interface ThemeConfig {
  id: number;
  name: string;
  description: string;
  previewImage?: string;
  forcedDir?: 'rtl' | 'ltr';
  contentOffsetClass?: string;
  components: ThemeComponents;
}
