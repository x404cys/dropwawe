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

const Page = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
  }, []);

  useTrackVisitor4landing('sahl2025');

  return (
    <div dir="rtl" className="min-h-screen bg-sky-100 font-sans">
      <nav className="cursor-pointer">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Logo />
          <div className="hidden gap-6 md:flex lg:gap-8">
            <a href="" className="text-black/90 transition">
              الرئيسية
            </a>
            <a href="" className="text-black/90 transition">
              الدعم
            </a>
            <a href="#s2" className="text-black/90 transition">
              الاسعار
            </a>
          </div>
          <Button
            onClick={() => router.push('https://login.dropwave.cloud')}
            className="rounded-2xl border border-sky-700 bg-sky-100 text-sky-600"
          >
            انطلق الان
          </Button>
        </div>
      </nav>

      <section className="relative py-8">
        <div className="absolute top-0 right-0 -z-20 h-48 w-48 translate-x-1/3 rounded-full bg-sky-700/30 blur-3xl"></div>

        <div className="container mx-auto flex flex-col items-center gap-10 px-4 text-sky-900 sm:px-6 lg:flex-row lg:gap-20">
          <div className="relative w-full flex-1 lg:w-1/2">
            <h1 className="text-3xl leading-tight font-bold text-sky-900 sm:text-4xl md:text-5xl lg:text-6xl">
              ضغطة واحدة تفصلك عن <span className="text-sky-400">النجاح</span> في التجارة
              الالكترونية
            </h1>
            <p className="mt-2 text-sm text-sky-700 sm:text-base">اطلق مشروعك خلال دقائق فقط</p>
            <p className="mt-2 text-sm text-sky-700 sm:text-base">
              ارتقِ بمشروعك واستقبل طلباتك على متجرك الالكتروني مع بوابة دفع امنة وربط مع شركات
              التوصيل .
            </p>
            <div className="mt-8"></div>
            <div className="mt-4 flex gap-2">
              <Button
                onClick={() => router.push('https://login.dropwave.cloud')}
                className="rounded-2xl bg-sky-700 px-6 py-3 text-sm text-white hover:bg-black/90 sm:text-base"
              >
                سجل هسه
              </Button>
              <Button
                onClick={() =>
                  router.push('https://www.instagram.com/sahlappio?igsh=MWpkcGE0MWMzeHRqeg==')
                }
                variant="outline"
                className="hover:bg-sky-border-sky-700/10 rounded-2xl border border-sky-700 bg-sky-100 px-6 py-3 text-sm text-sky-700 sm:text-base"
              >
                جرب المنصة
              </Button>
            </div>

            <div className="absolute top-16 left-0 -z-10 h-28 w-28 md:top-40 md:h-48 md:w-48">
              <Image
                src="/Logo-bg-dropwave.png"
                alt="logo"
                fill
                className="rotate-60 object-contain"
              />
            </div>
          </div>

          <div className="flex w-full flex-1 justify-center py-12 lg:w-1/2 lg:justify-end">
            <MockupMobile />
          </div>
        </div>
      </section>
      <section>
        <FeatureSection />
        <ProjectOwnersSection />
        <PaymentSection />
        <UnlimitedProductsSection />
        <DeliveryIntegrationSection />
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
              data-aos="fade-up"
              data-aos-delay="200"
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
