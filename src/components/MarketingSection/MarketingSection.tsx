'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Image from 'next/image';
import { Megaphone, FileText, Star, CreditCard, BarChart2 } from 'lucide-react';
import { SiSocialblade } from 'react-icons/si';

const features = [
  {
    icon: Megaphone,
    text: 'محتوى جاهز للاستخدام لمنتجات دروب ويڤ',
    delay: 100,
  },
  {
    icon: FileText,
    text: 'محتوى خاص لمتجرك ومنتجاتك',
    delay: 200,
  },
  {
    icon: Star,
    text: 'استشارات تسويقية متخصصة',
    delay: 300,
  },
  {
    icon: CreditCard,
    text: 'كوبونات خصم مميزة لعملائك',
    delay: 400,
  },
  {
    icon: SiSocialblade,
    text: 'ربط كامل مع فيسبوك بكسل لتحسين اداء حملاتك الاعلانية',
    delay: 450,
  },
  {
    icon: BarChart2,
    text: 'تحليلات وتحسين مستمر من خلال لوحة تحكم ذكية',
    delay: 500,
  },
];

export default function SmartMarketingSection() {
  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: false });
  }, []);

  return (
    <section dir="rtl" className="bg-white px-5 py-20 md:px-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 md:flex-row">
        <div data-aos="fade-up" className="relative aspect-[16/10] w-full flex-1 md:aspect-[16/9]">
          <Image
            src="/img-landing-page/8-.png"
            alt="Smart Marketing"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="rounded-xl object-fill shadow"
          />
        </div>

        <div data-aos="fade-up" className="flex-1 space-y-8">
          <h2 className="text-4xl font-bold text-sky-900">سوّق بذكاء</h2>

          <div className="flex flex-col">
            {features.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={item.delay}
                  className="flex items-center gap-4 rounded-xl bg-gray-50 p-3 transition hover:bg-gray-100"
                >
                  <div className="relative cursor-pointer rounded-full bg-gradient-to-l from-sky-300/80 from-5% via-sky-200/80 via-60% to-sky-200/90 to-80% px-4 py-3 font-bold text-sky-900 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),_0_3px_10px_rgba(0,150,200,0.35)] ring-2 ring-white/70 backdrop-blur-lg transition-all duration-300 hover:scale-105">
                    <Icon className="h-5 w-5 text-sky-700" />
                  </div>

                  <h3 className="font-semibold text-sky-900">{item.text}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
//
