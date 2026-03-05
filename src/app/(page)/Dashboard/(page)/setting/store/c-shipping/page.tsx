'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CShippingSection from '../(page)/c-shipping-section/c-shipping-section';
import { useStoreSettings } from '../_hooks/useStoreSettings';
import { useLanguage } from '../../../../context/LanguageContext';

export default function CShippingSettingsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { phone, setPhone, shippingPrice, setShippingPrice, fieldErrors, loading, save } = useStoreSettings();

  const handleSave = async () => {
    const result = await save();
    if (result.ok) toast.success(t.profile?.savedDesc || 'تم حفظ التغييرات');
    else toast.error(result.message);
  };

  return (
    <section dir="rtl" className="min-h-screen bg-muted pb-28">
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </button>
          <h1 className="text-base font-bold text-foreground">{t.store?.deliveryCompanyIntegration || 'الربط مع شركة التوصيل'}</h1>
        </div>
        <Button size="sm" onClick={handleSave} disabled={loading} className="gap-1.5 h-8 text-xs bg-[#04BAF6] hover:bg-[#0288d1]">
          <Save className="h-3.5 w-3.5" />
          {loading ? (t.loading || 'جارٍ الحفظ...') : (t.save || 'حفظ')}
        </Button>
      </div>
      <div className="px-4 pt-4 max-w-xl mx-auto">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <CShippingSection
            phone={phone} shippingPrice={shippingPrice} fieldErrors={fieldErrors}
            onPhoneChange={setPhone} onShippingPriceChange={setShippingPrice}
          />
        </div>
      </div>
    </section>
  );
}
