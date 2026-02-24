'use client';

import React from 'react';
import { SlCloudUpload } from 'react-icons/sl';
import type { Product } from '@/types/Products';

interface ImageForMobileProps {
  newProduct: Partial<Product> & { imageFile?: File; imagePreview?: string };
  setNewProduct: (product: any) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  isCompressing: boolean;
  compressionProgress: number;
}

export function ImageForMobile({
  newProduct,
  setNewProduct,
  handleImageChange,
  loading,
  isCompressing,
  compressionProgress,
}: ImageForMobileProps) {
  return (
    <div className="relative mb-6 block w-full px-4 md:hidden">
      <div className="flex items-center justify-center gap-6">
        {!newProduct.imagePreview && (
          <label className="flex h-60 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 transition hover:border-gray-400">
            <SlCloudUpload size={26} />

            <span className="text-sm">رفع صورة</span>
            <span className="text-xs font-light">PNG / JPG / WEBP</span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
              disabled={loading || isCompressing}
            />
          </label>
        )}

        {newProduct.imagePreview && (
          <div className="relative h-60 w-72 overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 transition hover:border-gray-400">
            <img
              src={newProduct.imagePreview}
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
              className="absolute top-2 right-2 rounded-md bg-black/70 p-1 text-white hover:bg-black"
              disabled={loading || isCompressing}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {isCompressing && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl bg-white/70 backdrop-blur-sm">
          <p className="mb-3 text-sm font-semibold text-gray-700">جاري تجهيز الصورة...</p>

          <div className="w-3/4 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-2 bg-sky-500 transition-all duration-300"
              style={{ width: `${compressionProgress}%` }}
            />
          </div>

          <span className="mt-2 text-xs text-gray-600">{compressionProgress}%</span>
        </div>
      )}
    </div>
  );
}
