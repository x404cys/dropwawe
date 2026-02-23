'use client';

import React from 'react';
import { Info } from 'lucide-react';
import type { Product } from '@/types/Products';

interface DescriptionSectionProps {
  newProduct: Partial<Product> & { imageFile?: File; imagePreview?: string };
  setNewProduct: (product: any) => void;
  loading: boolean;
}

export function DescriptionSection({
  newProduct,
  setNewProduct,
  loading,
}: DescriptionSectionProps) {
  return (
    <div className=" ">
      <div className="p-6">
        <label
          htmlFor="product-description"
          className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700"
        >
          <span>وصف المنتج</span> <span className="text-red-400">*</span>
        </label>
        <textarea
          className="min-h-[100px] w-full rounded-2xl border border-gray-300 bg-white p-4 font-light text-black transition placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="اكتب وصفاً تفصيلياً للمنتج... (مثال: قميص صيفي مصنوع من القطن الطبيعي 100%، مريح وخفيف)"
          value={newProduct.description}
          onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
          disabled={loading}
        />
      </div>
    </div>
  );
}
