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
            <p className="text-lg leading-relaxed text-gray-700">
              حتى لو لم يكن لديك منتجات بعد،{' '}
              <span className="font-semibold text-sky-700">دروب ويف</span> تزودك بمجموعة متنوعة من
              المنتجات بسعر الجملة، جاهزة للرفع على متجرك مباشرة.
            </p>
          </div>

          <div className="space-y-4">
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="flex items-start gap-4 rounded-xl bg-gray-50 p-0.5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-700">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-base font-semibold text-gray-900">منتجات جاهزة للبيع</h3>
                <p className="text-sm text-gray-700">
                  لا حاجة للتخزين أو البحث عن موردين، كل شيء متوفر داخل المنصة.
                </p>
              </div>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="flex items-start gap-4 rounded-xl bg-gray-50 p-0.5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-700">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-base font-semibold text-gray-900">تنوع كبير في الأصناف</h3>
                <p className="text-sm text-gray-700">
                  اختر من عدة فئات ومنتجات تناسب جمهورك وسوقك.
                </p>
              </div>
            </div>
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
