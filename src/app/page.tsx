'use client';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from '@/components/Footer/Footer';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTrackVisitor4landing } from './lib/context/SaveVisitorId';
import ProjectOwnersSection from '@/components/ProjectOwnersSection/ProjectOwnersSection';
import FeatureSection from '@/components/FeatureSection/FeatureSection';
import PaymentSection from '@/components/PaymentSection/PaymentSection';
import DeliveryIntegrationSection from '@/components/DeliveryIntegrationSection/DeliveryIntegrationSection';
import UnlimitedProductsSection from '@/components/UnlimitedProductsSection/UnlimitedProductsSection';
import SmartMarketingSection from '@/components/MarketingSection/MarketingSection';
import PricingSection from '@/components/PricingSection/PricingSection';
import { LuMousePointerClick } from 'react-icons/lu';
import HeroSection from '@/components/Hero/HeroSection';
import Navbar from '@/components/NavBar/NavBar';
import ScrollToTopButton from '@/components/Scroll-To-Top';
import { landingFont } from '@/fonts/Export-Font';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
  }, []);

  useTrackVisitor4landing('sahl2025');

  return (
    <div dir="rtl" className={`font-landing min-h-screen bg-sky-100 ${landingFont.className}`}>
      <ScrollToTopButton />
      <Navbar />
      <HeroSection />
      <section>
        <ProjectOwnersSection />
        <FeatureSection />
        <PaymentSection />
        <DeliveryIntegrationSection />
        <UnlimitedProductsSection />
        <SmartMarketingSection />
        <PricingSection />
        <section className="flex flex-col items-center justify-center gap-6 bg-white p-10 text-center">
          <div className="max-w-md">
            <h1 className="mb-4 text-2xl font-bold text-sky-400 md:text-3xl">
              سجّل معنا ودع الباقي علينا!
            </h1>
            <p className="mb-4 text-gray-600">
              نسعى لتسهيل تجربتك، تبسيط الإجراءات، تقديم الدعم الكامل، وكل ما عليك هو الانضمام
              إلينا.
            </p>
          </div>
          <div className="flex w-full justify-center">
            <button
              onClick={() => router.push('https://login.matager.store')}
              className="ite relative flex cursor-pointer rounded-full bg-gradient-to-l from-sky-300/80 from-5% via-sky-200/80 via-60% to-sky-200/90 to-80% px-8 py-2 font-bold text-sky-900 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),_0_6px_20px_rgba(0,150,200,0.35)] ring-2 ring-white/70 backdrop-blur-lg transition-all duration-300 hover:scale-105"
            >
              <span>سجّل الآن</span> <LuMousePointerClick className="text-xs" />
              <span className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_12px_2px_rgba(255,255,255,0.6)] ring-1 ring-white/70" />
            </button>
          </div>
        </section>
      </section>
      <Footer />
    </div>
  );
};

export default Page;
