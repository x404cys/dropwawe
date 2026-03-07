'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Store, FileText, Link } from 'lucide-react';
import { InfoAlert } from './info-alert';
import { useLanguage } from '@/app/(page)/Dashboard/context/LanguageContext';

interface BasicInfoSectionProps {
  storeSlug: string;
  storeName: string;
  description: string;
  fieldErrors: { [key: string]: string };
  onStoreSlugChange: (value: string) => void;
  onStoreNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function BasicInfoSection({
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
        <label className="text-foreground text-sm font-medium">
          رابط المتجر{' '}
          <span className="text-muted-foreground text-xs">{storeSlug}.matager.store</span>
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
            placeholder="store1.matager.store"
          />
          <Link className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
        </div>
        {fieldErrors.subLink && <p className="mt-1 text-xs text-red-500">{fieldErrors.subLink}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-foreground text-sm font-medium">{t.profile.storeName}</label>
        <div className="relative">
          <Input
            value={storeName}
            onChange={e => onStoreNameChange(e.target.value)}
            placeholder={t.profile.storeName}
          />
          <Store className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
        </div>
        {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-foreground text-sm font-medium">{t.inventory.description}</label>
        <div className="relative">
          <Textarea
            value={description}
            onChange={e => onDescriptionChange(e.target.value)}
            placeholder="صف متجرك للعملاء..."
          />
          <FileText className="text-muted-foreground absolute top-3 left-3 h-5 w-5" />
        </div>
        {fieldErrors.description && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.description}</p>
        )}
      </div>
    </>
  );
}
