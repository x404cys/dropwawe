'use client';
import { useLanguage } from '../../../../context/LanguageContext';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Pencil, Save, Facebook, Instagram, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Loader from '@/components/Loader';
import SocialLinksSection from '../(page)/social-links-section/social-links-section';
import { useStoreSettings } from '../_hooks/useStoreSettings';

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
          className="bg-muted block truncate rounded-xl px-3 py-2.5 text-sm text-[#04BAF6] hover:underline"
          dir="ltr"
        >
          {value}
        </a>
      ) : (
        <p className="bg-muted text-muted-foreground rounded-xl px-3 py-2.5 text-sm">
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

  return (
    <section dir="rtl" className="min-h-screen">
      <div className="bg-card border-border sticky top-0 z-10 flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="hover:bg-muted rounded-lg p-1.5 transition-colors"
          >
            <ArrowRight className="text-muted-foreground h-5 w-5" />
          </button>
          <h1 className="text-foreground text-base font-bold">
            {t.store?.socialLinks || 'روابط التواصل'}
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
          <div className="bg-card border-border space-y-4 rounded-xl border p-4 shadow-sm">
            <SocialLinksSection
              facebookLink={facebookLink}
              instaLink={instaLink}
              telegram={telegram}
              fieldErrors={fieldErrors}
              onFacebookChange={setFacebook}
              onInstagramChange={setInstagram}
              onTelegramChange={setTelegram}
            />
          </div>
        ) : (
          <div className="bg-card border-border space-y-4 rounded-xl border p-4 shadow-sm">
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
          </div>
        )}
      </div>
    </section>
  );
}
