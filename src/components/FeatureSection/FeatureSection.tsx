'use client';
import { Package } from 'lucide-react';
import Image from 'next/image';

export default function FeatureSection() {
  return (
    <section dir="rtl" className="px-5 py-16 md:px-20">
      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-10 md:flex-row md:items-start">
        <div className="w-full text-right md:w-1/2">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
            صُمّمت دروب ويف لتغطية كافة احتياجاتك في التجارة الالكترونية
          </h2>
          <h3 className="mb-3 text-xl font-semibold text-gray-800 sm:text-lg md:text-xl">
            متجر الكتروني بدون خبرة برمجية
          </h3>
          <p className="text-base leading-relaxed text-gray-600 sm:text-sm md:text-base">
            افتح متجرك الإلكتروني بدون أي تعقيدات تقنية. <br />
            بخطوات سهلة وسريعة متجرك جاهز للأستخدام.
          </p>
        </div>

        <div className="relative h-64 w-full sm:h-72 md:h-96 md:w-1/2">
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1 rounded-full bg-sky-400 px-3 py-1.5 text-xs font-semibold text-white shadow-lg sm:text-sm">
            <span>ادارة المخزن والطلبات</span>
            <Package size={15} />
          </div>

          <div className="absolute bottom-4 left-4 z-10 rounded-full bg-sky-400 px-3 py-1.5 text-xs font-semibold text-white shadow-lg sm:text-sm">
            متجر الكتروني مع ثيمات
          </div>

          <Image
            src="/Untitled-1.png"
            alt="Feature Image"
            fill
            className="rounded-xl object-contain"
          />
        </div>
      </div>
    </section>
  );
}
