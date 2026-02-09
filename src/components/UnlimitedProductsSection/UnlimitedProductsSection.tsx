'use client';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Image from 'next/image';
import { Package, Layers } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

export default function UnlimitedProductsSection() {
  const router = useRouter();

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: false });
  }, []);

  return (
    <section dir="rtl" className="bg-white px-5 py-20 md:px-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 md:flex-row">
        <div data-aos="fade-up" className="relative aspect-[16/10] w-full flex-1 md:aspect-[16/9]">
          <Image
            src="/img-landing-page/5 -.png"
            alt="Unlimited Products"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="rounded-xl object-cover shadow"
          />
        </div>

        <div data-aos="fade-up" className="flex-1 space-y-8">
          <div>
            <h2 className="mb-4 text-4xl leading-tight font-bold text-sky-900">
              منتجات غير محدودة
            </h2>
            <span className="font-medium text-sky-800">
              {' '}
              حتى لو لم يكن لديك منتجات بعد, متاجر تزودك بمجموعة متنوعة من المنتجات بسعر الجملة
              جاهزة لرفعها على متجرك
            </span>
          </div>

          <div className="mt-8 flex w-full justify-start py-3">
            <button
              onClick={() => router.push('https://login.matager.store')}
              className="relative cursor-pointer rounded-full bg-gradient-to-l from-sky-300/80 from-5% via-sky-200/80 via-60% to-sky-200/90 to-80% px-8 py-2 font-bold text-sky-900 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),_0_3px_10px_rgba(0,150,200,0.35)] ring-2 ring-white/70 backdrop-blur-lg transition-all duration-300 hover:scale-105"
            >
              تصفح المنتجات
              <span className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_12px_2px_rgba(255,255,255,0.6)] ring-1 ring-white/70" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
