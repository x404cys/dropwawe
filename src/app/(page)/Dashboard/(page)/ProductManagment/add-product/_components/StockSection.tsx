'use client';
import { useLanguage } from '../../../../context/LanguageContext';

import React from 'react';
import { Package, Store, Infinity } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const { t } = useLanguage();
  const session = useSession();

  return (
    <div className="space-y-6 px-6 pb-2">
      <CategoryDropdown
        categories={categories}
        value={newProduct.category as string}
        onChange={(val: string) => setNewProduct({ ...newProduct, category: val })}
        loading={loading}
      />{' '}
      <div className="grid grid-cols-[1fr_auto] items-end gap-3">
        <ModernInputGroup
          label={t.inventory?.quantity || 'الكمية المتوفرة'}
          icon={<Package className="text-muted-foreground h-4 w-4" />}
          type="number"
          value={newProduct.unlimited ? '' : newProduct.quantity}
          onChange={value => {
            const parsed = Number.parseInt(value);
            if (!isNaN(parsed) && parsed >= 0) {
              setNewProduct({ ...newProduct, quantity: parsed });
            } else {
              setNewProduct({ ...newProduct, quantity: 0 });
            }
          }}
          placeholder={t.inventory?.enterQuantity || 'أدخل الكمية'}
          disabled={loading || newProduct.unlimited}
          required
        />

        <Button
          type="button"
          variant={newProduct.unlimited ? 'default' : 'outline'}
          className="h-[38px] gap-2 rounded-xl"
          onClick={() =>
            setNewProduct({
              ...newProduct,
              unlimited: !newProduct.unlimited,
              quantity: !newProduct.unlimited ? null : newProduct.quantity,
            })
          }
        >
          <Infinity className="h-4 w-4 text-xs" /> {t.inventory.unlimited}{' '}
        </Button>
      </div>
       
    </div>
  );
}
