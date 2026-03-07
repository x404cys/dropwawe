'use client';
import { useLanguage } from '../../../../context/LanguageContext';

import React from 'react';
import { SlCloudUpload } from 'react-icons/sl';
import type { Product } from '@/types/Products';

interface ImageUploaderProps {
  newProduct: Partial<Product> & { imageFile?: File; imagePreview?: string };
  setNewProduct: (product: any) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  isCompressing: boolean;
  compressionProgress: number;
}

export function ImageUploader({
  newProduct,
  setNewProduct,
  handleImageChange,
  loading,
  isCompressing,
  compressionProgress,
}: ImageUploaderProps) {
  const { t } = useLanguage();
  return (
    <div className="sticky top-0 left-2 z-10 mt-10 space-y-2 rounded-xl px-1">
      {isCompressing && (
        <div className="rounded-xl border border-sky-200 bg-sky-50 p-2">
          <p className="mb-1 text-[11px] font-medium text-sky-700">
            {t.inventory?.preparingImage || 'تجهيز الصورة'} {compressionProgress}%
          </p>

          <div className="h-1.5 w-full overflow-hidden rounded bg-sky-100">
            <div
              className="h-full bg-sky-500 transition-all duration-200"
              style={{ width: `${compressionProgress}%` }}
            />
          </div>
        </div>
      )}

      {newProduct.imagePreview ? (
        <div className="relative aspect-square overflow-hidden rounded-xl border border-gray-300 bg-muted">
          <img
            src={newProduct.imagePreview || '/placeholder.svg'}
            alt="Preview"
            className="h-full w-full object-cover"
          />

          <button
            type="button"
            onClick={() =>
              setNewProduct({
                ...newProduct,
                imageFile: undefined,
                imagePreview: undefined,
              })
            }
            className="absolute top-2 right-2 rounded-md bg-black/80 p-1.5 text-white hover:bg-black"
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
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
      ) : (
        <label className="flex max-h-2/4 aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-muted text-muted-foreground transition hover:border-sky-500 hover:bg-sky-50">
          <div className="rounded-lg bg-sky-100 p-2.5">
            <SlCloudUpload size={20} className="text-sky-500" />
          </div>

          <div className="text-center leading-tight">
            <span className="block text-xs font-semibold text-black">{t.inventory?.uploadImage || 'رفع الصورة'}</span>
            <span className="text-[10px] text-muted-foreground">JPG / PNG / WEBP</span>
          </div>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="hidden"
            disabled={loading}
          />
        </label>
      )}
    </div>
  );
}
