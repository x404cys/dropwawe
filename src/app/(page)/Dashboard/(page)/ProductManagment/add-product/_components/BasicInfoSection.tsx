'use client';

import React from 'react';
import { Package, DollarSign, Percent } from 'lucide-react';
import { calculateDiscountedPrice } from '@/app/lib/utils/CalculateDiscountedPrice';
import type { Product } from '@/types/Products';
import { ModernInputGroup } from './ModernInputGroup';

interface BasicInfoSectionProps {
  newProduct: Partial<Product> & { imageFile?: File; imagePreview?: string };
  setNewProduct: (product: any) => void;
  loading: boolean;
}

export function BasicInfoSection({ newProduct, setNewProduct, loading }: BasicInfoSectionProps) {
  return (
    <div className=" ">
      <div className="p-6">
        <div className="space-y-5">
          <ModernInputGroup
            label="اسم المنتج"
            icon={<Package className="h-4 w-4 text-gray-400" />}
            value={newProduct.name}
            onChange={(value: any) => setNewProduct({ ...newProduct, name: value })}
            placeholder="أدخل اسم المنتج (مثال: تيشرت قطن)"
            disabled={loading}
            required
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <ModernInputGroup
              label="السعر"
              icon={<DollarSign className="h-4 w-4 text-gray-400" />}
              type="number"
              value={newProduct.price ?? ''}
              onChange={(value: string) => {
                setNewProduct({ ...newProduct, price: Number.parseFloat(value) });
              }}
              onBlur={() => {
                let numericValue = newProduct.price ?? 0;
                if (numericValue > 0 && numericValue < 100) {
                  numericValue *= 1000;
                }
                if (numericValue < 240) numericValue = 240;
                setNewProduct({ ...newProduct, price: numericValue });
              }}
              placeholder="0"
              disabled={loading}
              required
            />
            <ModernInputGroup
              label="الخصم (%)"
              icon={<Percent className="h-4 w-4 text-gray-400" />}
              type="number"
              value={newProduct.discount === 0 ? '' : newProduct.discount}
              onChange={(value: string) => {
                let discountValue = Number.parseFloat(value) || 0;
                if (discountValue < 0) discountValue = 0;
                if (discountValue > 100) discountValue = 100;
                setNewProduct({ ...newProduct, discount: discountValue });
              }}
              placeholder="10"
              disabled={loading}
            />
          </div>

          {newProduct.discount! > 0 && (
            <div className="border border-sky-500 bg-sky-50 p-3">
              <span className="text-sm font-medium text-black">
                السعر بعد الخصم:{' '}
                {calculateDiscountedPrice(newProduct.price ?? 0, newProduct.discount ?? 0)} د.ع
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
