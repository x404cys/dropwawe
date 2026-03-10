'use client';
import { useLanguage } from '../../../../context/LanguageContext';

import React from 'react';
import { ModernInputGroup } from './ModernInputGroup';
import type { Product } from '@/types/Products';

interface PricingDetailsSectionProps {
  newProduct: Partial<Product> & { imageFile?: File; imagePreview?: string };
  setNewProduct: (product: any) => void;
  loading: boolean;
}

export function PricingDetailsSection({
  newProduct,
  setNewProduct,
  loading,
}: PricingDetailsSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="border-border bg-muted space-y-4 border p-4">
      <h3 className="text-sm font-semibold text-black">
        {t.inventory?.supplierPrices || 'أسعار الموردين'}
      </h3>
      <div className="grid gap-4 sm:grid-cols-3">
        <ModernInputGroup
          label={t.inventory?.wholesalePrice || 'سعر الجملة'}
          type="number"
          value={newProduct.pricingDetails?.wholesalePrice ?? ''}
          onChange={value => {
            setNewProduct({
              ...newProduct,
              pricingDetails: {
                ...newProduct.pricingDetails!,
                wholesalePrice: Number.parseFloat(value) || 0,
              },
            });
          }}
          placeholder="0"
          disabled={loading}
        />
        <ModernInputGroup
          label={t.inventory?.minPrice || 'الحد الأدنى'}
          type="number"
          value={newProduct.pricingDetails?.minPrice ?? ''}
          onChange={value => {
            setNewProduct({
              ...newProduct,
              pricingDetails: {
                ...newProduct.pricingDetails!,
                minPrice: Number.parseFloat(value) || 0,
              },
            });
          }}
          placeholder="0"
          disabled={loading}
        />
        <ModernInputGroup
          label={t.inventory?.maxPrice || 'الحد الأقصى'}
          type="number"
          value={newProduct.pricingDetails?.maxPrice ?? ''}
          onChange={value => {
            setNewProduct({
              ...newProduct,
              pricingDetails: {
                ...newProduct.pricingDetails!,
                maxPrice: Number.parseFloat(value) || 0,
              },
            });
          }}
          placeholder="0"
          disabled={loading}
        />
      </div>
    </div>
  );
}
