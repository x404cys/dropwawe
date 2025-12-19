'use client';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

interface Feature {
  text: string;
}

interface Plan {
  title: string;
  price: string;
  features: Feature[];
  popular?: boolean;
}

const plans: Plan[] = [
  {
    title: 'الأساسية - تطوير المتاجر',
    price: '499 IQD + 3.25%',
    features: [
      { text: 'متجر إلكتروني' },
      { text: 'عدد منتجات غير محدود' },
      { text: 'عدد طلبات غير محدود' },
      { text: 'ادارة الطلبات' },
      { text: 'ادارة المخزون' },
      { text: 'تحقق من هاتف العميل' },
      { text: 'ثيمات متجر عدد 1' },
      { text: 'محتوى خاص بمتجرك (رسوم إضافية)' },
      { text: 'ربط ميتا وتيك توك وسناب بكسل' },
      { text: 'صلاحية إدارة المتجر لشخص واحد' },
    ],
  },
  {
    title: 'الاحترافية - تطوير المتاجر',
    price: '749 IQD + 3.25%',
    features: [
      { text: 'متجر إلكتروني احترافي' },
      { text: 'عدد منتجات غير محدود' },
      { text: 'عدد طلبات غير محدود' },
      { text: 'ادارة الطلبات' },
      { text: 'ادارة المخزون' },
      { text: 'تحقق من هاتف العميل' },
      { text: 'إشعارات الواتساب للعميل' },
      { text: 'استشارة تسويقية' },
      { text: 'محتوى خاص بمتجرك عدد 2 (مجاني)' },
      { text: 'تفعيل كوبونات خصم' },
      { text: 'ربط ميتا وتيك توك وسناب بكسل' },
      { text: 'الربط مع شركات التوصيل' },
    ],
    popular: true,
  },
  {
    title: 'الأساسية - دروبشيبينغ',
    price: '199 IQD + 3.25%',
    features: [
      { text: 'متجر إلكتروني عدد 1' },
      { text: 'منتجات جاهزة للرفع عدد 5' },
      { text: 'محتوى جاهز للمنتجات' },
      { text: 'حد الطلبات 125 شهرياً' },
      { text: 'تحقق من هاتف العميل' },
      { text: 'إشعارات الواتساب للعميل' },
      { text: 'الربط مع شركات التوصيل' },
      { text: 'ثيمات متجر عدد 1' },
      { text: 'محتوى خاص بمتجرك (رسوم إضافية)' },
      { text: 'صلاحية إدارة المتجر لشخص واحد' },
    ],
  },
  {
    title: 'الاحترافية - دروبشيبينغ',
    price: '99 IQD + 2.75%',
    features: [
      { text: 'متجر إلكتروني عدد 2' },
      { text: 'عدد منتجات غير محدود' },
      { text: 'عدد طلبات غير محدود' },
      { text: 'تحقق من هاتف العميل' },
      { text: 'إشعارات الواتساب للعميل' },
      { text: 'محتوى خاص بمتجرك عدد 2 (مجاني)' },
      { text: 'خصومات ومكافآت' },
      { text: 'ربط ميتا وتيك توك وسناب بكسل' },
      { text: 'الربط مع شركات التوصيل' },
      { text: 'ثيمات متجر عدد 2' },
      { text: 'صلاحية إدارة المتجر 3 أشخاص' },
      { text: 'أولوية الدعم 24/7' },
    ],
    popular: true,
  },
];

export default function PricingSection() {
  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: false });
  }, []);

  return (
    <section dir="rtl" className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900">باقات تطوير المتاجر والدروبشيبينغ</h2>
          <p className="mt-4 text-gray-600">
            جاهز تبدأ رحلتك مع الشريك المثالي لتجارتك الإلكترونية؟ صممت الباقات لتناسب ميزانيتك
            وتسهل بدايتك مع تجربة مجانية لمدة 7 أيام.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className={`flex flex-col rounded-2xl border p-6 shadow-md sm:px-8 lg:p-10 ${
                plan.popular ? 'border-sky-700 bg-indigo-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="mb-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900">{plan.title}</h3>
                <p className="mt-2">
                  <strong className="text-3xl font-bold text-gray-900">{plan.price}</strong>
                </p>
              </div>

              <ul className="mb-6 flex-1 space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <CheckIcon className="h-5 w-5 flex-shrink-0 text-indigo-700" />
                    {feature.text}
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={`mt-auto block rounded-full px-6 py-3 text-center text-sm font-medium transition ${
                  plan.popular
                    ? 'bg-sky-700 text-white hover:bg-indigo-700'
                    : 'border border-sky-700 bg-white text-sky-700 hover:ring-1 hover:ring-sky-700'
                }`}
              >
                اختر الباقة
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
