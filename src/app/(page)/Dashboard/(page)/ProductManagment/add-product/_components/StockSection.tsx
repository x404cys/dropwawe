'use client';

import React from 'react';
import { Package, Store, PackageOpenIcon as GoPackageDependencies } from 'lucide-react';
import { ModernInputGroup } from './ModernInputGroup';
import type { Product } from '@/types/Products';
import CategoryDropdown from '../../_components/InputForCatogery';
import { useSession } from 'next-auth/react';

interface StockSectionProps {
  newProduct: Partial<Product> & {
    imageFile?: File;
    imagePreview?: string;
    unlimited: boolean;
  };
  setNewProduct: (product: any) => void;
  loading: boolean;
  categories: string[];
  storeId: string;
  setStoreId: (id: string) => void;
  data: any;
}

export function StockSection({
  newProduct,
  setNewProduct,
  loading,
  categories,
  storeId,
  setStoreId,
  data,
}: StockSectionProps) {
  const session = useSession();
  return (
    <div className="rounded-lg border bg-white">
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <h3 className="flex items-center gap-2 text-base font-semibold text-black">
          <GoPackageDependencies className="h-5 w-5 text-sky-500" />
          <span>المخزون والكمية</span>
        </h3>
      </div>
      <div className="space-y-1 p-6">
        <ModernInputGroup
          label="الكمية المتوفرة"
          icon={<Package className="h-4 w-4 text-gray-400" />}
          type="number"
          value={newProduct.unlimited ? '' : newProduct.quantity}
          onChange={value => {
            const parsed = Number.parseInt(value);
            if (!isNaN(parsed) && parsed >= 0) {
              setNewProduct({ ...newProduct, quantity: parsed, unlimited: false });
            } else {
              setNewProduct({ ...newProduct, quantity: 0, unlimited: false });
            }
          }}
          placeholder="أدخل الكمية"
          disabled={loading || newProduct.unlimited}
          required
        />

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={newProduct.unlimited}
            onChange={e => setNewProduct({ ...newProduct, unlimited: e.target.checked })}
            className="mt-1 h-5 w-5 border-gray-300 text-sky-500 focus:ring-sky-500"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-black">كمية غير محدودة</span>
            <p className="text-xs text-gray-600">مفيد للمنتجات المتجددة باستمرار</p>
          </div>
        </div>

        <CategoryDropdown
          categories={categories}
          value={newProduct.category as string}
          onChange={(val: string) => setNewProduct({ ...newProduct, category: val })}
          loading={loading}
        />

        {session.data?.user.role === 'DROPSHIPPER' && (
          <>
            <label className="  hidden items-center text-gray-600">
              <Store className="h-4 w-4" />
              <span>اختر المتجر</span>
            </label>
            <select
              className="mt-2 w-full hidden rounded-md border border-gray-300 bg-white p-3 text-sm text-black shadow-sm transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              value={storeId || ''}
              onChange={e => setStoreId(e.target.value)}
            >
              <option value="">الافتراضي</option>
              {data.Stores?.map((store: any) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </>
        )}
      </div>
    </div>
  );
}
