'use client';

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
  return (
    <OptionalSection title="إضافة صور إضافية" isOpen={isExpanded} onToggle={onToggle}>
      <div className="grid grid-cols-3 gap-4">
        {/* Images */}
        {galleryPreviews.map((preview, idx) => (
          <div
            key={idx}
            className="relative h-32 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
          >
            <img src={preview} alt={`Gallery ${idx + 1}`} className="h-full w-full object-cover" />

            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeGalleryImage(idx)}
              disabled={loading}
              className="absolute top-2 right-2 rounded-md bg-black/70 p-1 text-white transition hover:bg-black"
            >
              ✕
            </button>
          </div>
        ))}

        {/* Upload Box */}
        {galleryFiles.length < 3 && (
          <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 transition hover:border-gray-400 hover:bg-gray-100">
            <TbUpload size={22} />

            <span className="text-xs font-medium">رفع صورة</span>

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
