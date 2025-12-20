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
      image: '/freepik__the-style-is-candid-image-photography-with-natural__53505.png',
      title: 'لأصحاب المشاريع على السوشيال ميديا',
      description:
        'انتقل من البيع العشوائي إلى نظام متكامل بإدارة مخزون، طلبات، تحليلات، وتسويق ذكي.',
      badge: 'سوشيال ميديا',
      icon: <Cpu className="h-5 w-5 text-gray-700" />,
    },
    {
      image: '/Global E-commerce Logos Playful Arrangement.png',
      title: 'للدروب شيبرز',
      description:
        'ابدأ دروبشيبينغ بسهولة مع متجر إلكتروني جاهز، منتجات مختارة، ومحتوى تسويقي قابل للاستخدام.',
      badge: 'دروب شيب',
      icon: <Store className="h-5 w-5 text-gray-700" />,
    },
    {
      image: '/showing-cart-trolley-shopping-online-sign-graphic.jpg',
      title: 'لكل شخص مهتم بالتجارة الإلكترونية',
      description:
        'ابدأ من الصفر واحصل على متجر إلكتروني جاهز، منتجات مختارة بعناية، محتوى تسويقي قابل للاستخدام مباشرة، وربط كامل ببوابات الدفع وشركات التوصيل.',
      badge: 'مبتدئ',
      icon: <ShoppingCart className="h-5 w-5 text-gray-700" />,
    },
    {
      image: '/fast-fashion-concept-with-full-clothing-store.jpg',
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
            لمن هذه المنصة؟
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600 md:text-lg">
            سواء كنت صاحب مشروع على السوشيال ميديا، محل تقليدي، أو مبتدئ في التجارة الإلكترونية
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {sections.map((section, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="group overflow-hidden rounded-xl transition-all duration-300"
            >
              <div className="relative h-52 overflow-hidden md:h-60">
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
                  <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur-sm">
                    {section.icon}
                    <span className="text-sm font-medium text-gray-800">{section.badge}</span>
                  </div>
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
        <Button
          onClick={() => router.push('https://login.dropwave.cloud')}
          className="rounded-xl bg-sky-700 px-8 py-2 text-white"
        >
          شنو منتظر ؟ اختار باقتك وبلش
        </Button>
      </div>
    </section>
  );
}
