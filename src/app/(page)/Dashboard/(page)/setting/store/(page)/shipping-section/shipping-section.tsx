'use client';
import { useLanguage } from '../../../../../context/LanguageContext';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { CircleDollarSign, Info, Phone } from 'lucide-react';
import type { ReactNode } from 'react';

interface ShippingSectionProps {
  phone: string;
  shippingPrice: string;
  fieldErrors: { [key: string]: string };
  onPhoneChange: (value: string) => void;
  onShippingPriceChange: (value: string) => void;
}

function FieldWrapper({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="border-border/80 bg-background/70 rounded-xl border p-3">
      <p className="text-foreground text-sm font-semibold">{title}</p>
      <p className="text-muted-foreground mt-1 mb-3 text-xs">{subtitle}</p>
      {children}
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

  return (
    <div className="space-y-4">
      <div className="border-border bg-muted/40 rounded-xl border border-dashed p-3">
        <h3 className="text-foreground text-sm font-semibold">
          {t.store?.selfDelivery || 'التوصيل الذاتي'}
        </h3>
        <p className="text-muted-foreground mt-1 text-xs leading-6">
          أدخل بيانات الشحن الأساسية لتظهر للعميل أثناء إتمام الطلب، ويمكن تعديلها لاحقًا في أي وقت.
        </p>
      </div>

      <Alert className="border border-sky-200 bg-sky-50/80 text-sky-900">
        <Info className="mt-0.5 h-4 w-4" />
        <AlertTitle>تذكير سريع</AlertTitle>
        <AlertDescription>
          يُفضّل كتابة رقم هاتف متاح دائمًا وتحديد رسوم توصيل دقيقة لتقليل إلغاء الطلبات.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2">
        <FieldWrapper
          title={t.profile?.phone || 'رقم الهاتف'}
          subtitle="رقم يتواصل عبره العميل أو المندوب قبل التسليم"
        >
          <div className="relative">
            <Input
              value={phone}
              onChange={e => onPhoneChange(e.target.value)}
              placeholder="0770xxxxxxx"
            />
            <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          </div>
          {fieldErrors.phone && <p className="mt-2 text-xs text-red-500">{fieldErrors.phone}</p>}
        </FieldWrapper>

        <FieldWrapper
          title={t.more?.delivery || 'سعر التوصيل'}
          subtitle="ضع السعر النهائي الذي يظهر للعميل في صفحة الطلب"
        >
          <div className="relative">
            <Input
              value={shippingPrice}
              onChange={e => onShippingPriceChange(e.target.value)}
              placeholder={`5000 ${t.currency || 'د.ع'}`}
            />
            <CircleDollarSign className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          </div>
          {fieldErrors.shippingPrice && (
            <p className="mt-2 text-xs text-red-500">{fieldErrors.shippingPrice}</p>
          )}
        </FieldWrapper>
      </div>
    </div>
  );
}
