'use client';

import React from 'react';
import { TbUpload } from 'react-icons/tb';
import { CollapsibleSection } from './CollapsibleSection';
import { OptionalSection } from './Image-Section/SectionCard';
import { GallerySectionForMobile } from './Image-Section/GallerySectionForMobile';

interface GallerySectionProps {
  galleryFiles: File[];
  galleryPreviews: string[];
  onGalleryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeGalleryImage: (index: number) => void;
  isExpanded: boolean;
  onToggle: () => void;
  loading: boolean;
}

export function GallerySection({
  galleryFiles,
  galleryPreviews,
  onGalleryChange,
  removeGalleryImage,
  isExpanded,
  onToggle,
  loading,
}: GallerySectionProps) {
  return (
    <CollapsibleSection
      title="صور إضافية"
      subtitle={`${galleryFiles.length}/3 صور`}
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="grid grid-cols-3 gap-3">
        {galleryPreviews.map((preview, idx) => (
          <div key={idx} className="relative aspect-square overflow-hidden border border-gray-300">
            <img
              src={preview || '/placeholder.svg'}
              alt={`Gallery ${idx + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeGalleryImage(idx)}
              className="absolute top-1 right-1 bg-black p-1 text-white transition hover:bg-gray-800"
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}

        {galleryFiles.length < 3 && (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 bg-gray-50 text-gray-600 transition hover:border-sky-500 hover:bg-sky-50">
            <TbUpload size={24} className="text-sky-500" />
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
    </CollapsibleSection>
  );
}
