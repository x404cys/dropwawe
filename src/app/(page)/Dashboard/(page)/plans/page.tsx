'use client';
import { PricingCard } from '@/components/pricing-card';
import { Badge } from '@/components/ui/badge';
import { Check, CornerLeftDown, Rocket } from 'lucide-react';
import { useState } from 'react';
import { subscribePlan } from '../../_utils/subscribePlan';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LuMousePointerClick } from 'react-icons/lu';

export default function Plans() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  const handleSubscribe = async (type: string) => {
    setLoading(true);

    try {
      const result = await subscribePlan(type);
      await update();
      if (result.redirect_url) {
        window.location.href = result.redirect_url;
        return;
      }

      toast.success(`تم الاشتراك بنجاح في خطة: ${type}`);
      router.replace('/Dashboard');
    } catch (err) {
      toast.error('حدث خطأ أثناء الاشتراك');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mb-16 text-center">
          <Badge
            variant="secondary"
            className="bg-accent/20 text-accent-foreground border-accent/30 mb-6"
          >
            جديد
          </Badge>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
            اختر الخطة المناسبة لك
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg text-balance">
            تمتع بتجربة مجانية لمدة 7 ايام لكل الميزات
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="max-w-md">
            <button
              onClick={async () => {
                try {
                  const res = await fetch(`/api/dashboard/give-free-trial`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                  });

                  const data = await res.json();

                  if (!res.ok) {
                    toast.error(data.message || 'حدث خطأ أثناء تفعيل الفترة التجريبية');
                    throw new Error(data.error || 'Failed to subscribe');
                  }
                  toast.success('تم تفعيل الفترة التجريبية المجانية بنجاح!');
                  router.replace('/Dashboard');
                  return data;
                } catch (error) {
                  console.error('Subscription error:', error);
                  throw error;
                }
              }}
              className="relative flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-l from-sky-300/80 from-5% via-sky-200/80 via-60% to-sky-200/90 to-80% px-8 py-2 font-bold text-sky-900 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),_0_6px_20px_rgba(0,150,200,0.35)] ring-2 ring-white/70 backdrop-blur-lg transition-all duration-300 hover:scale-105"
            >
              <span> جرب كل الميزات مجاناً لمدة 7 أيام</span>{' '}
              <LuMousePointerClick className="text-lg" />
              <span className="pointer-events-none absolute inset-0 rounded-lg shadow-[0_0_12px_2px_rgba(255,255,255,0.6)] ring-1 ring-white/70" />
            </button>
          </div>
        </div>
        <div className="mt-10 mb-5 text-center">
          <Badge variant={'success'} className="mt-4 mb-5 text-lg">
            <span className="font-normal"> او اختر باقتك وابدأ الان </span>{' '}
            <CornerLeftDown className="" />
          </Badge>
        </div>
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-4 lg:gap-8">
          <PricingCard
            name="الباقة الاساسية - للتجار"
            price="39,000"
            period=""
            description="مثالية للبدء والتجربة"
            features={[
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
            ]}
            buttonText="ابدأ "
            buttonVariant="outline"
            planType="trader-basic"
            onClick={handleSubscribe}
          />

          <PricingCard
            name="الباقة الاحترافية -للتجار"
            price="69,000"
            period="د.ع/شهر"
            description="للمتاجر الناشئة والكبيرة"
            features={[
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
            ]}
            buttonText="ابدأ الآن"
            buttonVariant="outline"
            recommended
            planType="trader-pro"
            onClick={handleSubscribe}
          />

          <PricingCard
            name="الاساسية - للدروب شيبر"
            price="39,000"
            period="د.ع/شهر"
            description="للدروب شيبر مثالية للبدء والتجربة"
            features={[
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
            ]}
            buttonText="الترقية الآن"
            buttonVariant="default"
            planType="drop-basics"
            onClick={handleSubscribe}
          />
          <PricingCard
            name="الاحترافية - للدروب شيبر"
            price="69,000"
            period="د.ع/شهر"
            description="للدروب شيبر , مثالية للمحترفين الانطلاق لخطوة اكبر"
            features={[
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
            ]}
            buttonText="الترقية الآن"
            buttonVariant="default"
            planType="drop-pro"
            onClick={handleSubscribe}
          />
        </div>

        <div className="mx-auto mt-12 max-w-7xl">
          <div className="border-border bg-card rounded-lg border p-8 md:p-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <h2 className="text-card-foreground mb-2 text-2xl font-bold">للمؤسسات</h2>
                <p className="text-muted-foreground mb-6">
                  للشركات الكبيرة التي تتطلب أمانًا إضافيًا.
                </p>
                <ul className="space-y-3">
                  {[
                    'تسجيل دخول موحد (SSO – SAML)',
                    'صلاحيات متقدمة حسب الأدوار',
                    'سجلات تدقيق وتقارير أمنية',
                    'تكامل API وربط الأنظمة الداخلية',
                    'أداء عالي بدون حدود استخدام',
                    'مدير حساب ودعم فني مخصص 24/7',
                  ].map(feature => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="text-accent mt-0.5 h-5 w-5 shrink-0" />
                      <span className="text-card-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:ml-8">
                <button className="border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 w-full rounded-lg border px-8 py-3 font-medium transition-colors md:w-auto">
                  تواصل معنا
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
