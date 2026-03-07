'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Store,
  Globe,
  Target,
  Shield,
  Zap,
  RefreshCw,
  MessageCircle,
  Truck,
  FileText,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { fbEvent } from '@/app/(page)/Dashboard/utils/pixel';
import Image from 'next/image';

type ServerErrorDetail = { field: string; message: string };
type ServerErrorResponse = { error: string; details?: ServerErrorDetail[]; field?: string };

const STORE_CATEGORIES = [
  'ملابس وأزياء',
  'إلكترونيات',
  'منتجات رقمية',
  'مستحضرات تجميل',
  'أحذية وحقائب',
  'أثاث ومفروشات',
  'هدايا وتحف',
  'أخرى',
];

export default function StoreSetupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev;
          return prev + 5;
        });
      }, 150);
    } else {
      setProgress(100);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [storeCategory, setStoreCategory] = useState('');
  const [storeSlug, setStoreSlug] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingPrice, setShippingPrice] = useState('');

  useEffect(() => {
    fbEvent('ViewContent', { content_name: 'Create Store Page' });
  }, []);

  useEffect(() => {
    if (status === 'loading' || !session?.user?.id) return;
    const fetchInfo = async () => {
      try {
        const res = await axios.get(`/api/storev2/info4setting/${session?.user?.id}`);
        if (res.data) router.replace('/Dashboard');
      } catch {}
    };
    fetchInfo();
  }, [session?.user?.id, status, router]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!storeSlug.trim()) errors.subLink = 'رابط المتجر مطلوب';
    else if (storeSlug.length < 3) errors.subLink = 'الرابط يجب أن يكون 3 أحرف على الأقل';
    if (!storeName.trim()) errors.name = 'اسم المتجر مطلوب';
    if (!storeDescription.trim()) errors.description = 'الوصف مطلوب';
    else if (storeDescription.length < 10) errors.description = 'الوصف قصير جداً';
    const phoneRegex = /^(077|078|075)\d{8}$/;
    if (!phone.trim()) errors.phone = 'رقم الهاتف مطلوب';
    else if (!phoneRegex.test(phone)) errors.phone = 'يجب 11 رقم ويبدأ بـ 077 أو 078 أو 075';
    if (!shippingPrice.trim()) errors.shippingPrice = 'سعر التوصيل مطلوب';
    else {
      const price = Number(shippingPrice);
      if (isNaN(price)) errors.shippingPrice = 'يجب أن يكون رقم';
      else if (price < 1000) errors.shippingPrice = 'أقل سعر هو 1000 د.ع';
      else if (price % 500 !== 0) errors.shippingPrice = 'يجب أن يكون مضاريب 500 (مثال: 5000)';
    }

    if (!storeCategory) {
      errors.category = 'تصنيف المتجر مطلوب';
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error('يرجى تصحيح الأخطاء لإنشاء المتجر');
    }
    return Object.keys(errors).length === 0;
  };

  const handleComplete = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setFieldErrors({});

      const payload = {
        subLink: storeSlug,
        name: storeName,
        description: storeDescription,
        shippingPrice,
        phone,
        facebookLink: '',
        instaLink: '',
        telegram: '',
        shippingType: 'default',
        hasReturnPolicy: '__',
        active: true,
        category: storeCategory,
      };

      const minWaitPromise = new Promise(resolve => setTimeout(resolve, 6000));

      const apiPromise = fetch('/api/storev2/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const [res] = await Promise.all([apiPromise, minWaitPromise]);

      let data: ServerErrorResponse | undefined;
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        if (data?.details) {
          const errors: { [key: string]: string } = {};
          data.details.forEach(err => {
            errors[err.field] = err.message;
          });
          setFieldErrors(errors);
        } else if (data?.field) {
          setFieldErrors({ [data.field]: data.error });
        } else {
          toast.error(data?.error || 'حدث خطأ في الحفظ');
        }
        setLoading(false);
        return;
      }

      setProgress(100);
      toast.success('تم إنشاء المتجر بنجاح ✨');
      fbEvent('CompleteRegistration', { content_name: 'Store Created', store_name: storeName });

      setTimeout(() => {
        router.replace('/Dashboard');
      }, 700);
    } catch {
      toast.error('حدث خطأ في الحفظ');
      setLoading(false);
    }
  };

  return (
    <div className="bg-background flex min-h-screen flex-col md:flex-row" dir="rtl">
      {/* Full Screen Loading Overlay */}
      {loading && (
        <div className="bg-background/95 animate-in fade-in fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm duration-300">
          <div className="bg-card border-border/50 animate-in zoom-in-95 mx-4 flex w-full max-w-[320px] flex-col items-center rounded-[2rem] border p-6 text-center shadow-2xl duration-500 md:p-8">
            <div className="relative mb-6 flex h-20 w-20 items-center justify-center md:h-24 md:w-24">
              <div className="bg-primary/20 absolute inset-0 animate-ping rounded-full delay-75" />
              <div className="bg-primary/40 absolute inset-2 animate-pulse rounded-full" />
              <div className="bg-primary relative z-10 flex h-14 w-14 items-center justify-center rounded-full shadow-lg md:h-16 md:w-16">
                <Store className="text-primary-foreground h-6 w-6 md:h-8 md:w-8" />
              </div>
            </div>

            <h3 className="text-foreground mb-2 text-xl font-bold">جاري تأسيس متجرك...</h3>
            <p className="text-muted-foreground mb-6 text-[11px] leading-relaxed text-balance md:text-xs">
              نحن نقوم الآن بتهيئة التخزين وقاعدة البيانات الخاصة بك ليكون متجرك جاهزاً للعمل.
            </p>

            {/* Progress Bar container */}
            <div className="mb-6 w-full text-right">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-primary text-xs font-bold">{progress}%</span>
                <span className="text-muted-foreground text-[10px]">رجاءً لا تغلق الصفحة</span>
              </div>
              <div
                className="bg-secondary relative h-2 w-full overflow-hidden rounded-full"
                dir="ltr"
              >
                <div
                  className="bg-primary absolute top-0 left-0 h-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Stepper details */}
            <div className="w-full space-y-3 text-right md:space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-500 ${progress >= 30 ? 'bg-green-500/20' : 'bg-primary/20'}`}
                >
                  {progress >= 30 ? (
                    <Check className="animate-in zoom-in relative z-10 h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <RefreshCw className="text-primary h-3.5 w-3.5 animate-spin" />
                  )}
                </div>
                <span
                  className={`text-xs font-bold transition-colors duration-500 md:text-sm ${progress >= 30 ? 'text-foreground' : 'text-primary'}`}
                >
                  معالجة البيانات
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-500 ${progress >= 70 ? 'bg-green-500/20' : progress >= 30 ? 'bg-primary/20' : 'border-muted-foreground/30 border-2'}`}
                >
                  {progress >= 70 ? (
                    <Check className="animate-in zoom-in relative z-10 h-3.5 w-3.5 text-green-500" />
                  ) : progress >= 30 ? (
                    <RefreshCw className="text-primary h-3.5 w-3.5 animate-spin" />
                  ) : null}
                </div>
                <span
                  className={`text-xs transition-colors duration-500 md:text-sm ${progress >= 70 ? 'text-foreground font-bold' : progress >= 30 ? 'text-primary font-bold' : 'text-muted-foreground font-medium'}`}
                >
                  تأسيس المتجر
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-500 ${progress >= 95 ? 'bg-green-500/20' : 'border-muted-foreground/30 border-2'}`}
                >
                  {progress >= 100 ? (
                    <Check className="animate-in zoom-in relative z-10 h-3.5 w-3.5 text-green-500" />
                  ) : progress >= 95 ? (
                    <RefreshCw className="text-primary h-3.5 w-3.5 animate-spin" />
                  ) : null}
                </div>
                <span
                  className={`text-xs transition-colors duration-500 md:text-sm ${progress >= 100 ? 'text-foreground font-bold' : progress >= 95 ? 'text-primary font-bold' : 'text-muted-foreground font-medium'}`}
                >
                  إطلاق الواجهة
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Left side: branding/visuals */}
      <div className="bg-primary text-primary-foreground relative hidden flex-col justify-between overflow-hidden p-12 md:flex md:w-5/12 lg:w-1/2">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute top-0 right-0 h-full w-full opacity-10">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-12 -left-24 h-80 w-80 rounded-full bg-blue-300 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="mb-16 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white p-1.5 shadow-lg">
              <img
                src="/Logo-Matager/Matager-logo1.PNG"
                alt="متاجر"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-2xl font-black tracking-tight">متاجر</span>
          </div>

          <h1 className="mb-6 text-4xl leading-tight font-extrabold lg:text-5xl">
            أطلق متجرك الإلكتروني
            <br />
            في دقائق معدودة.
          </h1>
          <p className="text-primary-foreground/80 mb-12 max-w-md text-lg leading-relaxed">
            انضم إلى آلاف التجار الناجحين وابدأ ببيع منتجاتك الآن. كل ما تحتاجه لإدارة تجارتك، مدمج
            في منصة واحدة.
          </p>

          <div className="space-y-6">
            {[
              { icon: Zap, title: 'إعداد سريع', desc: 'ابدأ البيع فوراً، لا تحتاج لخبرة تقنية' },
              { icon: Shield, title: 'آمن وموثوق', desc: 'حماية كاملة لبياناتك وبيانات عملائك' },
              {
                icon: Target,
                title: 'أدوات تسويق متقدمة',
                desc: 'اربط متجرك وتابع حملاتك الإعلانية بسهولة',
              },
            ].map(feature => (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="mb-0.5 text-base font-bold text-white">{feature.title}</h3>
                  <p className="text-primary-foreground/70 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-primary-foreground/60 relative z-10 text-sm">
          © {new Date().getFullYear()} متاجر. جميع الحقوق محفوظة.
        </div>
      </div>

      <div className="bg-background flex flex-1 flex-col justify-center overflow-y-auto px-6 py-12 md:px-12 lg:px-24">
        <div className="mb-8 flex items-center gap-3 md:hidden">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl p-1">
            <img
              src="/Logo-Matager/Matager-logo1.PNG"
              alt="متاجر"
              className="h-full w-full object-contain"
            />
          </div>
          <span className="text-foreground text-xl font-bold">متاجر</span>
        </div>

        <div className="mx-auto w-full space-y-8">
          <div>
            <h2 className="text-foreground text-3xl font-extrabold tracking-tight">
              قم بإعداد متجرك
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              خطوة واحدة تفصلك عن إطلاق متجرك المتكامل.
            </p>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                  اسم المتجر *
                </label>
                <div className="relative">
                  <Store className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    value={storeName}
                    onChange={e => {
                      setStoreName(e.target.value);
                      if (!storeSlug) {
                        setStoreSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[^\w-]/g, '')
                        );
                      }
                    }}
                    placeholder="متجر الأناقة"
                    className={`bg-card border-border/80 focus:border-primary focus:ring-primary/20 h-11 rounded-xl pr-9 pl-3 text-sm focus:ring-1 ${fieldErrors.name ? 'border-destructive focus:border-destructive' : ''}`}
                  />
                </div>
                {fieldErrors.name && (
                  <p className="text-destructive mt-1 text-xs">{fieldErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                  رابط المتجر *
                </label>
                <div
                  className={`bg-card flex h-11 items-center overflow-hidden rounded-xl border transition-all ${fieldErrors.subLink ? 'border-destructive focus-within:ring-destructive/20 focus-within:ring-1' : 'border-border/80 focus-within:border-primary focus-within:ring-primary/20 focus-within:ring-1'}`}
                >
                  <span
                    className="text-muted-foreground bg-secondary/80 border-border/80 flex h-full items-center border-l px-2.5 text-[11px] font-medium whitespace-nowrap"
                    dir="ltr"
                  >
                    .matager.store
                  </span>
                  <input
                    value={storeSlug}
                    onChange={e =>
                      setStoreSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                    }
                    placeholder="mystore"
                    className="text-foreground placeholder:text-muted-foreground h-full w-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
                    dir="ltr"
                  />
                </div>
                {fieldErrors.subLink && (
                  <p className="text-destructive mt-1 text-xs">{fieldErrors.subLink}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-foreground block text-xs font-semibold">تصنيف المتجر *</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {STORE_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setStoreCategory(cat)}
                    className={`cursor-pointer rounded-lg border px-3 py-2 text-center text-xs font-medium whitespace-nowrap transition-all ${
                      storeCategory === cat
                        ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                        : 'border-border/60 bg-card text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {fieldErrors.category && (
                <p className="text-destructive mt-1 text-xs">{fieldErrors.category}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                  رقم الهاتف (واتساب) *
                </label>
                <div className="relative">
                  <MessageCircle className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="07XXXXXXXXX"
                    className={`bg-card border-border/80 focus:border-primary focus:ring-primary/20 h-11 rounded-xl pr-9 pl-3 text-sm focus:ring-1 ${fieldErrors.phone ? 'border-destructive focus:border-destructive' : ''}`}
                    dir="ltr"
                    type="tel"
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="text-destructive mt-1 text-xs">{fieldErrors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                  سعر التوصيل العادي (د.ع) *
                </label>
                <div className="relative">
                  <Truck className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    value={shippingPrice}
                    onChange={e => setShippingPrice(e.target.value)}
                    placeholder="5000"
                    className={`bg-card border-border/80 focus:border-primary focus:ring-primary/20 h-11 rounded-xl pr-9 pl-3 text-sm focus:ring-1 ${fieldErrors.shippingPrice ? 'border-destructive focus:border-destructive' : ''}`}
                    dir="ltr"
                    type="number"
                  />
                </div>
                {fieldErrors.shippingPrice && (
                  <p className="text-destructive mt-1 text-xs">{fieldErrors.shippingPrice}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                وصف المتجر *
              </label>
              <Textarea
                value={storeDescription}
                onChange={e => setStoreDescription(e.target.value)}
                placeholder="اكتب وصفاً جذاباً عن متجرك وما تقدمه لعملائك..."
                className={`bg-card border-border/80 focus:border-primary focus:ring-primary/20 min-h-[100px] resize-none rounded-xl p-4 text-sm focus:ring-1 ${fieldErrors.description ? 'border-destructive focus:border-destructive' : ''}`}
                maxLength={200}
              />
              <div className="mt-1 flex items-center justify-between">
                {fieldErrors.description ? (
                  <p className="text-destructive text-xs">{fieldErrors.description}</p>
                ) : (
                  <span />
                )}
                <p className="text-muted-foreground text-[10px] font-medium" dir="ltr">
                  {storeDescription.length}/200
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={handleComplete}
              disabled={loading}
              className="h-12 w-full rounded-xl text-sm font-bold shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  جاري تسجيل المتجر...
                </span>
              ) : (
                'إنشاء متجري الآن'
              )}
            </Button>
            <p className="text-muted-foreground mt-4 px-4 text-center text-[10px] leading-relaxed">
              من خلال إنشاء المتجر، أنت توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا. يمكنك
              ترقية باقتك و إضافة قنوات التواصل لاحقاً من الإعدادات.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
