'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Store, Globe, Target, Shield, Zap, RefreshCw, MessageCircle, Truck, FileText, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { fbEvent } from '@/app/(page)/Dashboard/utils/pixel';
import Image from 'next/image';

type ServerErrorDetail = { field: string; message: string };
type ServerErrorResponse = { error: string; details?: ServerErrorDetail[]; field?: string };

const STORE_CATEGORIES = [
  'ملابس وأزياء', 'إلكترونيات', 'منتجات رقمية', 'مستحضرات تجميل',
  'أحذية وحقائب', 'أثاث ومفروشات', 'هدايا وتحف', 'أخرى',
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
      try { data = await res.json(); } catch {}

      if (!res.ok) {
        if (data?.details) {
          const errors: { [key: string]: string } = {};
          data.details.forEach(err => { errors[err.field] = err.message; });
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
    <div className="min-h-screen bg-background  flex flex-col md:flex-row" dir="rtl">
      
      {/* Full Screen Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card p-6 md:p-8 rounded-[2rem] shadow-2xl flex flex-col items-center max-w-[320px] w-full mx-4 border border-border/50 text-center animate-in zoom-in-95 duration-500">
            <div className="relative w-20 h-20 md:w-24 md:h-24 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping delay-75" />
              <div className="absolute inset-2 bg-primary/40 rounded-full animate-pulse" />
              <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <Store className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-foreground mb-2">جاري تأسيس متجرك...</h3>
            <p className="text-[11px] md:text-xs text-muted-foreground mb-6 text-balance leading-relaxed">
              نحن نقوم الآن بتهيئة التخزين وقاعدة البيانات الخاصة بك ليكون متجرك جاهزاً للعمل.
            </p>
            
            {/* Progress Bar container */}
            <div className="w-full text-right mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-primary">{progress}%</span>
                <span className="text-[10px] text-muted-foreground">رجاءً لا تغلق الصفحة</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden relative" dir="ltr">
                <div 
                  className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>

            {/* Stepper details */}
            <div className="w-full space-y-3 md:space-y-4 text-right">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${progress >= 30 ? 'bg-green-500/20' : 'bg-primary/20'}`}>
                  {progress >= 30 ? <Check className="w-3.5 h-3.5 text-green-500 relative z-10 animate-in zoom-in" /> : <RefreshCw className="w-3.5 h-3.5 text-primary animate-spin" />}
                </div>
                <span className={`text-xs md:text-sm font-bold transition-colors duration-500 ${progress >= 30 ? 'text-foreground' : 'text-primary'}`}>معالجة البيانات</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${progress >= 70 ? 'bg-green-500/20' : progress >= 30 ? 'bg-primary/20' : 'border-2 border-muted-foreground/30'}`}>
                  {progress >= 70 ? <Check className="w-3.5 h-3.5 text-green-500 relative z-10 animate-in zoom-in" /> : progress >= 30 ? <RefreshCw className="w-3.5 h-3.5 text-primary animate-spin" /> : null}
                </div>
                <span className={`text-xs md:text-sm transition-colors duration-500 ${progress >= 70 ? 'font-bold text-foreground' : progress >= 30 ? 'font-bold text-primary' : 'font-medium text-muted-foreground'}`}>تأسيس المتجر</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${progress >= 95 ? 'bg-green-500/20' : 'border-2 border-muted-foreground/30'}`}>
                  {progress >= 100 ? <Check className="w-3.5 h-3.5 text-green-500 relative z-10 animate-in zoom-in" /> : progress >= 95 ? <RefreshCw className="w-3.5 h-3.5 text-primary animate-spin" /> : null}
                </div>
                <span className={`text-xs md:text-sm transition-colors duration-500 ${progress >= 100 ? 'font-bold text-foreground' : progress >= 95 ? 'font-bold text-primary' : 'font-medium text-muted-foreground'}`}>إطلاق الواجهة</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Left side: branding/visuals */}
      <div className="hidden md:flex md:w-5/12 lg:w-1/2 bg-primary flex-col justify-between p-12 text-primary-foreground relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-12 -left-24 w-80 h-80 bg-blue-300 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-lg">
              <img src="/Logo-Matager/Matager-logo1.PNG" alt="متاجر" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-black tracking-tight">متاجر</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
            أطلق متجرك الإلكتروني<br />في دقائق معدودة.
          </h1>
          <p className="text-primary-foreground/80 text-lg leading-relaxed mb-12 max-w-md">
            انضم إلى آلاف التجار الناجحين وابدأ ببيع منتجاتك الآن. كل ما تحتاجه لإدارة تجارتك، مدمج في منصة واحدة.
          </p>

          <div className="space-y-6">
            {[
              { icon: Zap, title: 'إعداد سريع', desc: 'ابدأ البيع فوراً، لا تحتاج لخبرة تقنية' },
              { icon: Shield, title: 'آمن وموثوق', desc: 'حماية كاملة لبياناتك وبيانات عملائك' },
              { icon: Target, title: 'أدوات تسويق متقدمة', desc: 'اربط متجرك وتابع حملاتك الإعلانية بسهولة' },
            ].map(feature => (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="w-10  h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/20">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-0.5">{feature.title}</h3>
                  <p className="text-sm text-primary-foreground/70">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-sm text-primary-foreground/60">
          © {new Date().getFullYear()} ماتاجر. جميع الحقوق محفوظة.
        </div>
      </div>

       <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-12 lg:px-24 overflow-y-auto bg-background">
        
         <div className="md:hidden flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center p-1">
            <img src="/Logo-Matager/Matager-logo1.PNG" alt="متاجر" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-bold text-foreground">متاجر</span>
        </div>

        <div className=" w-full mx-auto space-y-8">
          
          <div>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">قم بإعداد متجرك</h2>
            <p className="text-sm text-muted-foreground mt-2">خطوة واحدة تفصلك عن إطلاق متجرك المتكامل.</p>
          </div>

          <div className="space-y-5">
            
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  اسم المتجر *
                </label>
                <div className="relative">
                  <Store className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={storeName}
                    onChange={e => {
                      setStoreName(e.target.value);
                      if (!storeSlug) {
                        setStoreSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''));
                      }
                    }}
                    placeholder="متجر الأناقة"
                    className={`h-11 pl-3 pr-9 text-sm rounded-xl bg-card border-border/80 focus:border-primary focus:ring-1 focus:ring-primary/20 ${fieldErrors.name ? 'border-destructive focus:border-destructive' : ''}`}
                  />
                </div>
                {fieldErrors.name && <p className="text-xs text-destructive mt-1">{fieldErrors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  رابط المتجر *
                </label>
                <div className={`flex items-center overflow-hidden h-11 border rounded-xl bg-card transition-all ${fieldErrors.subLink ? 'border-destructive focus-within:ring-1 focus-within:ring-destructive/20' : 'border-border/80 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20'}`}>
                  <span className="text-[11px] font-medium text-muted-foreground bg-secondary/80 px-2.5 h-full flex items-center border-l border-border/80 whitespace-nowrap" dir="ltr">
                    .matager.store
                  </span>
                  <input
                    value={storeSlug}
                    onChange={e => setStoreSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="mystore"
                    className="flex-1 w-full h-full px-3 text-sm bg-transparent text-foreground placeholder:text-muted-foreground outline-none min-w-0"
                    dir="ltr"
                  />
                </div>
                {fieldErrors.subLink && <p className="text-xs text-destructive mt-1">{fieldErrors.subLink}</p>}
              </div>
            </div>

             <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground block">تصنيف المتجر *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STORE_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setStoreCategory(cat)}
                    className={`px-3 cursor-pointer py-2 text-xs font-medium rounded-lg transition-all border text-center whitespace-nowrap ${
                      storeCategory === cat
                        ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                        : 'border-border/60 bg-card text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {fieldErrors.category && <p className="text-xs text-destructive mt-1">{fieldErrors.category}</p>}
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  رقم الهاتف (واتساب) *
                </label>
                <div className="relative">
                  <MessageCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="07XXXXXXXXX"
                    className={`h-11 pl-3 pr-9 text-sm rounded-xl bg-card border-border/80 focus:border-primary focus:ring-1 focus:ring-primary/20 ${fieldErrors.phone ? 'border-destructive focus:border-destructive' : ''}`}
                    dir="ltr"
                    type="tel"
                  />
                </div>
                {fieldErrors.phone && <p className="text-xs text-destructive mt-1">{fieldErrors.phone}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  سعر التوصيل العادي (د.ع) *
                </label>
                <div className="relative">
                  <Truck className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={shippingPrice}
                    onChange={e => setShippingPrice(e.target.value)}
                    placeholder="5000"
                    className={`h-11 pl-3 pr-9 text-sm rounded-xl bg-card border-border/80 focus:border-primary focus:ring-1 focus:ring-primary/20 ${fieldErrors.shippingPrice ? 'border-destructive focus:border-destructive' : ''}`}
                    dir="ltr"
                    type="number"
                  />
                </div>
                {fieldErrors.shippingPrice && <p className="text-xs text-destructive mt-1">{fieldErrors.shippingPrice}</p>}
              </div>
            </div>

             <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                 وصف المتجر *
              </label>
              <Textarea
                value={storeDescription}
                onChange={e => setStoreDescription(e.target.value)}
                placeholder="اكتب وصفاً جذاباً عن متجرك وما تقدمه لعملائك..."
                className={`min-h-[100px] resize-none text-sm p-4 rounded-xl bg-card border-border/80 focus:border-primary focus:ring-1 focus:ring-primary/20 ${fieldErrors.description ? 'border-destructive focus:border-destructive' : ''}`}
                maxLength={200}
              />
              <div className="flex justify-between items-center mt-1">
                {fieldErrors.description
                  ? <p className="text-xs text-destructive">{fieldErrors.description}</p>
                  : <span />
                }
                <p className="text-[10px] text-muted-foreground font-medium" dir="ltr">{storeDescription.length}/200</p>
              </div>
            </div>
            
          </div>

          <div className="pt-2">
            <Button
              onClick={handleComplete}
              disabled={loading}
              className="w-full h-12 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  جاري تسجيل المتجر...
                </span>
              ) : (
                'إنشاء متجري الآن'
              )}
            </Button>
            <p className="text-center text-[10px] text-muted-foreground mt-4 leading-relaxed px-4">
              من خلال إنشاء المتجر، أنت توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا.
              يمكنك ترقية باقتك و إضافة قنوات التواصل لاحقاً من الإعدادات.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
