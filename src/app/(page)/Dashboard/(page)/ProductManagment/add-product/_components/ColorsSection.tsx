'use client';

import React from 'react';
import { IoAddSharp } from 'react-icons/io5';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CollapsibleSection } from './CollapsibleSection';

interface ColorsSectionProps {
  colors: { name: string; hex: string; stock: number }[];
  updateColor: (index: number, field: 'name' | 'hex' | 'stock', value: string | number) => void;
  addColor: () => void;
  removeColor: (index: number) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ColorsSection({
  colors,
  updateColor,
  addColor,
  removeColor,
  isExpanded,
  onToggle,
}: ColorsSectionProps) {
  return (
    <CollapsibleSection
      title="الألوان المتاحة"
      subtitle="حدد الألوان والكميات"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="space-y-3">
        {colors.map((c, i) => (
          <div key={i} className="flex items-center gap-3 border border-gray-200 bg-white p-3">
            <Input
              placeholder="اسم اللون"
              value={c.name}
              onChange={e => updateColor(i, 'name', e.target.value)}
              className="flex-1 border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
            <div className="relative">
              <Input
                type="color"
                value={c.hex}
                onChange={e => updateColor(i, 'hex', e.target.value)}
                className="h-10 w-16 cursor-pointer border-gray-300"
              />
            </div>
            <Input
              type="number"
              placeholder="الكمية"
              value={c.stock === 0 ? '' : c.stock}
              onChange={e => {
                const val = e.target.value;
                updateColor(i, 'stock', val === '' ? 0 : Number(val));
              }}
              className="w-28 border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeColor(i)}
            >
              حذف
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full gap-2 border-dashed border-gray-400 bg-transparent hover:border-sky-500 hover:bg-sky-50 hover:text-sky-500"
          onClick={addColor}
        >
          <IoAddSharp className="h-4 w-4" />
          <span>إضافة لون جديد</span>
        </Button>
      </div>
    </CollapsibleSection>
  );
}
