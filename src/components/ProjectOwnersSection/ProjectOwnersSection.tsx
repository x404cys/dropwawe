'use client';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Image from 'next/image';
import { Cpu, Store, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

export default function ProjectOwnersSection() {
  const router = useRouter();

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: false });
  }, []);

  const sections = [
    {
      image: '/img-landing-page/2.png',
      title: 'لأصحاب المشاريع على السوشيال ميديا',
      description:
        'انتقل من البيع العشوائي إلى نظام متكامل بإدارة مخزون، طلبات، تحليلات، وتسويق ذكي.',
      badge: 'سوشيال ميديا',
      icon: <Cpu className="h-5 w-5 text-gray-700" />,
    },

    {
      image: '/img-landing-page/4.png',
      title: 'لكل شخص مهتم بالتجارة الإلكترونية',
      description:
        'ابدأ من الصفر واحصل على متجر إلكتروني جاهز، منتجات مختارة بعناية، محتوى تسويقي قابل للاستخدام مباشرة، وربط كامل ببوابات الدفع وشركات التوصيل.',
      badge: 'مبتدئ',
      icon: <ShoppingCart className="h-5 w-5 text-gray-700" />,
    },
    {
      image: '/img-landing-page/6.png',
      title: 'لأصحاب المحلات',
      description: 'حوّل متجرك من نطاقه المحلي إلى مساحة بيع بلا حدود.',
      badge: 'محلات',
      icon: <Store className="h-5 w-5 text-gray-700" />,
    },
  ];

  return (
    <section dir="rtl" className="bg-gray-50 px-6 py-5 md:px-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center md:mb-16" data-aos="fade-up">
          <h2 className="mb-4 text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl">
            لمن صُمّمت دروب ويڤ؟{' '}
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-3">
          {sections.map((section, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="group overflow-hidden rounded-xl transition-all duration-300"
            >
              <div className="relative h-60 overflow-hidden md:h-64 lg:h-72">
                <Image
                  src={section.image || '/placeholder.svg'}
                  alt={section.title}
                  fill
                  className="rounded-2xl border object-cover transition-transform duration-500"
                />
                <div
                  className="absolute top-4 left-4"
                  data-aos="fade-up"
                  data-aos-delay={index * 150}
                >
                  {' '}
                </div>
              </div>

              <div className="py-3" data-aos-delay={index * 200}>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{section.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{section.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 flex w-full justify-center">
        <button
          onClick={() => router.push('https://login.dropwave.cloud')}
          className="relative cursor-pointer rounded-full bg-gradient-to-l from-sky-300/80 from-5% via-sky-200/80 via-60% to-sky-200/90 to-80% px-8 py-2 font-bold text-sky-900 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),_0_3px_10px_rgba(0,150,200,0.35)] ring-2 ring-white/70 backdrop-blur-lg transition-all duration-300 hover:scale-105"
        >
          جرب ماذا تنتظر ؟ اختر باقتك وابدا
          <span className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_12px_2px_rgba(255,255,255,0.6)] ring-1 ring-white/70" />
        </button>
      </div>
    </section>
  );
}
