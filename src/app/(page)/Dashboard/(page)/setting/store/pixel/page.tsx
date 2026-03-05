'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Pencil, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import PixelSection from '../(page)/pixel-section/pixel-section';
import { useStoreSettings } from '../_hooks/useStoreSettings';
import { useLanguage } from '../../../../context/LanguageContext';

const PIXEL_FIELDS = [
  { key: 'facebookPixel' as const, label: 'Facebook Pixel' },
  { key: 'googlePixel' as const, label: 'Google Analytics' },
  { key: 'tiktokPixel' as const, label: 'TikTok Pixel' },
  { key: 'snapPixel' as const, label: 'Snap Pixel' },
];

export default function PixelSettingsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const {
    facebookPixel, setFacebookPixel, googlePixel, setGooglePixel,
    tiktokPixel, setTiktokPixel, snapPixel, setSnapPixel, loading, save,
  } = useStoreSettings();

  const pixelValues: Record<string, string | null> = { facebookPixel, googlePixel, tiktokPixel, snapPixel };

  const handleSave = async () => {
    const result = await save();
    if (result.ok) { 
      toast.success(t.profile?.savedDesc || 'تم حفظ التغييرات'); 
      setEditing(false); 
    } else {
      toast.error(result.message);
    }
  };

  return (
    <section dir="rtl" className="min-h-screen bg-muted pb-28">
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </button>
          <h1 className="text-base font-bold text-foreground">{t.store?.pixelTracking || 'البيكسل والتتبع الإعلاني'}</h1>
        </div>
        {editing ? (
          <Button size="sm" onClick={handleSave} disabled={loading}
            className="gap-1.5 h-8 text-xs bg-[#04BAF6] hover:bg-[#0288d1]">
            <Save className="h-3.5 w-3.5" />
            {loading ? (t.loading || 'جارٍ الحفظ...') : (t.save || 'حفظ')}
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="gap-1.5 h-8 text-xs">
            <Pencil className="h-3.5 w-3.5" /> {t.edit || 'تعديل'} 
          </Button>
        )}
      </div>

      <div className="px-4 pt-4 max-w-xl mx-auto">
        {editing ? (
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <PixelSection
              facebookPixel={facebookPixel} googlePixel={googlePixel}
              tiktokPixel={tiktokPixel} snapPixel={snapPixel}
              onFacebookPixelChange={setFacebookPixel} onGooglePixelChange={setGooglePixel}
              onTiktokPixelChange={setTiktokPixel} onSnapPixelChange={setSnapPixel}
            />
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm divide-y divide-border">
            {PIXEL_FIELDS.map(field => {
              const val = pixelValues[field.key];
              const hasValue = val && val.trim().length > 0;
              return (
                <div key={field.key} className="px-4 py-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-foreground">{field.label}</span>
                  {hasValue ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                      ✓ {t.store?.activePixel || 'مُفعّل'}
                    </span>
                  ) : (
                    <span className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
                      {t.store?.inactivePixel || 'غير مُفعّل'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
