'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function PaymentSection() {
  const router = useRouter();

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: false });
  }, []);

  return (
    <section dir="rtl" className="bg-white px-5 py-20 md:px-20">
      <h2 className="mb-4 text-center text-4xl font-bold text-sky-400">
        صُمّمت متاجر لتغطية كافة احتياجاتك <br /> في التجارة الالكترونية
      </h2>
      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-14 md:flex-row">
        <div data-aos="fade-up" className="flex-1 space-y-3">
          <h1 className="text-3xl text-sky-900">متجر الكتروني بدون خبرة برمجية</h1>
          <div>
            <p className="text-lg leading-relaxed font-medium text-sky-800">
              افتح متجرك الإلكتروني بدون أي تعقيدات تقنية بخطوات سهلة وسريعة متجرك جاهز للأستخدام
            </p>
          </div>

          <div className="mt-8 flex justify-start">
            <button
              onClick={() => router.push('https://login.matager.store')}
              className="relative cursor-pointer rounded-full bg-gradient-to-l from-sky-300/80 from-5% via-sky-200/80 via-60% to-sky-200/90 to-80% px-8 py-2 font-bold text-sky-900 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),_0_3px_10px_rgba(0,150,200,0.35)] ring-2 ring-white/70 backdrop-blur-lg transition-all duration-300 hover:scale-105"
            >
              انشئ متجرك !
              <span className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_12px_2px_rgba(255,255,255,0.6)] ring-1 ring-white/70" />
            </button>
          </div>
        </div>
        <div className="relative flex aspect-[16/11] w-full flex-1 items-center justify-center overflow-hidden rounded-2xl shadow">
          <Image
            src="/img-landing-page/image.png"
            alt="Secure Payment"
            fill
            priority
            sizes="(max-width: 770px) 100vw, 50vw"
            className="scale rounded-xl object-contain object-center shadow transition-transform duration-300"
          />
        </div>
      </div>
    </section>
  );
}
