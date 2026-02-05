'use client';

import React from 'react';
import { IoAddSharp } from 'react-icons/io5';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CollapsibleSection } from './CollapsibleSection';

interface SizesSectionProps {
  sizes: { size: string; stock: number }[];
  updateSize: (index: number, field: 'size' | 'stock', value: string | number) => void;
  addSize: () => void;
  removeSize: (index: number) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export function SizesSection({
  sizes,
  updateSize,
  addSize,
  removeSize,
  isExpanded,
  onToggle,
}: SizesSectionProps) {
  return (
    <CollapsibleSection
      title="الأحجام والأنواع"
      subtitle="أضف خيارات متعددة للمنتج"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="space-y-3">
        {sizes.map((s, i) => (
          <div key={i} className="flex items-center gap-3 border border-gray-200 bg-white p-3">
            <Input
              placeholder="المقاس أو النوع"
              value={s.size}
              onChange={e => updateSize(i, 'size', e.target.value)}
              className="flex-1 border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
            <Input
              type="number"
              placeholder="الكمية"
              value={s.stock === 0 ? '' : s.stock}
              onChange={e => {
                const val = e.target.value;
                updateSize(i, 'stock', val === '' ? 0 : Number(val));
              }}
              className="w-28 border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeSize(i)}
            >
              حذف
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full gap-2 border-dashed border-gray-400 bg-transparent hover:border-sky-500 hover:bg-sky-50 hover:text-sky-500"
          onClick={addSize}
        >
          <IoAddSharp className="h-4 w-4" />
          <span>إضافة حجم جديد</span>
        </Button>
      </div>
    </CollapsibleSection>
  );
}
