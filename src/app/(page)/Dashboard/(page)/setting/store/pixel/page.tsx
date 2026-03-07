'use client';

import { useState } from 'react';
import { Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import PixelSection from '../(page)/pixel-section/pixel-section';
import { useStoreSettings } from '../_hooks/useStoreSettings';
import { useLanguage } from '../../../../context/LanguageContext';
import SettingsPageHeader from '../../_components/settings-page-header';

export default function PixelSettingsPage() {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const {
    facebookPixel, setFacebookPixel, googlePixel, setGooglePixel,
    tiktokPixel, setTiktokPixel, snapPixel, setSnapPixel, loading, save,
  } = useStoreSettings();

  const handleSave = async () => {
    const result = await save();
    if (result.ok) {
      toast.success(t.profile?.savedDesc || 'تم حفظ التغييرات');
    } else {
      toast.error(result.message);
    }
  };

  const headerAction = (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setShowForm(!showForm)}
        className="h-8 gap-1.5 text-xs bg-background text-foreground hover:bg-muted"
      >
        <Plus className="h-3.5 w-3.5" />
        إضافة بيكسل
      </Button>
      <Button
        size="sm"
        onClick={handleSave}
        disabled={loading}
        className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90"
      >
        <Save className="h-3.5 w-3.5" />
        {loading ? t.loading || 'جارٍ الحفظ...' : t.save || 'حفظ'}
      </Button>
    </div>
  );

  const activeCount = [facebookPixel, googlePixel, tiktokPixel, snapPixel]
    .filter(Boolean)
    .filter(p => p!.trim().length > 0).length;

  return (
    <section dir="rtl" className="min-h-screen bg-background pb-28">
      <SettingsPageHeader
        title={t.store?.pixelTracking || 'البيكسل والتتبع الإعلاني'}
        subtitle={`${activeCount} بيكسل مفعل`}
        action={headerAction}
      />

      <div className="px-4 pt-4 max-w-xl mx-auto">
        <PixelSection
          facebookPixel={facebookPixel}
          googlePixel={googlePixel}
          tiktokPixel={tiktokPixel}
          snapPixel={snapPixel}
          onFacebookPixelChange={setFacebookPixel}
          onGooglePixelChange={setGooglePixel}
          onTiktokPixelChange={setTiktokPixel}
          onSnapPixelChange={setSnapPixel}
          showForm={showForm}
          setShowForm={setShowForm}
        />
      </div>
    </section>
  );
}
