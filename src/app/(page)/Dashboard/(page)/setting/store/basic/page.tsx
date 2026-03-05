'use client';
import { useLanguage } from '../../../../context/LanguageContext';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Pencil, Save, Store, FileText, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Loader from '@/components/Loader';
import BasicInfoSection from '../(page)/basic-info-section/basic-info-section';
import { useStoreSettings } from '../_hooks/useStoreSettings';

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div>
      <label className="text-muted-foreground mb-1 flex items-center gap-1 text-[11px]">
        <Icon className="h-3 w-3" /> {label}
      </label>
      <p className="text-foreground bg-muted min-h-[40px] rounded-xl px-3 py-2.5 text-sm">
        {value || <span className="text-muted-foreground">—</span>}
      </p>
    </div>
  );
}

export default function BasicSettingsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const {
    storeSlug,
    setStoreSlug,
    storeName,
    setStoreName,
    description,
    setDescription,
    fieldErrors,
    loading,
    isLoading,
    save,
  } = useStoreSettings();

  const handleSave = async () => {
    const result = await save();
    if (result.ok) {
      toast.success(t.profile?.savedDesc || 'تم حفظ التغييرات');
      setEditing(false);
    } else toast.error(result.message || t.error || 'يرجى مراجعة الأخطاء');
  };

  return (
    <section dir="rtl" className="min-h-screen pb-28">
      <div className="bg-card border-border sticky top-0 z-10 flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="hover:bg-muted rounded-lg p-1.5 transition-colors"
          >
            <ArrowRight className="text-muted-foreground h-5 w-5" />
          </button>
          <h1 className="text-foreground text-base font-bold">
            {t.store?.generalSettings || 'الإعدادات العامة'}
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
            <Pencil className="h-3.5 w-3.5" /> {t.edit}{' '}
          </Button>
        )}
      </div>

      <div className="mx-auto max-w-xl space-y-4 px-4 pt-4">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        ) : editing ? (
          /* ── Edit mode ── */
          <div className="bg-card border-border space-y-4 rounded-xl border p-4 shadow-sm">
            <BasicInfoSection
              storeSlug={storeSlug}
              storeName={storeName}
              description={description}
              fieldErrors={fieldErrors}
              onStoreSlugChange={setStoreSlug}
              onStoreNameChange={setStoreName}
              onDescriptionChange={setDescription}
            />
          </div>
        ) : (
          /* ── View mode ── */
          <div className="bg-card border-border space-y-4 rounded-xl border p-4 shadow-sm">
            <InfoRow
              icon={Link}
              label={t.profile?.domain || 'رابط المتجر'}
              value={storeSlug ? `${storeSlug}.drop-wave.com` : ''}
            />
            <InfoRow icon={Store} label={t.profile?.storeName || 'اسم المتجر'} value={storeName} />
            <InfoRow
              icon={FileText}
              label={t.profile?.storeDesc || 'وصف المتجر'}
              value={description}
            />
          </div>
        )}
      </div>
    </section>
  );
}
