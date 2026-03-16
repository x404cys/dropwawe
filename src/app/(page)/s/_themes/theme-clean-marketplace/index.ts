// THEME: clean-marketplace - index

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

// DESIGN: This preset behaves like a production marketplace app, so it forces RTL and removes global fixed-header padding.
const cleanMarketplace: ThemeConfig = {
  id: 6,
  name: 'clean-marketplace',
  description:
    'RTL-first consumer marketplace with utility navigation, category thumbnails, and tight product cards.',
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

export default cleanMarketplace;
