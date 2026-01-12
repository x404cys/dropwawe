'use client';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Image from 'next/image';
import { Truck, Link2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

export default function DeliveryIntegrationSection() {
  const router = useRouter();
  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: false });
  }, []);

  return (
    <section dir="rtl" className="bg-white px-5 py-20 md:px-20">
      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-16 md:flex-row">
        <div data-aos="fade-up" className="flex-1 space-y-8">
          <div>
            <h2 className="mb-4 text-4xl font-bold text-gray-900">ربط مباشر مع شركات التوصيل</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              وفّر وقت اكثر وركّز على تطوير مشروعك بدلاً من كتابة الوصولات مجموعة كبيرة من شركات
              التوصيل في العراق في خدمة منتجاتك ومتجرك.
            </p>
          </div>

          <div className="space-y-4">
            <div className="mt-8 flex w-full justify-start py-3">
              <Button
                data-aos="fade-up"
                data-aos-delay="200"
                onClick={() => router.push('https://login.dropwave.cloud')}
                className="rounded-2xl border-sky-600 bg-sky-700 px-10 py-3"
              >
                نسهلها عليك
              </Button>
            </div>
          </div>
        </div>

        <div data-aos="fade-up" className="relative aspect-[16/10] w-full flex-1 md:aspect-[16/9]">
          <Image
            src="/TAWSSEL_Iraqi_Flag.png"
            alt="Delivery Integration"
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
