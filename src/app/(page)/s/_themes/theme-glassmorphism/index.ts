// THEME: glassmorphism — index

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

// DESIGN: This preset keeps theme behavior inside swappable visual components while the storefront business logic stays shared.
const glassmorphism: ThemeConfig = {
  id: 8,
  name: 'glassmorphism',
  description: 'Glass UI storefront with layered blur, soft glows, and dark ambient surfaces.',
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

export default glassmorphism;
