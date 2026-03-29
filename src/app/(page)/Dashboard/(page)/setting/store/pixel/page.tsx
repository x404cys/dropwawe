'use client';

import { useState } from 'react';
import { Plus, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../../../../context/LanguageContext';
import SettingsPageHeader from '../../_components/settings-page-header';
import PixelSection from '../(page)/pixel-section/pixel-section';
import { useStoreSettings } from '../_hooks/useStoreSettings';

export default function PixelSettingsPage() {
  const { t, dir } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const {
    facebookPixel,
    setFacebookPixel,
    googlePixel,
    setGooglePixel,
    tiktokPixel,
    setTiktokPixel,
    snapPixel,
    setSnapPixel,
    loading,
    save,
  } = useStoreSettings();

  const handleSave = async () => {
    const result = await save();
    if (result.ok) {
      toast.success(t.profile.savedDesc);
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
        className="bg-background text-foreground hover:bg-muted h-8 gap-1.5 text-xs"
      >
        <Plus className="h-3.5 w-3.5" />
        {t.store.addPixel}
      </Button>
      <Button
        size="sm"
        onClick={handleSave}
        disabled={loading}
        className="bg-primary hover:bg-primary/90 h-8 gap-1.5 text-xs"
      >
        <Save className="h-3.5 w-3.5" />
        {loading ? t.loading : t.save}
      </Button>
    </div>
  );

  const activeCount = [facebookPixel, googlePixel, tiktokPixel, snapPixel]
    .filter(Boolean)
    .filter(pixel => pixel!.trim().length > 0).length;

  return (
    <section dir={dir} className="bg-background min-h-screen pb-28">
      <SettingsPageHeader
        title={t.store.pixelTracking}
        subtitle={`${activeCount} ${t.store.activePixels}`}
        action={headerAction}
      />

      <div className="mx-auto max-w-xl px-4 pt-4">
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
