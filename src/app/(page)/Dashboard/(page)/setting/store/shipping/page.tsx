'use client';
import { useLanguage } from '../../../../context/LanguageContext';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  CircleDollarSign,
  Info,
  Pencil,
  Phone,
  Save,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import Loader from '@/components/Loader';
import ShippingSection from '../(page)/shipping-section/shipping-section';
import { useStoreSettings } from '../_hooks/useStoreSettings';

function InfoRow({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="border-border/80 bg-background/70 rounded-xl border p-3">
      <label className="text-muted-foreground mb-1 flex items-center gap-1 text-[11px]">
        <Icon className="h-3 w-3" /> {label}
      </label>
      <p className="bg-muted/70 text-foreground min-h-[40px] rounded-lg px-3 py-2.5 text-sm">
        {value || <span className="text-muted-foreground">غير متوفر</span>}
      </p>
      {hint && <p className="text-muted-foreground mt-2 text-[11px]">{hint}</p>}
    </div>
  );
}

export default function ShippingSettingsPage() {
  const { t, dir, lang } = useLanguage();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const {
    phone,
    setPhone,
    shippingPrice,
    setShippingPrice,
    fieldErrors,
    loading,
    isLoading,
    save,
  } = useStoreSettings();

  const shippingAmount = Number(shippingPrice);
  const hasShippingFee = shippingPrice.trim().length > 0 && Number.isFinite(shippingAmount);
  const shippingFeeText = hasShippingFee
    ? `${shippingAmount.toLocaleString(lang === 'en' ? 'en-US' : 'ar-IQ')} ${t.currency || 'د.ع'}`
    : '';
  const isProfileComplete = Boolean(phone && hasShippingFee);

  const handleSave = async () => {
    const result = await save();
    if (result.ok) {
      toast.success(t.profile?.savedDesc || 'تم حفظ التغييرات');
      setEditing(false);
    } else {
      toast.error(result.message || t.error || 'يرجى مراجعة الأخطاء');
    }
  };

  return (
    <section dir={dir} className="min-h-screen pb-28">
      <div className="border-border bg-card sticky top-0 z-10 flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="hover:bg-muted rounded-lg p-1.5 transition-colors"
          >
            <ArrowRight className="text-muted-foreground h-5 w-5" />
          </button>
          <h1 className="text-foreground text-base font-bold">
            {t.store?.selfDelivery || 'معلومات الشحن'}
          </h1>
        </div>

        {editing ? (
          <Button
            size="sm"
            onClick={handleSave}
            disabled={loading}
            className="h-8 gap-1.5 bg-[#04BAF6] text-xs hover:bg-[#0288d1]"
          >
            <Save className="h-3.5 w-3.5" />
            {loading ? t.store?.saving || 'جارٍ الحفظ...' : t.save}
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditing(true)}
            className="h-8 gap-1.5 text-xs"
          >
            <Pencil className="h-3.5 w-3.5" /> {t.edit}
          </Button>
        )}
      </div>

      <div className="mx-auto max-w-2xl space-y-4 px-4 pt-4">
        <div className="border-border bg-card rounded-2xl border p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                <Truck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-foreground text-sm font-semibold">
                  {t.store?.selfDelivery || 'التوصيل الذاتي'}
                </h2>
                <p className="text-muted-foreground text-xs">
                  {t.store?.deliveryIntegrationDesc ||
                    'حدّث بيانات التواصل ورسوم الشحن لتظهر بوضوح للعميل أثناء إتمام الطلب.'}
                </p>
              </div>
            </div>

            <Badge variant={isProfileComplete ? 'success' : 'warning'} className="px-2.5 py-1">
              {isProfileComplete ? 'الإعداد مكتمل' : 'ينقصك إكمال البيانات'}
            </Badge>
          </div>
        </div>

        <Alert className="border border-sky-200 bg-sky-50/80 text-sky-900">
          <Info className="mt-0.5 h-4 w-4" />
          <AlertTitle>{editing ? 'نصيحة قبل الحفظ' : 'معلومة مهمة'}</AlertTitle>
          <AlertDescription>
            {editing
              ? 'تأكد من كتابة رقم هاتف صحيح وسعر شحن واضح لتقليل الأسئلة من العملاء بعد الطلب.'
              : 'هذه المعلومات تظهر للعميل عند الشراء، وكلما كانت واضحة زادت ثقة العميل بسرعة الطلب.'}
          </AlertDescription>
        </Alert>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        ) : editing ? (
          <div className="space-y-4">
            <div className="border-border bg-card rounded-2xl border p-4">
              <ShippingSection
                phone={phone}
                shippingPrice={shippingPrice}
                fieldErrors={fieldErrors}
                onPhoneChange={setPhone}
                onShippingPriceChange={setShippingPrice}
              />
            </div>

            <div className="border-border bg-card/70 rounded-2xl border border-dashed p-4">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <h3 className="text-foreground text-sm font-semibold">إرشادات سريعة</h3>
              </div>
              <div className="text-muted-foreground space-y-2 text-xs">
                <p>استخدم رقم هاتف نشط مع واتساب لتسهيل التواصل عند التوصيل.</p>
                <p>ضع رسوم الشحن الفعلية لتجنب إلغاء الطلبات بعد التأكيد.</p>
                <p>يمكنك تعديل هذه المعلومات في أي وقت وسيتم تحديثها فورًا.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow
                icon={Phone}
                label={t.profile?.phone || 'رقم الهاتف'}
                value={phone}
                hint="يستخدمه العميل أو المندوب للتواصل قبل التسليم."
              />
              <InfoRow
                icon={CircleDollarSign}
                label={t.more?.delivery || 'رسوم التوصيل'}
                value={shippingFeeText}
                hint={`العملة: ${t.currency || 'د.ع'}`}
              />
            </div>

            <div className="border-border bg-card rounded-2xl border p-4">
              <div className="mb-2 flex items-center gap-2">
                <Truck className="text-muted-foreground h-4 w-4" />
                <h3 className="text-foreground text-sm font-semibold">
                  كيف تظهر هذه المعلومات للعميل؟
                </h3>
              </div>
              <p className="text-muted-foreground text-xs leading-6">
                تظهر رسوم التوصيل في صفحة إتمام الطلب، بينما يظهر رقم الهاتف كوسيلة دعم وتنسيق عند
                الحاجة. وجود بيانات دقيقة يقلل التأخير ويرفع رضا العميل.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
