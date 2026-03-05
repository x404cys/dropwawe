'use client';
import { useLanguage } from '../../../../../context/LanguageContext';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Store, FileText } from 'lucide-react';
import { InfoAlert } from '../../_components/info-alert';

interface BasicInfoSectionProps {
  storeSlug: string;
  storeName: string;
  description: string;
  fieldErrors: { [key: string]: string };
  onStoreSlugChange: (value: string) => void;
  onStoreNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export default function BasicInfoSection({
  storeSlug,
  storeName,
  description,
  fieldErrors,
  onStoreSlugChange,
  onStoreNameChange,
  onDescriptionChange,
}: BasicInfoSectionProps) {
  const { t } = useLanguage();
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          {t.profile?.domain || 'رابط المتجر'} <span className="text-xs text-muted-foreground">{storeSlug}.drop-wave.com</span>
        </label>
        <div className="relative">
          <Input
            value={storeSlug}
            onChange={e => {
              const value = e.target.value.toLowerCase();
              if (/^[a-z0-9]*$/.test(value)) {
                onStoreSlugChange(value);
              }
            }}
            placeholder={`store1.drop-wave.com`}
          />
          <Store className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        </div>
        {fieldErrors.subLink && <p className="mt-1 text-xs text-red-500">{fieldErrors.subLink}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{t.profile.storeName}</label>
        <div className="relative">
          <Input
            value={storeName}
            onChange={e => onStoreNameChange(e.target.value)}
            placeholder={t.profile.storeName}
          />
          <Store className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        </div>
        {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{t.inventory.description}</label>
        <div className="relative">
          <Textarea
            value={description}
            onChange={e => onDescriptionChange(e.target.value)}
            placeholder={t.store?.storeDescPlaceholder || 'صف متجرك للعملاء...'}
          />
          <FileText className="absolute top-3 left-3 h-5 w-5 text-muted-foreground" />
        </div>
        {fieldErrors.description && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.description}</p>
        )}
      </div>

      <InfoAlert
        message={t.store?.domainChangeWarning || 'في حال تغييرك لرابط المتجر , سيتم حذف الزيارات لديك والبدء بزيارات جديدة'}
        submessage={t.store?.domainChangeSubwarning || 'اذا ردت ان تبقى الزيارات راسل الدعم'}
      />
    </>
  );
}
