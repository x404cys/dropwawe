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
import { fbEvent } from '../../_utils/pixel';
import Image from 'next/image';
import { IoMoonOutline } from 'react-icons/io5';
export default function Plans() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  const handleSubscribe = async (type: string) => {
    setLoading(true);
    fbEvent('InitiateCheckout', {
      content_name: type,
    });
    try {
      const result = await subscribePlan(type);
      await update();
      if (result.redirect_url) {
        window.location.href = result.redirect_url;
        return;
      }
      fbEvent('Purchase', {
        content_name: type,
        currency: 'IQD',
        value: type.includes('pro') ? 69000 : 39000,
      });
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
      <div className="container mx-auto px-4 py-2 md:py-5">
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
        </div>

        <div className="mx-auto mb-16 max-w-3xl">
          <div className="relative overflow-hidden rounded-2xl border p-8 md:p-12">
            <Badge className="mb-4 bg-amber-300 text-lg text-white">
              <span>عرض رمضان</span>
              <IoMoonOutline size={28} className="h-16 w-16" />
            </Badge>
            <div className="absolute top-0 -left-3 flex text-3xl">
              <Image
                src={'/img-theme/IMG_8473-removebg-preview.png'}
                alt="al"
                width={100}
                height={200}
              />
            </div>
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <h2 className="mb-4 text-3xl font-bold">باقة رمضان الخاصة</h2>

                <p className="text-muted-foreground mb-6">
                  باقة مؤقتة بمميزات إضافية لمساعدتك على زيادة مبيعاتك خلال شهر رمضان.
                </p>

                <ul className="mb-6 space-y-3">
                  {[
                    ' متجر الكتروني بتصميم رمضاني ',
                    'عدد منتجات غير محدود',
                    'عدد طلبات غير محدود',
                    'ادارة الطلبات',
                    'ادارة المخزون',
                    'دعم تسويقي مكثف',
                    'تفعيل كوبونات خصم',
                    'ربط ميتا وتيك توك وسناب بكسل',
                    'الربط مع شركات التوصيل',
                    'ثيمات متحر عدد 2 ',
                    'صلاحية ادارة المتجر لـ 3 اشخاص',
                    'اولوية الدعم 24/7',
                  ].map(feature => (
                    <li key={feature} className="flex items-center gap-2">
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  disabled={loading}
                  onClick={() => handleSubscribe('ramadan-plan')}
                  className="text-lg"
                >
                  اشترك الآن
                </Button>
              </div>

              <div className="space-y-5 text-center md:text-left">
                <p className="text-muted-foreground">السعر الخاص</p>
                <span>
                  بدل <span className="pt-2 text-gray-600 line-through">69,000</span>
                </span>
                <h3 className="my-3 text-5xl font-bold">
                  39,000
                  <span className="text-lg font-normal"> د.ع</span>
                </h3>
                <p className="text-muted-foreground">لفترة محدودة خلال شهر رمضان فقط</p>
              </div>
            </div>
          </div>
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
            r="499 د.ع+ 3.25%
,  متاجر"
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

              'دعم تسويقي',

              'تفعيل كوبونات خصم',
              'ربط ميتا وتيك توك وسناب بكسل',
              'الربط مع شركات التوصيل',
              'ثيمات متحر عدد 2 ',
              'صلاحية ادارة المتجر لـ 3 اشخاص',
              'اولوية الدعم 24/7',
            ]}
            r="399 د.ع + 2.75%
,  متاجر"
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

              'الربط مع شركات التوصيل',
              'ثيمات متجر عدد 1',

              'صلاحية إدارة المتجر لشخص واحد',
            ]}
            r="199 د.ع+ 3.25%
,  متاجر"
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

              'خصومات ومكافآت',
              'ربط ميتا وتيك توك وسناب بكسل',
              'الربط مع شركات التوصيل',
              'ثيمات متجر عدد 2',
              'صلاحية إدارة المتجر 3 أشخاص',
              'أولوية الدعم 24/7',
            ]}
            r="99 د.ع+ 2.75%
,  متاجر"
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
