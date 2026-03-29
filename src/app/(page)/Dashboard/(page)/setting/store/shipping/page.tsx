'use client';
import { useLanguage } from '../../../../context/LanguageContext';

import { useState } from 'react';
import {
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
import SettingsPageHeader from '../../_components/settings-page-header';
import SettingsSectionCard from '../../_components/settings-section-card';

function InfoRow({
  icon: Icon,
  label,
  value,
  hint,
  emptyText,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  emptyText: string;
}) {
  return (
    <div>
      <label className="text-muted-foreground mb-1 flex items-center gap-1 text-[11px]">
        <Icon className="h-3 w-3" /> {label}
      </label>
      <p className="bg-muted text-foreground min-h-[40px] rounded-lg px-3 py-2.5 text-sm">
        {value || <span className="text-muted-foreground">{emptyText}</span>}
      </p>
      {hint && <p className="text-muted-foreground mt-1 text-[11px]">{hint}</p>}
    </div>
  );
}

export default function ShippingSettingsPage() {
  const { t, dir, lang } = useLanguage();
  const pageT = t.dashboardPages.storeShipping;
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

  const handleSave = async () => {
    const result = await save();
    if (result.ok) {
      toast.success(t.profile?.savedDesc || 'تم حفظ التغييرات');
      setEditing(false);
    } else {
      toast.error(result.message || t.error || 'يرجى مراجعة الأخطاء');
    }
  };

  const headerAction = editing ? (
    <Button
      size="sm"
      onClick={handleSave}
      disabled={loading}
      className="bg-primary hover:bg-primary/90 h-8 gap-1.5 text-xs"
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
  );

  return (
    <section dir={dir} className="bg-background min-h-screen pb-28">
      <SettingsPageHeader title={t.store?.selfDelivery || 'معلومات الشحن'} action={headerAction} />

      <div className="mx-auto max-w-xl space-y-4 px-4 pt-4">
        {/* Status banner */}

        {/* Info alert */}
        <Alert className="border border-sky-200 bg-sky-50/80 text-sky-900 dark:border-sky-800 dark:bg-sky-950/30 dark:text-sky-200">
          <Info className="mt-0.5 h-4 w-4" />
          <AlertTitle>{editing ? pageT.saveAdviceTitle : pageT.infoTitle}</AlertTitle>
          <AlertDescription>
            {editing ? pageT.saveAdviceDescription : pageT.infoDescription}
          </AlertDescription>
        </Alert>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        ) : editing ? (
          <div className="space-y-4">
            <SettingsSectionCard>
              <ShippingSection
                phone={phone}
                shippingPrice={shippingPrice}
                fieldErrors={fieldErrors}
                onPhoneChange={setPhone}
                onShippingPriceChange={setShippingPrice}
              />
            </SettingsSectionCard>

            <SettingsSectionCard>
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <h3 className="text-foreground text-sm font-semibold">{pageT.quickTipsTitle}</h3>
              </div>
              <div className="text-muted-foreground space-y-2 text-xs">
                <p>{pageT.tipPhone}</p>
                <p>{pageT.tipFee}</p>
                <p>{pageT.tipUpdate}</p>
              </div>
            </SettingsSectionCard>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow
                icon={Phone}
                label={t.profile?.phone || 'رقم الهاتف'}
                value={phone}
                hint={pageT.phoneHint}
                emptyText={pageT.notAvailable}
              />
              <InfoRow
                icon={CircleDollarSign}
                label={t.more?.delivery || 'رسوم التوصيل'}
                value={shippingFeeText}
                hint={pageT.priceHint.replace('{currency}', t.currency || 'د.ع')}
                emptyText={pageT.notAvailable}
              />
            </div>

            <SettingsSectionCard>
              <div className="mb-2 flex items-center gap-2">
                <Truck className="text-muted-foreground h-4 w-4" />
                <h3 className="text-foreground text-sm font-semibold">{pageT.customerViewTitle}</h3>
              </div>
              <p className="text-muted-foreground text-xs leading-6">
                {pageT.customerViewDescription}
              </p>
            </SettingsSectionCard>
          </div>
        )}
      </div>
    </section>
  );
}
