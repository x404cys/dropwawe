'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Image from 'next/image';
import { CreditCard, Truck } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

export default function PaymentSection() {
  const router = useRouter();

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: false });
  }, []);

  return (
    <section dir="rtl" className="bg-gray-50 px-5 py-20 md:px-20">
      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-16 md:flex-row">
        <div data-aos="fade-up" className="relative aspect-[16/10] w-full flex-1 md:aspect-[16/9]">
          <Image
            src="/img-landing-page/7.png"
            alt="Secure Payment"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="rounded-xl object-cover shadow"
          />
        </div>
        <div data-aos="fade-up" className="flex-1 space-y-3">
          <div>
            <h2 className="mb-4 text-4xl font-bold text-sky-900">مدفوعات آمنة وسريعة</h2>
            <p className="text-lg leading-relaxed font-medium text-sky-800">
              مكّن زبائنك من الدفع مباشرة عبر الموقع بكل سهولة، مع أعلى معايير الحماية وتشفير
              البيانات
            </p>
          </div>

          <div>
            <p className="text-lg leading-relaxed font-medium text-sky-800">
              استلم أموالك بسرعة، ووفّر تجربة شراء آمنة تزيد ثقة الزبون بمتجرك.
            </p>
          </div>
          <div className="mt-8 flex justify-start">
            <button
              onClick={() => router.push('https://login.matager.store')}
              className="relative cursor-pointer rounded-full bg-gradient-to-l from-sky-300/80 from-5% via-sky-200/80 via-60% to-sky-200/90 to-80% px-8 py-2 font-bold text-sky-900 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),_0_3px_10px_rgba(0,150,200,0.35)] ring-2 ring-white/70 backdrop-blur-lg transition-all duration-300 hover:scale-105"
            >
              جربها !
              <span className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_12px_2px_rgba(255,255,255,0.6)] ring-1 ring-white/70" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
