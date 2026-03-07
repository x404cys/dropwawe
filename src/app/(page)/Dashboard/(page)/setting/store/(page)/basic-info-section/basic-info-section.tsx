'use client';
import { useLanguage } from '../../../../../context/LanguageContext';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Store, FileText, Link, AlertCircle, Camera, X } from 'lucide-react';

interface BasicInfoSectionProps {
  storeSlug: string;
  storeName: string;
  description: string;
  imagePreview: string | null;
  fieldErrors: { [key: string]: string };
  onStoreSlugChange: (value: string) => void;
  onStoreNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
}

function FieldBlock({
  label,
  icon: Icon,
  hint,
  error,
  children,
}: {
  label: string;
  icon: React.ElementType;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5 uppercase tracking-wide">
        <Icon className="h-3 w-3" />
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p className="text-[11px] text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}

export default function BasicInfoSection({
  storeSlug,
  storeName,
  description,
  imagePreview,
  fieldErrors,
  onStoreSlugChange,
  onStoreNameChange,
  onDescriptionChange,
  onImageChange,
  onImageRemove,
}: BasicInfoSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-5">
      {/* Store Logo */}
      <div className="flex flex-col gap-3 pb-2">
        <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5 uppercase tracking-wide">
          <Camera className="h-3 w-3" />
          {(t.profile as any)?.storeLogo || 'شعار المتجر'}
        </label>
        <div className="flex items-center gap-5">
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-border bg-muted/50">
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Store Logo"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={onImageRemove}
                  className="absolute top-1 right-1 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 transition"
                  aria-label="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <Store className="h-8 w-8 opacity-20" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-4 w-fit">
              {t.inventory?.uploadImage || 'رفع شعار'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onImageChange}
              />
            </label>
            <p className="text-[10px] text-muted-foreground">JPG, PNG أو WEBP. الحد الأقصى 2MB.</p>
          </div>
        </div>
      </div>

      {/* Store domain / slug */}
      <FieldBlock
        label={t.profile?.domain || 'رابط المتجر'}
        icon={Link}
        hint={storeSlug ? `سيكون: ${storeSlug}.drop-wave.com` : 'حروف وأرقام إنجليزية فقط بدون مسافات'}
        error={fieldErrors.subLink}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pr-3 pointer-events-none text-[11px] text-muted-foreground bg-muted/60 border-r border-border px-3 rounded-r-none rounded-l-lg h-full">
            .drop-wave.com
          </div>
          <Input
            value={storeSlug}
            onChange={e => {
              const value = e.target.value.toLowerCase();
              if (/^[a-z0-9-]*$/.test(value)) onStoreSlugChange(value);
            }}
            placeholder="my-store"
            dir="ltr"
            className="pl-3 pr-36 h-11 text-sm"
          />
        </div>
      </FieldBlock>

      {/* Store name */}
      <FieldBlock
        label={t.profile?.storeName || 'اسم المتجر'}
        icon={Store}
        hint="يظهر هذا الاسم في صفحة متجرك وللعملاء"
        error={fieldErrors.name}
      >
        <div className="relative">
          <Input
            value={storeName}
            onChange={e => onStoreNameChange(e.target.value)}
            placeholder={t.profile?.storeName || 'اسم المتجر'}
            className="h-11 text-sm pr-4"
          />
        </div>
      </FieldBlock>

      {/* Description */}
      <FieldBlock
        label={t.profile?.storeDesc || 'وصف المتجر'}
        icon={FileText}
        hint={`${description.length}/200 حرف`}
        error={fieldErrors.description}
      >
        <Textarea
          value={description}
          onChange={e => onDescriptionChange(e.target.value)}
          placeholder={t.store?.storeDescPlaceholder || 'صف متجرك للعملاء — ماذا تبيع؟ ما الذي يميزك؟'}
          maxLength={200}
          className="min-h-[90px] resize-none text-sm leading-relaxed"
        />
      </FieldBlock>

      {/* Warning banner */}
      <div className="flex items-start gap-3 rounded-xl bg-amber-500/8 border border-amber-500/20 px-4 py-3">
        <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
            {t.store?.domainChangeWarning || 'تنبيه عند تغيير الرابط'}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
            {t.store?.domainChangeSubwarning || 'سيتم إعادة احتساب إحصائيات الزيارات. إذا أردت الاحتفاظ بها، تواصل مع الدعم.'}
          </p>
        </div>
      </div>
    </div>
  );
}
