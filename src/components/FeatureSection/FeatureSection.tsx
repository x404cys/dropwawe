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
    <section dir="rtl" className="bg-white px-5 py-20 md:px-20">
      <h2 className="mb-4 text-center text-4xl font-bold text-gray-900">
        صُمّمت دروب ويف لتغطية كافة احتياجاتك <br /> في التجارة الالكترونية
      </h2>
      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-16 md:flex-row">
        <div data-aos="fade-up" className="flex-1 space-y-8">
          <h1 className="text-3xl">متجر الكتروني بدون خبرة برمجية</h1>
          <div>
            <p className="text-lg leading-relaxed text-gray-700">
              افتح متجرك الإلكتروني بدون أي تعقيدات تقنية بخطوات سهلة وسريعة متجرك جاهز للأستخدام
            </p>
          </div>

          <div className="mt-8 flex justify-start">
            <Button
              data-aos="fade-up"
              data-aos-delay="200"
              onClick={() => router.push('https://login.dropwave.cloud')}
              className="cursor-pointer rounded-2xl border-sky-600 bg-sky-700 px-10"
            >
              انشأ متجرك !
            </Button>
          </div>
        </div>
        <div className="relative flex aspect-[16/10] w-full flex-1 items-center justify-center overflow-hidden rounded-2xl shadow">
          <Image
            src="/image.png"
            alt="Secure Payment"
            fill
            priority
            sizes="(max-width: 770px) 100vw, 50vw"
            className="scale-105 rounded-xl object-contain object-center shadow transition-transform duration-300"
          />
        </div>
      </div>
    </section>
  );
}
