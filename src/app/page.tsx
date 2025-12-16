'use client';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Button } from '@/components/ui/button';
import { BarChart3, Shield, Headphones, Palette, Zap, AppWindow, ZapIcon } from 'lucide-react';
import Footer from '@/components/Footer/Footer';
import Logo from '@/components/utils/Logo';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTrackVisitor4landing } from './lib/context/SaveVisitorId';
import MockupMobile from '@/components/utils/MockupMobile';
import Image from 'next/image';

const Page = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const features = [
    { icon: BarChart3, title: 'تحليلات مفصلة', description: 'تقارير شاملة عن المبيعات والعملاء' },
    { icon: Shield, title: 'أمان عالي', description: 'حماية متقدمة لبياناتك وبيانات عملائك' },
    { icon: Headphones, title: 'دعم فني 24/7', description: 'فريق دعم متخصص متاح في أي وقت' },
    {
      icon: Palette,
      title: 'تخصيص كامل',
      description: 'صمم متجرك بالطريقة التي تناسب علامتك التجارية',
    },
    { icon: Zap, title: 'سرعة فائقة', description: 'مواقع سريعة ومحسنة لمحركات البحث' },
    { icon: AppWindow, title: 'تصميم متجاوب', description: 'قوالب مصممة ومتجاوبة مع جميع الاجهزة' },
  ];

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
  }, []);

  useTrackVisitor4landing('sahl2025');

  return (
    <div dir="rtl" className="min-h-screen font-sans md:mx-10">
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
            onClick={() => router.push('https://login.sahlapp.io')}
            className="rounded-2xl border border-sky-400 bg-white text-sky-600 hover:bg-gray-950 hover:text-white"
          >
            انطلق الان
          </Button>
        </div>
      </nav>

      <section className="relative py-8">
        <div className="absolute top-0 right-0 -z-20 h-48 w-48 translate-x-1/3 rounded-full bg-sky-300/30 blur-3xl"></div>

        <div className="container mx-auto flex flex-col items-center gap-10 px-4 sm:px-6 lg:flex-row lg:gap-20">
          <div className="relative w-full flex-1 lg:w-1/2">
            <h1 className="text-3xl leading-tight font-bold sm:text-4xl md:text-5xl lg:text-6xl">
              ضغطة واحدة تفصلك عن <span className="text-sky-400">النجاح</span> في التجارة
              الالكترونية{' '}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              اطلق مشروعك خلال دقائق فقط
            </p>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              ارتقِ بمشروعك واستقبل طلباتك على متجرك الالكتروني مع بوابة دفع امنة وربط مع شركات
              التوصيل .{' '}
            </p>
            <div className="mt-8"></div>
            <div className="mt-4 flex gap-2">
              <Button
                onClick={() => router.push('https://login.sahlapp.io')}
                className="rounded-2xl bg-sky-400 px-6 py-3 text-sm text-white hover:bg-black/90 sm:text-base"
              >
                سجل هسه{' '}
              </Button>
              <Button
                onClick={() =>
                  router.push('https://www.instagram.com/sahlappio?igsh=MWpkcGE0MWMzeHRqeg==')
                }
                variant="outline"
                className="hover:bg-sky-border-sky-400/10 rounded-2xl border border-sky-400 px-6 py-3 text-sm text-sky-400 sm:text-base"
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

      <Footer />
    </div>
  );
};

export default Page;
