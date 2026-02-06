'use client';

import React from 'react';
import { TbTruckReturn } from 'react-icons/tb';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { ModernInputGroup } from './ModernInputGroup';
import { CollapsibleSection } from './CollapsibleSection';
import type { Product } from '@/types/Products';

interface ShippingSectionProps {
  newProduct: Partial<Product> & { imageFile?: File; imagePreview?: string };
  setNewProduct: (product: any) => void;
  loading: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ShippingSection({
  newProduct,
  setNewProduct,
  loading,
  isExpanded,
  onToggle,
}: ShippingSectionProps) {
  return (
    <CollapsibleSection
      title="معلومات الشحن والإرجاع"
      subtitle="اختياري - أضف تفاصيل التوصيل"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="space-y-4 ">
        <ModernInputGroup
          label="مدة التوصيل أو تفاصيله"
          icon={<LiaShippingFastSolid className="h-4 w-4 text-gray-400" />}
          type="text"
          value={newProduct.shippingType}
          onChange={value => setNewProduct({ ...newProduct, shippingType: value })}
          placeholder="مثال: التوصيل خلال 3-5 أيام"
          disabled={loading}
        />

        <ModernInputGroup
          label="سياسة الاسترجاع"
          icon={<TbTruckReturn className="h-4 w-4 text-gray-400" />}
          type="text"
          value={newProduct.hasReturnPolicy}
          onChange={value => setNewProduct({ ...newProduct, hasReturnPolicy: value })}
          placeholder="مثال: إرجاع مجاني خلال 14 يوم"
          disabled={loading}
        />
      </div>
    </CollapsibleSection>
  );
}
