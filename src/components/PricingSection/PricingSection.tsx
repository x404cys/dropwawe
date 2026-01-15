'use client';

import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Check, Sparkles } from 'lucide-react';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { signIn } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FaGoogle } from 'react-icons/fa';

interface Plan {
  title: string;
  price: number;
  features: string[];
  popular?: boolean;
  r?: string[];
}
const plans: Plan[] = [
  {
    title: 'الأساسية - تطوير المتاجر',
    price: 39000,
    features: [
      'متجر إلكتروني',
      'عدد منتجات غير محدود',
      'عدد طلبات غير محدود',
      'ادارة الطلبات',
      'ادارة المخزون',
      'تحقق من هاتف العميل',
      'ثيمات متجر عدد 1',
      'محتوى خاص بمتجرك (رسوم إضافية)',
      'ربط ميتا وتيك توك وسناب بكسل',
      'صلاحية إدارة المتجر لشخص واحد',
    ],
    r: ['499 IQD + 3.25%', 'لكل معاملة ناجحة', '499 دينار؟ تغطية كلف الرسائل و االشعارات'],
  },
  {
    title: 'الاحترافية - تطوير المتاجر',
    price: 69000,
    popular: true,
    features: [
      'كل مميزات الباقة الاساسية',
      'متجر إلكتروني احترافي',
      'إشعارات الواتساب للعميل',
      'استشارة تسويقية',
      'محتوى خاص بمتجرك عدد 2 (مجاني)',
      'تفعيل كوبونات خصم',
      'ربط ميتا وتيك توك وسناب بكسل',
      'الربط مع شركات التوصيل',
      'ثيمات متحر عدد 2 ',
      'صلاحية ادارة المتجر لـ 3 اشخاص',
      'اولوية الدعم 24/7',
    ],
    r: ['399 IQD + 2.75% , لكل معاملة ناجحة', '399 دينار؟ تغطية كلف الرسائل و االشعارات'],
  },
  {
    title: 'الأساسية - دروبشيبينغ',
    price: 39000,
    features: [
      'متجر إلكتروني عدد 1',
      'منتجات جاهزة للرفع عدد 5',
      'محتوى جاهز للمنتجات',
      'حد الطلبات 125 شهرياً',
      'تحقق من هاتف العميل',
      'إشعارات الواتساب للعميل',
      'الربط مع شركات التوصيل',
      'ثيمات متجر عدد 1',
      'محتوى خاص بمتجرك (رسوم إضافية)',
      'صلاحية إدارة المتجر لشخص واحد',
    ],
    r: ['199 IQD + 3.25% , لكل معاملة ناجحة', '199 دينار؟ تغطية كلف الرسائل و االشعارات'],
  },
  {
    title: 'الاحترافية - دروبشيبينغ',
    price: 69000,
    popular: true,
    features: [
      'كل مميزات الباقة الاساسية',
      'متجر إلكتروني عدد 2',
      'عدد منتجات غير محدود',
      'عدد طلبات غير محدود',
      'تحقق من هاتف العميل',
      'إشعارات الواتساب للعميل',
      'محتوى خاص بمتجرك عدد 2 (مجاني)',
      'خصومات ومكافآت',
      'ربط ميتا وتيك توك وسناب بكسل',
      'الربط مع شركات التوصيل',
      'ثيمات متجر عدد 2',
      'صلاحية إدارة المتجر 3 أشخاص',
      'أولوية الدعم 24/7',
    ],
    r: ['99 IQD + 2.75%  , لكل معاملة ناجحة', '99 دينار؟ تغطية كلف الرسائل و االشعارات'],
  },
];

export default function PricingSection() {
  type PlanFilter = 'all' | 'store' | 'dropship';

  const [filter, setFilter] = useState<PlanFilter>('all');

  const [open, setOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);
  const filteredPlans = plans.filter(plan => {
    if (filter === 'all') return true;
    if (filter === 'store') return plan.title.includes('المتاجر');
    if (filter === 'dropship') return plan.title.includes('دروبشيبينغ');
    return true;
  });

  return (
    <section id="PricingSection" dir="rtl" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-bold text-gray-900">باقات مرنة تناسب نمو متجرك</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            اختر الباقة المناسبة وابدأ بناء متجرك الإلكتروني باحترافية
          </p>
          <div className="mt-8 flex justify-center">
            <div className="flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
              <button
                onClick={() => setFilter('all')}
                className={cn(
                  'rounded-lg px-6 py-2 text-sm font-medium transition-all',
                  filter === 'all'
                    ? 'bg-sky-50 text-sky-500 shadow'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                الكل
              </button>
              <button
                onClick={() => setFilter('store')}
                className={cn(
                  'rounded-lg px-6 py-2 text-sm font-medium transition-all',
                  filter === 'store'
                    ? 'bg-sky-50 text-sky-500 shadow'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                متاجر
              </button>

              <button
                onClick={() => setFilter('dropship')}
                className={cn(
                  'rounded-lg px-6 py-2 text-sm font-medium transition-all',
                  filter === 'dropship'
                    ? 'bg-sky-50 text-sky-500 shadow'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                دروبشيبينغ
              </button>
            </div>
          </div>
        </div>

        <div
          className={cn(
            'grid gap-6 sm:grid-cols-2',
            filteredPlans.length === 2
              ? 'max-w-[100vh] justify-center lg:grid-cols-2'
              : 'lg:grid-cols-4'
          )}
        >
          {filteredPlans.map((plan, i) => (
            <div
              key={i}
              data-aos="fade-up"
              data-aos-delay={i * 80}
              className={cn(
                'relative flex flex-col rounded-2xl border bg-white p-8 transition-all duration-300',
                'hover:-translate-y-1 hover:border-sky-500 hover:duration-200',
                plan.popular ? 'border-sky-500 ring-1 ring-sky-500/20' : 'border-gray-200'
              )}
            >
              {plan.popular && (
                <span className="absolute -top-4 right-6 flex items-center gap-1 rounded-full bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white">
                  <Sparkles className="h-4 w-4" />
                  الأكثر شيوعاً
                </span>
              )}

              <h3 className="text-lg font-bold text-gray-900">{plan.title}</h3>

              <div className="mt-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">{formatIQD(plan.price)}</span>
              </div>

              <ul className="flex-1 space-y-3 text-sm text-gray-600">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-sky-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <p className="my-2 p-1"> رسوم المعاملات : </p>
              <ul className="flex-1 space-y-3 text-sm text-gray-600">
                {plan.r?.map(f => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-sky-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => setOpen(true)}
                className={cn(
                  'mt-8 w-full rounded-xl',
                  plan.popular ? 'bg-sky-600 hover:bg-sky-700' : 'bg-gray-900 hover:bg-gray-800'
                )}
              >
                اختر هذه الباقة
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl" className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>تسجيل الدخول</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">يجب تسجيل الدخول لإكمال اختيار الباقة</p>
          <DialogFooter className="mt-4 flex-col gap-2">
            <Button
              variant="outline"
              onClick={() => signIn('google', { callbackUrl: '/Dashboard/create-store' })}
              className="gap-2"
            >
              <FaGoogle />
              المتابعة مع Google
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
