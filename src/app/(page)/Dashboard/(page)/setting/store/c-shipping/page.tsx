'use client';

import { Save, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CShippingSection from '../(page)/c-shipping-section/c-shipping-section';
import { useStoreSettings } from '../_hooks/useStoreSettings';
import { useLanguage } from '../../../../context/LanguageContext';
import SettingsPageHeader from '../../_components/settings-page-header';
import SettingsSectionCard from '../../_components/settings-section-card';
import FeatureRestrictionNotice from '../_components/feature-restriction-notice';
import { useStoreFeatureAccess } from '../_lib/feature-access';

export default function CShippingSettingsPage() {
  const { t } = useLanguage();
  const access = useStoreFeatureAccess('cShipping');
  const { phone, setPhone, shippingPrice, setShippingPrice, fieldErrors, loading, save } = useStoreSettings();

  const handleSave = async () => {
    if (!access.allowed) return;
    const result = await save();
    if (result.ok) toast.success(t.profile?.savedDesc || 'تم حفظ التغييرات');
    else toast.error(result.message);
  };

  const headerAction = (
    <Button
      size="sm"
      onClick={handleSave}
      disabled={loading || !access.allowed}
      className="h-8 gap-1.5 text-xs"
    >
      {loading ? (
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          {t.loading || 'جارٍ الحفظ...'}
        </span>
      ) : (
        <>
          <Save className="h-3.5 w-3.5" />
          {t.save || 'حفظ'}
        </>
      )}
    </Button>
  );

  return (
    <section dir="rtl" className="min-h-screen pb-28">
      <SettingsPageHeader
        title={t.store?.deliveryCompanyIntegration || 'الربط مع شركة التوصيل'}
        action={headerAction}
      />
      <div className="px-4 pt-4 max-w-xl mx-auto space-y-4">
        {!access.allowed && (
          <FeatureRestrictionNotice
            title={access.lockedTitle}
            description={access.lockedDescription}
            hintLabel={access.subscriptionHint}
            ctaLabel={access.ctaLabel}
          />
        )}
        <SettingsSectionCard>
          <CShippingSection
            phone={phone}
            shippingPrice={shippingPrice}
            fieldErrors={fieldErrors}
            onPhoneChange={setPhone}
            onShippingPriceChange={setShippingPrice}
            readOnly={!access.allowed}
          />
        </SettingsSectionCard>
      </div>
    </section>
  );
}
