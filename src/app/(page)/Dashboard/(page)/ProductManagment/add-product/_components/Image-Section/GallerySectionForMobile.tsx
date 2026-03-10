'use client';
import { useLanguage } from '../../../../../context/LanguageContext';

import React from 'react';
import { TbUpload } from 'react-icons/tb';
import { CollapsibleSection } from '../CollapsibleSection';
import { OptionalSection } from './SectionCard';

interface GallerySectionForMobileProps {
  galleryFiles: File[];
  galleryPreviews: string[];
  onGalleryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeGalleryImage: (index: number) => void;
  isExpanded: boolean;
  onToggle: () => void;
  loading: boolean;
}

export function GallerySectionForMobile({
  galleryFiles,
  galleryPreviews,
  onGalleryChange,
  removeGalleryImage,
  isExpanded,
  onToggle,
  loading,
}: GallerySectionForMobileProps) {
  const { t } = useLanguage();
  return (
    <OptionalSection
      title={t.inventory?.addOptionalImages || 'إضافة صور إضافية (اختياري)'}
      isOpen={isExpanded}
      onToggle={onToggle}
    >
      <div className="grid grid-cols-3 gap-4">
        {galleryPreviews.map((preview, idx) => (
          <div
            key={idx}
            className="border-border bg-muted relative h-32 w-full overflow-hidden rounded-xl border"
          >
            <img src={preview} alt={`Gallery ${idx + 1}`} className="h-full w-full object-cover" />

            <button
              type="button"
              onClick={() => removeGalleryImage(idx)}
              disabled={loading}
              className="absolute top-2 right-2 rounded-md bg-black/70 p-1 text-white transition"
            >
              ✕
            </button>
          </div>
        ))}

        {galleryFiles.length < 3 && (
          <label className="bg-muted text-muted-foreground hover:bg-muted flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 transition hover:border-gray-400">
            <TbUpload size={22} />

            <span className="text-xs font-medium">{t.inventory?.uploadImage || 'رفع صورة'}</span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={onGalleryChange}
              className="hidden"
              disabled={loading}
            />
          </label>
        )}
      </div>
    </OptionalSection>
  );
}
