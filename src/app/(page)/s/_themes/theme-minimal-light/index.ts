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

const minimalLight: ThemeConfig = {
  id: 1,
  name: 'minimal-light',
  description: 'Clean minimal storefront with airy grids, thin borders, and precise spacing.',
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

export default minimalLight;
