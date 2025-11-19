'use client';
import { PricingCard } from '@/components/pricing-card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { subscribePlan } from '../../_utils/subscribePlan';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function Plans() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubscribe = async (type: string) => {
    setLoading(true);

    try {
      const result = await subscribePlan(type);

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
            ابدأ مجانًا وقم بالترقية عندما تحتاج إلى المزيد من الميزات
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3 lg:gap-8">
          <PricingCard
            name="الخطة المجانية"
            price="مجاني"
            period=""
            description="مثالية للبدء والتجربة"
            features={[
              'متجر إلكتروني واحد',
              'ثيم واحد',
              'إدارة مخزون أساسية',
              'منتجات محدودة',
              'دعم المجتمع',
            ]}
            buttonText="ابدأ مجانًا"
            buttonVariant="outline"
            planType="NORMAL"
            onClick={handleSubscribe}
          />

          <PricingCard
            name="باقة الانطلاق"
            price="30,000"
            period="د.ع/شهر"
            description="للمتاجر الناشئة والصغيرة"
            features={[
              'متجر إلكتروني',
              'ثيم واحد',
              'إدارة مخزون كاملة',
              'منتجات للدروبشيبنج',
              'بوابة دفع',
              'ربط مع شركة توصيل',
              'عدد طلبات غير محدود',
              'محتوى المنتجات',
            ]}
            buttonText="ابدأ الآن"
            buttonVariant="secondary"
            planType="MODREN"
            onClick={handleSubscribe}
          />

          <PricingCard
            name="الباقة الاحترافية"
            price="75,000"
            period="د.ع/شهر"
            description="للمتاجر الكبيرة والمحترفين"
            features={[
              'كل ميزات باقة الانطلاق',
              'متاجر متعددة',
              'ثيمات متعددة',
              'كوبونات وخصومات',
              'بدون عمولة',
              'ربط الطلبات الخاص بك',
              'إحصائيات متقدمة',
              'أولوية في الدعم الفني',
              'تقارير مفصلة',
            ]}
            buttonText="الترقية الآن"
            buttonVariant="default"
            recommended
            planType="PENDINGROFESSIONAL"
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
                    'إلغاء الاشتراك في التدريب افتراضيًا',
                    'تسجيل الدخول الموحد SAML SSO',
                    'وصول ذو أولوية لأداء أفضل وبدون طوابير',
                    'دعم عملاء مخصص',
                    'الوصول إلى واجهة برمجة التطبيقات',
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
