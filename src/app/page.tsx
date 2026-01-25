'use client';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Shield,
  Headphones,
  Palette,
  Zap,
  AppWindow,
  ZapIcon,
  ClipboardCheck,
} from 'lucide-react';
import Footer from '@/components/Footer/Footer';
import Logo from '@/components/utils/Logo';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTrackVisitor4landing } from './lib/context/SaveVisitorId';
import MockupMobile from '@/components/utils/MockupMobile';
import Image from 'next/image';
import ProjectOwnersSection from '@/components/ProjectOwnersSection/ProjectOwnersSection';
import FeatureSection from '@/components/FeatureSection/FeatureSection';
import PaymentSection from '@/components/PaymentSection/PaymentSection';
import DeliveryIntegrationSection from '@/components/DeliveryIntegrationSection/DeliveryIntegrationSection';
import UnlimitedProductsSection from '@/components/UnlimitedProductsSection/UnlimitedProductsSection';
import SmartMarketingSection from '@/components/MarketingSection/MarketingSection';
import PricingSection from '@/components/PricingSection/PricingSection';
import FAQSection from '@/components/FAQ/FAQ';
import { LuMousePointerClick } from 'react-icons/lu';
import HeroSection from '@/components/Hero/HeroSection';
import Navbar from '@/components/NavBar/NavBar';

const Page = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
  }, []);

  useTrackVisitor4landing('sahl2025');

  return (
    <div dir="rtl" className="min-h-screen bg-sky-100 font-sans">
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
        <FAQSection />
        <section className="flex flex-col items-center justify-center gap-6 bg-white p-10 text-center">
          <div className="max-w-md">
            <h1 className="mb-4 text-3xl font-bold"> سجل والباقي علينا !</h1>
            <p className="mb-4 text-gray-600">
              نسهلها، نبسطها، نساعدك، ندعمك، وكل الي عليك تنظم ويانا
            </p>
          </div>
          <div className="flex w-full justify-center">
            <Button
              onClick={() => {
                router.push('https://login.dropwave.cloud');
              }}
              className="flex cursor-pointer items-center justify-between rounded-2xl border-sky-600 bg-sky-700 px-28 py-3"
            >
              <span className="">سجل</span> <LuMousePointerClick className="text-xs" />
            </Button>
          </div>
        </section>
      </section>
      <Footer />
    </div>
  );
};

export default Page;
