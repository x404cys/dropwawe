'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Package, Store, Zap } from 'lucide-react';
import Image from 'next/image';

export default function FeatureSection() {
  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: false });
  }, []);

  return (
    <section dir="rtl" className="px-5 py-20 md:px-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-14 md:flex-row md:items-center">
        <div data-aos="fade-up" className="w-full space-y-6 text-right md:w-1/2">
          <h2 className="text-3xl leading-snug font-bold text-gray-900 md:text-4xl">
            صُمّمت دروب ويف لتغطية كافة احتياجاتك في التجارة الإلكترونية
          </h2>

          <p className="text-lg font-semibold text-gray-800">متجر إلكتروني بدون خبرة برمجية</p>

          <p className="max-w-xl text-base leading-relaxed text-gray-600">
            افتح متجرك الإلكتروني بدون أي تعقيدات تقنية، بخطوات سهلة وسريعة متجرك جاهز للاستخدام.
          </p>

          <ul className="space-y-4 pt-4">
            <li
              data-aos="fade-up"
              data-aos-delay="100"
              className="flex items-center gap-3 text-gray-700"
            >
              <Store size={20} />
              <span>متجر إلكتروني مع ثيمات جاهزة</span>
            </li>

            <li
              data-aos="fade-up"
              data-aos-delay="200"
              className="flex items-center gap-3 text-gray-700"
            >
              <Package size={20} />
              <span>إدارة المخزن والطلبات بسهولة</span>
            </li>

            <li
              data-aos="fade-up"
              data-aos-delay="300"
              className="flex items-center gap-3 text-gray-700"
            >
              <Zap size={20} />
              <span>تشغيل سريع بدون إعدادات معقدة</span>
            </li>
          </ul>
        </div>

        <div data-aos="fade-up" className="relative h-64 w-full sm:h-80 md:h-[420px] md:w-1/2">
          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="absolute top-4 right-0 z-10 flex items-center gap-2 rounded-full border border-sky-300 bg-sky-700/80 px-4 py-0.5 text-sm font-medium text-white shadow-sm backdrop-blur md:top-6 md:right-6 md:py-2"
          >
            <Package size={16} />
            <span>إدارة المخزن والطلبات</span>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="absolute bottom-4 left-0 z-10 flex items-center gap-2 rounded-full border border-sky-300 bg-sky-700/80 px-4 py-0.5 text-sm font-medium text-white shadow-sm backdrop-blur md:bottom-6 md:left-6 md:py-2"
          >
            <Store size={16} />
            <span>متجر إلكتروني مع ثيمات</span>
          </div>

          <Image
            src="/Untitled-1.png"
            alt="Feature Image"
            fill
            className="rounded-xl object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}
