'use client';
import { useLanguage } from '../../../../context/LanguageContext';
import { useState } from 'react';
import { Pencil, Save, Store, FileText, Link, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Loader from '@/components/Loader';
import BasicInfoSection from '../(page)/basic-info-section/basic-info-section';
import { useStoreSettings } from '../_hooks/useStoreSettings';
import SettingsPageHeader from '../../_components/settings-page-header';
import SettingsSectionCard from '../../_components/settings-section-card';
import { motion, AnimatePresence } from 'framer-motion';

function ReadonlyRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-border/50 last:border-0">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
        <Icon className="w-3.5 h-3.5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
        <p className="text-sm text-foreground break-all leading-relaxed">
          {value || <span className="text-muted-foreground italic">—</span>}
        </p>
      </div>
    </div>
  );
}

export default function BasicSettingsPage() {
  const { t } = useLanguage();
  const [editing, setEditing] = useState(false);
  const {
    storeSlug,
    setStoreSlug,
    storeName,
    setStoreName,
    description,
    setDescription,
    imagePreview,
    setImagePreview,
    setImageFile,
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('حجم الصورة يجب أن يكون أقل من 2 ميجابايت');
        return;
      }
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const headerAction = editing ? (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setEditing(false)}
        disabled={loading}
        className="h-8 text-xs text-muted-foreground"
      >
        {t.cancel || 'إلغاء'}
      </Button>
      <Button
        size="sm"
        onClick={handleSave}
        disabled={loading}
        className="h-8 gap-1.5 text-xs"
      >
        {loading ? (
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {t.store?.saving || 'جارٍ الحفظ...'}
          </span>
        ) : (
          <>
            <Save className="h-3.5 w-3.5" />
            {t.save || 'حفظ'}
          </>
        )}
      </Button>
    </div>
  ) : (
    <Button
      size="sm"
      variant="outline"
      onClick={() => setEditing(true)}
      className="h-8 gap-1.5 text-xs"
    >
      <Pencil className="h-3.5 w-3.5" />
      {t.edit || 'تعديل'}
    </Button>
  );

  return (
    <section dir="rtl" className="min-h-screen pb-28">
      <SettingsPageHeader
        title={t.store?.generalSettings || 'الإعدادات العامة'}
        action={headerAction}
      />

      <div className="mx-auto max-w-xl px-4 pt-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {editing ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <SettingsSectionCard>
                  <div className="space-y-1 pb-4 mb-2 border-b border-border/50">
                    <p className="text-sm font-bold text-foreground">{t.store?.generalSettings || 'الإعدادات العامة'}</p>
                    <p className="text-xs text-muted-foreground">{t.store?.generalSettingsDesc || 'اسم المتجر ورابطه يظهران للعملاء في صفحة المتجر'}</p>
                  </div>
                  <BasicInfoSection
                    storeSlug={storeSlug}
                    storeName={storeName}
                    description={description}
                    imagePreview={imagePreview}
                    fieldErrors={fieldErrors}
                    onStoreSlugChange={setStoreSlug}
                    onStoreNameChange={setStoreName}
                    onDescriptionChange={setDescription}
                    onImageChange={handleImageChange}
                    onImageRemove={handleImageRemove}
                  />
                </SettingsSectionCard>
              </motion.div>
            ) : (
              <motion.div
                key="view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                <SettingsSectionCard>
                  {/* Store Profile Header */}
                  <div className="flex items-center gap-4 px-1 py-2 mb-2 border-b border-border/50">
                    <div className="h-16 w-16 overflow-hidden rounded-2xl border border-border bg-muted/30 flex-shrink-0">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Store Logo" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Store className="h-6 w-6 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{storeName || 'متجر جديد'}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5" dir="ltr">
                        {storeSlug ? `${storeSlug}.drop-wave.com` : 'لم يتم التحديد'}
                      </p>
                    </div>
                  </div>

                  <ReadonlyRow
                    icon={Link}
                    label={t.profile?.domain || 'رابط المتجر'}
                    value={storeSlug ? `${storeSlug}.drop-wave.com` : ''}
                  />
                  <ReadonlyRow
                    icon={Store}
                    label={t.profile?.storeName || 'اسم المتجر'}
                    value={storeName}
                  />
                  <ReadonlyRow
                    icon={FileText}
                    label={t.profile?.storeDesc || 'وصف المتجر'}
                    value={description}
                  />
                </SettingsSectionCard>

                {/* Quick edit hint */}
                <p className="text-center text-xs text-muted-foreground py-2">
                  اضغط زر <strong>تعديل</strong> لتغيير بيانات المتجر
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
