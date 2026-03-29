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
    <div className="border-border bg-card space-y-3 rounded-xl border p-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <div>
          <p className="text-foreground text-sm font-semibold">{title}</p>
          <p className="text-muted-foreground text-[11px]">{subtitle}</p>
        </div>
      </div>
      {children}
      {error && (
        <p className="text-destructive flex items-center gap-1 text-[11px]">
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
  const pageT = t.dashboardPages.storeShipping;

  const tips = [pageT.tipPhone, pageT.tipFee, pageT.tipUpdate];

  return (
    <div className="space-y-4">
      {/* Summary header */}
      <div className="bg-primary/5 border-primary/15 flex items-center gap-3 rounded-xl border p-3">
        <div className="bg-primary/10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl">
          <Truck className="text-primary h-4 w-4" />
        </div>
        <div>
          <p className="text-foreground text-sm font-semibold">
            {t.store?.selfDelivery || 'التوصيل الذاتي'}
          </p>
          <p className="text-muted-foreground text-[11px]">
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
        subtitle={pageT.phoneSubtitle}
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
        subtitle={pageT.priceSubtitle}
        error={fieldErrors.shippingPrice}
      >
        <div className="relative">
          <span className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[11px]">
            {t.currency || 'د.ع'}
          </span>
          <Input
            value={shippingPrice}
            onChange={e => onShippingPriceChange(e.target.value)}
            placeholder="5000"
            className="h-10 pl-10 text-sm"
            type="number"
            inputMode="numeric"
          />
        </div>
      </FieldCard>

      {/* Tips */}
      <div className="border-border bg-muted/40 space-y-2 rounded-xl border p-4">
        <p className="text-foreground text-xs font-semibold">{pageT.quickTipsTitle}</p>
        {tips.map(tip => (
          <div key={tip} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
            <p className="text-muted-foreground text-[11px] leading-relaxed">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
