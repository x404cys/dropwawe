'use client';

import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Check, Sparkles } from 'lucide-react';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
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
import { useRouter } from 'next/navigation';

interface Plan {
  title: string;
  price: number;
  features: string[];
  popular?: boolean;
  r?: string[];
  type: 'store' | 'dropship' | 'ramadan-plan';
}
const faqs = [
  {
    question: 'هل أحتاج كمبيوتر للعمل على  متاجر؟',
    answer:
      'تم تصميم النظام ليعمل بكفاءة عالية على شاشات الهواتف الذكية، ويمكنك استخدامه بسهولة وسرعة دون أي مشاكل، ومع ذلك فإن العمل على شاشات أكبر يوفر تجربة استخدام أكثر سلاسة ومرونة.',
    open: true,
  },
  {
    question: 'ما هي منتجات  متاجر؟',
    answer:
      'توفر  متاجر مجموعة كبيرة من المنتجات لتجار الدروبشيبينغ، ويمكنك الاطلاع على المنتجات بالكامل من خلال زر المخزون داخل المنصة.',
  },
  {
    question: 'أرغب بالاشتراك، لكن لا تتوفر لدي وسيلة دفع حالياً؟',
    answer:
      'يمكنك التواصل مع فريق خدمة العملاء عبر وسائل التواصل المتاحة أسفل الموقع الإلكتروني، وسيقوم الفريق بمساعدتك وتقديم الحلول المناسبة.',
  },
  {
    question: 'كم من الوقت أحتاج حتى أبدأ البيع؟',
    answer:
      'يمكنك البدء خلال فترة قصيرة جداً، حيث توفر لك  متاجر متجرًا جاهزًا ومنتجات ومحتوى تسويقي معد مسبقًا مما يسرّع عملية الإطلاق.',
  },
  {
    question: 'هل أحتاج إلى خبرة تقنية أو معرفة بالبرمجة؟',
    answer:
      'لا، لا تحتاج إلى أي خبرة تقنية. تم تصميم المنصة بواجهة سهلة وبسيطة تتيح لك إدارة متجرك بكل سلاسة حتى لو كانت تجربتك الأولى.',
  },
];
const plans: Plan[] = [
  {
    title: 'الأساسية - تطوير المتاجر',
    price: 39000,
    type: 'store',
    features: [
      'متجر إلكتروني',
      'عدد منتجات غير محدود',
      'عدد طلبات غير محدود',
      'إدارة الطلبات',
      'إدارة المخزون',
      'ثيم متجر واحد',
      'ربط ميتا وتيك توك وسناب بكسل',
      'صلاحية إدارة المتجر لشخص واحد',
    ],
    r: ['499 د.ع+ 3.25%', 'تغطية كلف بوابة الدفع الالكتروني'],
  },
  {
    title: 'الاحترافية - تطوير المتاجر',
    price: 69000,
    popular: true,
    type: 'store',
    features: [
      'كل مميزات الباقة الأساسية',
      'متجر احترافي',
      'إشعارات واتساب',
      'دعم تسويقي',
      'كوبونات خصم',
      'ربط ميتا وتيك توك وسناب بكسل',
      'ربط شركات التوصيل',
      'ثيمات متحر عدد 2',
      'صلاحية ادارة المتجر لـ 3 اشخاص',
      'اولوية الدعم 24/7',
    ],
    r: ['399 د.ع + 2.75%', 'تغطية كلف بوابة الدفع الالكتروني'],
  },
  {
    title: 'الباقة الرمضانية',
    price: 39000,
    popular: true,
    type: 'ramadan-plan',
    features: [
      'كل مميزات الباقة الاحترافية',
      'متجر الكتروني بتصميم رمضاني',
      'دعم تسويقي مكثف',
      'ربط شركات التوصيل',

      'ثيمات متجر عدد 2',
      'صلاحية إدارة المتجر 3 أشخاص',
      'أولوية الدعم 24/7',
    ],
    r: ['99 د.ع+ 2.75%', 'تغطية كلف بوابة الدفع الالكتروني'],
  },
  {
    title: 'الأساسية - دروبشيبينغ',
    price: 39000,
    type: 'dropship',
    features: [
      'متجر إلكتروني عدد 1 ',
      'منتجات جاهزة للرفع عدد 5',
      'محتوى جاهز للمنتجات',
      'حد الطلبات 125 شهرياً',

      'الربط مع شركات التوصيل',
      'ثيمات متجر عدد 1',
      'صلاحية إدارة المتجر لشخص واحد',
    ],
    r: ['199 د.ع+ 3.25%', 'تغطية كلف بوابة الدفع الالكتروني'],
  },
  {
    title: 'الاحترافية - دروبشيبينغ',
    price: 69000,
    popular: true,
    type: 'dropship',
    features: [
      'متجر إلكتروني عدد 2',
      'عدد منتجات غير محدود',
      'عدد طلبات غير محدود',

      'خصومات ومكافآت',
      'ربط ميتا وتيك توك وسناب بكسل',
      'الربط مع شركات التوصيل',
      'ثيمات متجر عدد 2',
      'صلاحية إدارة المتجر 3 أشخاص',
      'أولوية الدعم 24/7',
    ],
    r: ['99 د.ع+ 2.75%', 'تغطية كلف بوابة الدفع الالكتروني'],
  },
];

