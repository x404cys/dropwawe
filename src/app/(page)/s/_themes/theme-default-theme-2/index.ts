// THEME: default-theme - index

import AnnouncementBar from './components/AnnouncementBar';
import BannerCarousel from './components/BannerCarousel';
import ProductCard from './components/ProductCard';
import SearchBar from './components/SearchBar';
import Footer from './Footer';
import Navbar from './Navbar';
import AboutSection from './sections/AboutSection';
import CtaSection from './sections/CtaSection';
import HeroSection from './sections/HeroSection';
import ServicesSection from './sections/ServicesSection';
import StoreSection from './sections/StoreSection';
import TestimonialsSection from './sections/TestimonialsSection';
import type { ThemeConfig } from '../types';

// DESIGN: This preset recreates the original Storefront.tsx composition as a typed swappable theme.
const defaultTheme2: ThemeConfig = {
  id: 9,
  name: 'default-theme-2',
  description:
    'Arabic-first soft commerce storefront matching the original Storefront.tsx layout with typed hero and section data.',
  forcedDir: 'rtl',
  contentOffsetClass: 'pt-0',
  components: {
    Navbar,
    Footer,
    AnnouncementBar,
    BannerCarousel,
    HeroSection,
    StoreSection,
    AboutSection,
    CtaSection,
    ServicesSection,
    TestimonialsSection,
    ProductCard,
    SearchBar,
  },
};

export default defaultTheme2;
