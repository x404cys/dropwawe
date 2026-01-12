'use client';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Image from 'next/image';
import { Megaphone, FileText, Star, CreditCard, BarChart2 } from 'lucide-react';
import { SiSocialblade } from 'react-icons/si';

export default function SmartMarketingSection() {
  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: false });
  }, []);

  return (
    <section dir="rtl" className="bg-white px-5 py-20 md:px-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 md:flex-row">
        <div data-aos="fade-up" className="relative aspect-[16/10] w-full flex-1 md:aspect-[16/9]">
          <Image
            src="/Professional-Arabic-Dashboard-IQD.png"
            alt="Smart Marketing"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="rounded-xl object-fill shadow"
          />
        </div>

        <div data-aos="fade-up" className="flex-1 space-y-8">
          <div>
            <h2 className="mb-4 text-4xl font-bold text-gray-900">سوّق بذكاء</h2>
            
          </div>

          <div className="space-y-2">
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="flex items-center gap-4 rounded-xl bg-gray-50 p-0.5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky-700">
                <Megaphone className="h-5 w-5 text-white" />
              </div>
              <div className="">
                <h3 className="font-semibold text-gray-900">
                  محتوى جاهز للاستخدام لمنتجات دروب ويڤ
                </h3>
              </div>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="flex items-center gap-4 rounded-xl bg-gray-50 p-0.5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-700">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-gray-900">محتوى خاص لمتجرك ومنتجاتك</h3>
              </div>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="300"
              className="flex items-center gap-4 rounded-xl bg-gray-50 p-0.5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-700">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-gray-900">استشارات تسويقية متخصصة</h3>
              </div>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="400"
              className="flex items-center gap-4 rounded-xl bg-gray-50 p-0.5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-700">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-gray-900">كوبونات خصم مميزة لعملائك</h3>
              </div>
            </div>
            <div
              data-aos="fade-up"
              data-aos-delay="400"
              className="flex items-center gap-4 rounded-xl bg-gray-50 p-0.5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-700">
                <SiSocialblade className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-gray-900">
                  ربط كامل مع فيسبوك بكسل لتحسين اداء حملاتك الاعلانية
                </h3>
              </div>
            </div>
            <div
              data-aos="fade-up"
              data-aos-delay="500"
              className="flex items-center gap-4 rounded-xl bg-gray-50 p-0.5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-700">
                <BarChart2 className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-gray-900">
                  تحليلات وتحسين مستمر من خلال لوحة تحكم ذكية
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
