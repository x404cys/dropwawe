'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Image from 'next/image';
import { CreditCard, Truck } from 'lucide-react';
import { Button } from '../ui/button';

export default function PaymentSection() {
  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: false });
  }, []);

  return (
    <section dir="rtl" className="bg-gray-50 px-5 py-20 md:px-20">
      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-16 md:flex-row">
        <div data-aos="fade-up" className="flex-1 space-y-8">
          <div>
            <h2 className="mb-4 text-4xl font-bold text-gray-900">عمليات دفع آمنة</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              نوفر لك خيارات دفع مرنة وآمنة تناسب عملاءك وتزيد من معدل إتمام الطلبات.
            </p>
          </div>

          <div className="space-y-4">
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="flex items-start gap-4 rounded-xl bg-gray-50 p-0.5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-700">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-gray-900">الدفع عند الاستلام</h3>
                <p className="text-sm text-gray-700">
                  يتيح لعملائك الدفع عند استلام المنتج بكل ثقة وراحة.
                </p>
              </div>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="flex items-start gap-4 rounded-xl bg-gray-50 p-0.5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-700">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-gray-900">الدفع الإلكتروني</h3>
                <p className="text-sm text-gray-700">
                  دفع إلكتروني آمن عبر البطاقات المصرفية وبوابات الدفع المعتمدة.
                </p>
              </div>
            </div>
            <div className="flex justify-start mt-8">
              <Button className="rounded-2xl border-sky-600 bg-sky-700 px-10">جربها !</Button>
            </div>
          </div>
        </div>

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
      </div>
    </section>
  );
}
