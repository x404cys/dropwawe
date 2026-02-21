'use client';

import React from 'react';
import { SlCloudUpload } from 'react-icons/sl';
import { ImageIcon } from 'lucide-react';
import type { Product } from '@/types/Products';

interface MainImageSectionProps {
  newProduct: Partial<Product> & { imageFile?: File; imagePreview?: string };
  setNewProduct: (product: any) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  isCompressing: boolean;
  compressionProgress: number;
}

export function MainImageSection({
  newProduct,
  setNewProduct,
  handleImageChange,
  loading,
  isCompressing,
  compressionProgress,
}: MainImageSectionProps) {
  return (
    <div className="sticky rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <h3 className="flex items-center gap-2 text-base font-semibold text-black">
          <ImageIcon className="h-5 w-5 text-sky-500" />
          <span>الصورة الرئيسية</span>
        </h3>
      </div>
      <div className="p-6">
        {isCompressing && (
          <div className="w-full rounded-lg border border-sky-200 bg-sky-50 p-3">
            <p className="mb-2 text-xs font-medium text-sky-700">
              جاري تجهيز الصورة... {compressionProgress}%
            </p>

            <div className="h-2 w-full overflow-hidden rounded bg-sky-100">
              <div
                className="h-full bg-sky-500 transition-all duration-200"
                style={{ width: `${compressionProgress}%` }}
              />
            </div>
          </div>
        )}
        {newProduct.imagePreview ? (
          <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-50">
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
              className="absolute top-3 right-3 bg-black p-2 text-white transition hover:bg-gray-800"
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-600 transition hover:border-sky-500 hover:bg-sky-50">
            <div className="rounded-lg bg-sky-100 p-4">
              <SlCloudUpload size={32} className="text-sky-500" />
            </div>
            <div className="text-center">
              <span className="block text-sm font-semibold text-black">اضغط لرفع الصورة</span>
              <span className="mt-1 block text-xs text-gray-600">JPG, PNG, أو WEBP</span>
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
    </div>
  );
}
