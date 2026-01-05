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
  },
  {
    title: 'الاحترافية - تطوير المتاجر',
    price: 69000,
    popular: true,
    features: [
      'متجر إلكتروني احترافي',
      'عدد منتجات غير محدود',
      'عدد طلبات غير محدود',
      'ادارة الطلبات',
      'ادارة المخزون',
      'تحقق من هاتف العميل',
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
  },
  {
    title: 'الاحترافية - دروبشيبينغ',
    price: 69000,
    popular: true,
    features: [
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
  },
];

export default function PricingSection() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  return (
    <section id="PricingSection" dir="rtl" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-bold text-gray-900">باقات مرنة تناسب نمو متجرك</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            اختر الباقة المناسبة وابدأ بناء متجرك الإلكتروني باحترافية
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => (
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
