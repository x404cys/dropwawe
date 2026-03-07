'use client';
import { useLanguage } from '../../../../context/LanguageContext';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Save, Facebook, Instagram, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Loader from '@/components/Loader';
import SocialLinksSection from '../(page)/social-links-section/social-links-section';
import { useStoreSettings } from '../_hooks/useStoreSettings';
import SettingsPageHeader from '../../_components/settings-page-header';
import SettingsSectionCard from '../../_components/settings-section-card';

function InfoRow({
  icon: Icon,
  label,
  value,
  color = 'text-muted-foreground',
  notAddedText,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color?: string;
  notAddedText: string;
}) {
  return (
    <div>
      <label className={`mb-1 flex items-center gap-1 text-[11px] ${color}`}>
        <Icon className="h-3 w-3" /> {label}
      </label>
      {value ? (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="bg-muted block truncate rounded-lg px-3 py-2.5 text-sm text-primary hover:underline"
          dir="ltr"
        >
          {value}
        </a>
      ) : (
        <p className="bg-muted text-muted-foreground rounded-lg px-3 py-2.5 text-sm">
          {notAddedText}
        </p>
      )}
    </div>
  );
}

export default function SocialSettingsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const {
    facebookLink,
    setFacebook,
    instaLink,
    setInstagram,
    telegram,
    setTelegram,
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

  const headerAction = editing ? (
    <Button
      size="sm"
      onClick={handleSave}
      disabled={loading}
      className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90"
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
    <section dir="rtl" className="min-h-screen bg-background pb-28">
      <SettingsPageHeader
        title={t.store?.socialLinks || 'روابط التواصل'}
        action={headerAction}
      />

      <div className="mx-auto max-w-xl space-y-4 px-4 pt-4">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        ) : editing ? (
          <SettingsSectionCard className="space-y-4">
            <SocialLinksSection
              facebookLink={facebookLink}
              instaLink={instaLink}
              telegram={telegram}
              fieldErrors={fieldErrors}
              onFacebookChange={setFacebook}
              onInstagramChange={setInstagram}
              onTelegramChange={setTelegram}
            />
          </SettingsSectionCard>
        ) : (
          <SettingsSectionCard className="space-y-4">
            <InfoRow
              icon={Facebook}
              label="Facebook"
              value={facebookLink}
              color="text-blue-500"
              notAddedText={t.store?.notAddedYet || 'لم يُضف بعد'}
            />
            <InfoRow
              icon={Instagram}
              label="Instagram"
              value={instaLink}
              color="text-pink-500"
              notAddedText={t.store?.notAddedYet || 'لم يُضف بعد'}
            />
            <InfoRow
              icon={Send}
              label="Telegram"
              value={telegram}
              color="text-sky-500"
              notAddedText={t.store?.notAddedYet || 'لم يُضف بعد'}
            />
          </SettingsSectionCard>
        )}
      </div>
    </section>
  );
}
