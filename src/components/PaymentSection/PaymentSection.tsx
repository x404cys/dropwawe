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
            src="/Citi Diamond Preferred Card Benefits_ Guide.jpg"
            alt="Secure Payment"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="rounded-xl object-cover shadow"
          />
        </div>
        <div data-aos="fade-up" className="flex-1 space-y-8">
          <div>
            <h2 className="mb-4 text-4xl font-bold text-gray-900">مدفوعات آمنة وسريعة</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              مكّن زبائنك من الدفع مباشرة عبر الموقع بكل سهولة، مع أعلى معايير الحماية وتشفير
              البيانات
            </p>
          </div>

          <div>
            <p className="text-lg leading-relaxed text-gray-700">
              استلم أموالك بسرعة، ووفّر تجربة شراء آمنة تزيد ثقة الزبون بمتجرك.
            </p>
          </div>
          <div className="mt-8 flex justify-start">
            <Button
              data-aos="fade-up"
              data-aos-delay="200"
              onClick={() => router.push('https://login.dropwave.cloud')}
              className="rounded-2xl border-sky-600 bg-sky-700 px-10"
            >
              جربها !
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
