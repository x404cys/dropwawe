'use client';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Image from 'next/image';
import { Megaphone, FileText, Star, CreditCard, BarChart2 } from 'lucide-react';

export default function SmartMarketingSection() {
  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: false });
  }, []);

  return (
    <section dir="rtl" className="bg-white px-5 py-20 md:px-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 md:flex-row">
        {/* Image */}
        <div data-aos="fade-up" className="relative aspect-[16/10] w-full flex-1 md:aspect-[16/9]">
          <Image
            src="/Arabic Dashboard Cards Only.png"
            alt="Smart Marketing"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="rounded-xl object-fill shadow"
          />
        </div>

        {/* Text */}
        <div data-aos="fade-up" className="flex-1 space-y-8">
          <div>
            <h2 className="mb-4 text-4xl font-bold text-gray-900">سوّق بذكاء</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              احصل على محتوى جاهز وقابل للاستخدام، استشارات تسويقية، وربط كامل مع أدوات التحليل
              لتحسين أداء حملاتك الإعلانية.
            </p>
          </div>

          <div className="space-y-1">
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="flex items-start gap-4 rounded-xl bg-gray-50 p-0.5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-700">
                <Megaphone className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-gray-900">محتوى جاهز للاستخدام</h3>
                <p className="text-sm text-gray-700">
                  محتوى تسويقي مُصمم لمنتجات دروب ويف جاهز للرفع مباشرة على متجرك.
                </p>
              </div>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="flex items-start gap-4 rounded-xl bg-gray-50 p-0.5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-700">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-gray-900">محتوى خاص لمتجرك</h3>
                <p className="text-sm text-gray-700">
                  نصوص، صور، وتصاميم مخصصة لمنتجاتك لجذب عملائك بشكل أفضل.
                </p>
              </div>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="300"
              className="flex items-start gap-4 rounded-xl bg-gray-50 p-0.5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-700">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-gray-900">استشارات تسويقية متخصصة</h3>
                <p className="text-sm text-gray-700">
                  نصائح وخطط تسويقية لزيادة مبيعاتك وتحقيق أفضل النتائج.
                </p>
              </div>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="400"
              className="flex items-start gap-4 rounded-xl bg-gray-50 p-0.5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-700">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-gray-900">كوبونات خصم مميزة</h3>
                <p className="text-sm text-gray-700">
                  قدم عروضًا وحوافز لعملائك لزيادة معدل الشراء.
                </p>
              </div>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="500"
              className="flex items-start gap-4 rounded-xl bg-gray-50 p-0.5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-700">
                <BarChart2 className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-gray-900">تحليلات وتحسين مستمر</h3>
                <p className="text-sm text-gray-700">
                  لوحة تحكم ذكية لمتابعة الأداء وتحسين حملاتك الإعلانية بشكل مستمر.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
