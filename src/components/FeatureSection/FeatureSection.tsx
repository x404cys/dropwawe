'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Code, Package, Store, Zap } from 'lucide-react';
import Image from 'next/image';

export default function FeatureSection() {
  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
  }, []);

  return (
    <section dir="rtl" className="px-6 py-16 md:px-16 md:py-24 lg:px-20">
      <h2 className="mb-12 text-right text-3xl leading-snug font-bold text-gray-900 md:mb-16 md:text-center md:text-5xl">
        صُمّمت دروب ويف لتغطية <br /> كافة احتياجاتك في التجارة الالكترونية{' '}
      </h2>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 md:flex-row md:gap-16">
        <div data-aos="fade-up" className="w-full text-right md:w-1/2">
          <ul className="space-y-6 text-lg font-medium md:text-xl">
            <li
              data-aos="fade-up"
              data-aos-delay="100"
              className="flex items-center gap-4 text-gray-700"
            >
              <Code size={28} className="flex-shrink-0 text-sky-600" />
              <span>متجر إلكتروني بدون خبرة برمجية</span>
            </li>
            <li
              data-aos="fade-up"
              data-aos-delay="100"
              className="flex items-center gap-4 text-gray-700"
            >
              <Store size={28} className="flex-shrink-0 text-sky-600" />
              <span>متجر إلكتروني مع ثيمات جاهزة</span>
            </li>

            <li
              data-aos="fade-up"
              data-aos-delay="200"
              className="flex items-center gap-4 text-gray-700"
            >
              <Package size={28} className="flex-shrink-0 text-sky-600" />
              <span>إدارة المخزن والطلبات بسهولة</span>
            </li>

            <li
              data-aos="fade-up"
              data-aos-delay="300"
              className="flex items-center gap-4 text-gray-700"
            >
              <Zap size={28} className="flex-shrink-0 text-sky-600" />
              <span>تشغيل سريع بدون إعدادات معقدة</span>
            </li>
          </ul>
        </div>

        <div data-aos="fade-up" className="relative h-72 w-full sm:h-96 md:h-[480px] md:w-1/2">
          <div className="absolute top-2 right-4 z-10 flex items-center gap-3 rounded-full border border-sky-300 bg-sky-700/80 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur md:top-8 md:right-8">
            <Package size={20} className="flex-shrink-0" />
            <span>إدارة المخزن والطلبات</span>
          </div>

          <div className="absolute bottom-2 left-4 z-10 flex items-center gap-3 rounded-full border border-sky-300 bg-sky-700/80 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur md:bottom-8 md:left-8">
            <Store size={20} className="flex-shrink-0" />
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
