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
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <h3 className="flex items-center gap-2 text-base font-semibold text-black">
          <Info className="h-5 w-5 text-sky-500" />
          <span>وصف المنتج</span>
        </h3>
      </div>
      <div className="p-6">
        <textarea
          className="min-h-[150px] w-full border border-gray-300 bg-white p-4 text-sm text-black transition placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="اكتب وصفاً تفصيلياً للمنتج... (مثال: قميص صيفي مصنوع من القطن الطبيعي 100%، مريح وخفيف)"
          value={newProduct.description}
          onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
          disabled={loading}
        />
      </div>
    </div>
  );
}
