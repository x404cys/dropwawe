import FeatureSection from './FeatureSection/FeatureSection';
import Footer from './Footer/Footer';
import HeaderSections from './HeaderSections/HeaderSections';
import HeroSection from './Hero/HeroSection';
import HowItWorksSection from './HowItWorksSection/HowItWorksSection';

export default function HomePage() {
  return (
    <>
      <section>
        <HeaderSections />
        <HeroSection />
        <FeatureSection />
        <HowItWorksSection />
        <Footer />
      </section>
    </>
  );
}