type PlanFilter = 'all' | 'store' | 'dropship';

export default function PricingSection() {
  const [filter, setFilter] = useState<PlanFilter>('all');
  const [open, setOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  const filteredPlans = filter === 'all' ? plans : plans.filter(p => p.type === filter);
  const useCountdown = (days: number) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
      const endDate =
        Number(localStorage.getItem('ramadanEnd')) || Date.now() + days * 24 * 60 * 60 * 1000;

      localStorage.setItem('ramadanEnd', String(endDate));

      const interval = setInterval(() => {
        setTimeLeft(endDate - Date.now());
      }, 1000);

      return () => clearInterval(interval);
    }, [days]);

    const d = Math.max(0, timeLeft);

    return {
      days: Math.floor(d / (1000 * 60 * 60 * 24)),
      hours: Math.floor((d / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((d / (1000 * 60)) % 60),
      seconds: Math.floor((d / 1000) % 60),
    };
  };
  const timer = useCountdown(35);

  return (
    <section
      id="PricingSection"
      dir="rtl"
      className="relative overflow-hidden bg-gradient-to-b from-cyan-400 via-sky-500 to-sky-600 py-20"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-white/10 blur-2xl" />
      </div>

      <div className="max-w-8xl relative z-10 mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-white md:text-4xl">
            باقات مرنة تناسب
            <br />
            نمو متجرك
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/90">
            اختر الباقة المناسبة وابدأ باحترافية
          </p>
        </div>

        <div className="mb-12 flex justify-center">
          <div className="relative flex gap-4 rounded-full bg-white/10 p-1 px-4 py-2 text-white ring-1 ring-white/30 transition hover:bg-white/20">
            {[
              { key: 'all', label: 'الكل' },
              { key: 'store', label: 'متاجر' },
              { key: 'dropship', label: 'دروبشيبينغ' },
              { key: 'ramadan-plan', label: 'رمضان' },
            ].map(b => (
              <button
                key={b.key}
                onClick={() => setFilter(b.key as PlanFilter)}
                className={cn(
                  'px-2',
                  filter === b.key
                    ? 'relative cursor-pointer gap-2 rounded-full bg-gradient-to-l from-sky-300/80 from-5% via-sky-200/80 via-60% to-sky-200/90 to-80% px-4 py-1 font-bold text-sky-900 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),_0_6px_20px_rgba(0,150,200,0.35)] ring-2 ring-white/70 backdrop-blur-lg transition-all duration-200 duration-300 hover:scale-105'
                    : 'cussptor-pointer px-4 py-1 text-sky-700 transition hover:rounded-full hover:bg-sky-100'
                )}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-14 pt-10 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
          {filteredPlans.map((plan, i) => (
            <div
              key={i}
              data-aos="fade-up"
              className={`relative flex h-full flex-col rounded-[28px] bg-sky-100/90 p-6 text-center shadow-xl backdrop-blur transition duration-700`}
            >
              {plan.type === 'ramadan-plan' && (
                <div className="absolute top-2 -left-3 flex text-3xl">
                  <Image
                    src={'/img-theme/IMG_8473-removebg-preview.png'}
                    alt="al"
                    width={100}
                    height={200}
                  />
                </div>
              )}

              <span className="absolute -top-10 left-1/2 mx-auto inline-flex h-16 w-[85%] max-w-[220px] -translate-x-1/2 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-3xl bg-gradient-to-l from-sky-300/80 from-5% via-sky-200/80 via-60% to-sky-200/90 to-80% py-2 text-center font-bold text-sky-900 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),_0_6px_20px_rgba(0,150,200,0.35)] ring-2 ring-white/70 backdrop-blur-lg transition-all duration-300 hover:scale-105">
                <span className="text-lg leading-tight">{plan.title}</span>
                <span className="font-extrabold">{formatIQD(plan.price)}</span>
              </span>

              <ul className="mt-4 flex-1 space-y-3 text-right text-sm text-sky-900">
                {plan.features.map(f => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-1 h-4 w-4 text-sky-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {plan.type === 'ramadan-plan' && (
                <div className="mt-12 flex gap-3 text-center text-xs md:mt-0 md:gap-3 md:px-0 md:pt-0">
                  {[
                    { label: 'يوم', value: timer.days },
                    { label: 'ساعة', value: timer.hours },
                    { label: 'دقيقة', value: timer.minutes },
                    { label: 'ثانية', value: timer.seconds },
                  ].map(t => (
                    <div
                      key={t.label}
                      className={`min-w-[10px] rounded-xl px-3 py-1 text-xs ${
                        t.label === 'ثانية'
                          ? 'bg-gradient-to-l from-sky-300/80 from-5% via-sky-200/80 via-60% to-sky-200/90 to-80%'
                          : 'bg-gradient-to-l from-sky-300/80 from-5% via-sky-200/80 via-60% to-sky-200/90 to-80%'
                      }`}
                    >
                      <div className="text-lg font-bold">{t.value}</div>
                      <div className="text-xs">{t.label}</div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-5 border-t border-sky-300/50 pt-4 text-right text-xs text-sky-900">
                <p className="mb-2 font-bold">رسوم المعاملات</p>
                {plan.r?.map(r => (
                  <div key={r} className="flex gap-2 font-normal">
                    <span>{r}</span>
                  </div>
                ))}
              </div>

              <div className="mt-2">
                <button
                  onClick={() => setOpen(true)}
                  className="relative cursor-pointer rounded-full bg-gradient-to-l from-sky-800/80 from-5% via-sky-800/80 via-60% to-sky-800/90 to-80% px-8 py-1.5 font-bold text-white shadow-[inset_0_0.5px_0.5px_rgba(255,255,255,0.8),_0_6px_20px_rgba(0,150,200,0.35)] ring-2 ring-white/70 backdrop-blur-lg transition-all duration-300 hover:scale-105"
                >
                  اختر هذه الباقة
                  <span className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_2px_1px_rgba(255,255,255,0.6)] ring-1 ring-white/70" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <section id="FAQ" dir="rtl" className="mt-10 px-5 pt-10 md:px-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-white">
            الأسئلة الأكثر شيوعًا
            <span className="block text-base font-bold text-gray-800">حول منصة متاجر</span>
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} open={faq.open} className="group backdrop-blur-lg">
                <summary className="flex cursor-pointer items-center justify-between gap-2 rounded-full bg-gradient-to-l from-sky-300/80 from-5% via-sky-200/80 via-60% to-sky-200/90 to-80% px-8 py-3 font-bold text-sky-900 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),_0_6px_20px_rgba(0,150,200,0.35)] [&::-webkit-details-marker]:hidden">
                  {' '}
                  <h3 className="text-sm text-gray-900 md:text-lg">{faq.question}</h3>
                  <svg
                    className="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>

                <p className="pt-4 leading-relaxed text-white">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl" className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>تسجيل الدخول</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">يجب تسجيل الدخول لإكمال اختيار الباقة</p>
          <DialogFooter className="mt-4 flex-col gap-2">
            <Button
              variant="outline"
              onClick={() => router.push('https://login.matager.store')}
              className="flex gap-2"
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
