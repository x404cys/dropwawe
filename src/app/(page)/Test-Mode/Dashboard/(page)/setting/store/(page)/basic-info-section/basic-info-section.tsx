'use client';

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
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          رابط المتجر <span className="text-xs text-gray-400">{storeSlug}.dropwave.cloud</span>
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
            placeholder="store1.dropwave.cloud"
          />
          <Store className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>
        {fieldErrors.subLink && <p className="mt-1 text-xs text-red-500">{fieldErrors.subLink}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">اسم المتجر</label>
        <div className="relative">
          <Input
            value={storeName}
            onChange={e => onStoreNameChange(e.target.value)}
            placeholder="اسم المتجر"
          />
          <Store className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>
        {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">الوصف</label>
        <div className="relative">
          <Textarea
            value={description}
            onChange={e => onDescriptionChange(e.target.value)}
            placeholder="صف متجرك للعملاء..."
          />
          <FileText className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
        </div>
        {fieldErrors.description && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.description}</p>
        )}
      </div>

      <InfoAlert
        message="في حال تغييرك لرابط المتجر , سيتم حذف الزيارات لديك والبدء بزيارات جديدة"
        submessage="اذا ردت ان تبقى الزيارات راسل الدعم"
      />
    </>
  );
}
