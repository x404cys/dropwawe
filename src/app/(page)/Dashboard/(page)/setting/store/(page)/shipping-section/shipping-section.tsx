'use client';
import { useLanguage } from '../../../../../context/LanguageContext';

import { Input } from '@/components/ui/input';
import { CircleDollarSign, Phone, Truck, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { ReactNode } from 'react';

interface ShippingSectionProps {
  phone: string;
  shippingPrice: string;
  fieldErrors: { [key: string]: string };
  onPhoneChange: (value: string) => void;
  onShippingPriceChange: (value: string) => void;
}

function FieldCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  error,
  children,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-[11px] text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
      {error && (
        <p className="text-[11px] text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}

export default function ShippingSection({
  phone,
  shippingPrice,
  fieldErrors,
  onPhoneChange,
  onShippingPriceChange,
}: ShippingSectionProps) {
  const { t } = useLanguage();

  const tips = [
    'استخدم رقم هاتف نشط مع واتساب لتسريع التواصل',
    'حدد رسوم الشحن الفعلية لتجنب إلغاء الطلبات',
    'يمكنك تعديل هذه البيانات في أي وقت',
  ];

  return (
    <div className="space-y-4">
      {/* Summary header */}
      <div className="flex items-center gap-3 rounded-xl bg-primary/5 border border-primary/15 p-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
          <Truck className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {t.store?.selfDelivery || 'التوصيل الذاتي'}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {t.store?.deliveryIntegrationDesc || 'أدخل بيانات الشحن لتظهر للعميل عند الطلب'}
          </p>
        </div>
      </div>

      {/* Phone field */}
      <FieldCard
        icon={Phone}
        iconBg="bg-sky-500/10"
        iconColor="text-sky-500"
        title={t.profile?.phone || 'رقم الهاتف'}
        subtitle="يتواصل عبره العميل أو المندوب قبل التسليم"
        error={fieldErrors.phone}
      >
        <Input
          value={phone}
          onChange={e => onPhoneChange(e.target.value)}
          placeholder="0770xxxxxxx"
          dir="ltr"
          className="h-10 text-sm"
        />
      </FieldCard>

      {/* Shipping price field */}
      <FieldCard
        icon={CircleDollarSign}
        iconBg="bg-emerald-500/10"
        iconColor="text-emerald-500"
        title={t.more?.delivery || 'رسوم التوصيل'}
        subtitle="السعر النهائي الذي يظهر للعميل في صفحة الطلب"
        error={fieldErrors.shippingPrice}
      >
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[11px] text-muted-foreground pointer-events-none">
            {t.currency || 'د.ع'}
          </span>
          <Input
            value={shippingPrice}
            onChange={e => onShippingPriceChange(e.target.value)}
            placeholder="5000"
            className="h-10 text-sm pl-10"
            type="number"
            inputMode="numeric"
          />
        </div>
      </FieldCard>

      {/* Tips */}
      <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2">
        <p className="text-xs font-semibold text-foreground">نصائح سريعة</p>
        {tips.map(tip => (
          <div key={tip} className="flex items-start gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
