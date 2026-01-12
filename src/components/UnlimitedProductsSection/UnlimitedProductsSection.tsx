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
            src="/whole.png"
            alt="Unlimited Products"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="rounded-xl object-cover shadow"
          />
        </div>

        <div data-aos="fade-up" className="flex-1 space-y-8">
          <div>
            <h2 className="mb-4 text-4xl leading-tight font-bold text-gray-900">
              منتجات غير محدودة
            </h2>
            حتى لو لم يكن لديك منتجات بعد, دروب ويف تزودك بمجموعة متنوعة من المنتجات بسعر الجملة
            جاهزة لرفعها على متجرك
          </div>

           
          <div className="mt-8 flex w-full justify-start py-3">
            <Button
              data-aos="fade-up"
              data-aos-delay="200"
              onClick={() => router.push('https://login.dropwave.cloud')}
              className="rounded-2xl border-sky-600 bg-sky-700 px-10 py-3"
            >
              لن تحتار !
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
