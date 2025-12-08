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
  //
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
              المميزات
            </a>
            <a href="#s2" className="text-black/90 transition">
              المميزات
            </a>{' '}
            <a href="#s2" className="text-black/90 transition">
              المميزات
            </a>{' '}
            <a href="#s2" className="text-black/90 transition">
              المميزات
            </a>{' '}
            <a href="#s2" className="text-black/90 transition">
              المميزات
            </a>
          </div>
          <Button
            onClick={() => router.push('https://login.sahlapp.io')}
            className="rounded-2xl border border-black bg-white text-black hover:bg-gray-950 hover:text-white"
          >
            انطلق الان
          </Button>
        </div>
      </nav>

      <section className="relative py-8">
        <div className="container mx-auto flex flex-col items-center gap-10 px-4 sm:px-6 lg:flex-row lg:gap-20">
          <div className="relative w-full flex-1 lg:w-1/2">
            <h1 className="text-3xl leading-tight font-bold sm:text-4xl md:text-5xl lg:text-6xl">
              منصة التجارة الإلكترونية <span className="text-primary">الرائدة</span> في العراق
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              انشئ متجرك , اضف المنتجات , بيع !
            </p>
            <p className="text-muted-foreground mt-2 hidden max-w-xl sm:text-base md:block md:text-lg lg:text-xl">
              انشئ متجرك خلال دقائق، أضف المنتجات، وابدأ البيع بسهولة مع أدوات متكاملة.
            </p>
            <div className="mt-8">
              <Button
                onClick={() => router.push('https://login.sahlapp.io')}
                className="rounded-3xl border border-black bg-white text-black hover:bg-gray-950 hover:text-white md:hidden"
              >
                سجل هسه
              </Button>
            </div>
            <div className="mt-4 hidden flex-col gap-2 md:flex">
              <Button
                onClick={() => router.push('https://login.sahlapp.io')}
                className="rounded-xl bg-black px-6 py-3 text-sm text-white hover:bg-black/90 sm:text-base"
              >
                ابدأ الآن مجانا
              </Button>
              <Button
                onClick={() =>
                  router.push('https://www.instagram.com/sahlappio?igsh=MWpkcGE0MWMzeHRqeg==')
                }
                variant="outline"
                className="rounded-xl border border-black px-6 py-3 text-sm text-black hover:bg-black/10 sm:text-base"
              >
                تواصل معنا
              </Button>
            </div>

            <div className="absolute top-16 left-0 -z-10 h-24 w-24 md:top-28 md:h-48 md:w-48">
              <Image src="/bg-logo.png" alt="logo" fill className="object-contain" />
            </div>
          </div>

          <div className="flex w-full flex-1 justify-center py-12 lg:w-1/2 lg:justify-end">
            <MockupMobile />
          </div>
        </div>
      </section>

      <section id="s2" className="border-b py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center sm:mb-16" data-aos="fade-up">
            <div className="bg-primary/10 text-primary mx-auto mb-4 inline-block rounded-full px-4 py-1.5 text-xs sm:text-sm">
              المميزات
            </div>
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">
              كل ما تحتاجه لنجاح تجارتك الإلكترونية
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-sm sm:text-base md:text-lg">
              منصة متكاملة تجمع كل الأدوات والخدمات لإدارة وتنمية متجرك الإلكتروني بنجاح.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="feature-card group rounded-2xl border bg-white p-6 transition hover:shadow-md"
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border transition group-hover:scale-110 sm:h-16 sm:w-16">
                    <Icon className="text-primary h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                  <h3 className="mt-4 mb-2 text-lg font-semibold sm:text-xl">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div
            className="mt-10 flex flex-col items-center text-center"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <p className="text-muted-foreground mb-4 text-sm sm:mb-6 sm:text-base md:text-lg">
              وأكثر من ذلك بكثير! اكتشف جميع المميزات
            </p>
            <button
              onClick={() => router.push('https://login.sahlapp.io')}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm text-white shadow-md transition hover:scale-105 hover:bg-black/90 sm:text-base"
            >
              ماذا تنتظر؟ ابدأ الآن
              <ZapIcon className="h-5 w-5 text-yellow-400" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Page;
