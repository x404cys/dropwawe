// THEME: modern-structured — index

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

// DESIGN: This preset keeps the global shell behavior standard and focuses all identity changes inside the visual components.
const modernStructured: ThemeConfig = {
  id: 7,
  name: 'modern-structured',
  description:
    'Premium SaaS-style storefront with explicit grids, consistent borders, and structured hierarchy.',
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

export default modernStructured;
