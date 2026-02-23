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
    <div className="mb-3 max-w-92 space-y-1 overflow-y-auto rounded-2xl md:max-w-full">
      {colors.map((c, i) => (
        <div key={i} className="flex items-center gap-3 rounded-2xl p-3">
          <Input
            placeholder="اسم اللون"
            value={c.name}
            onChange={e => updateColor(i, 'name', e.target.value)}
            className="flex-1 rounded-2xl border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
          <div className="relative">
            <Input
              type="color"
              value={c.hex}
              onChange={e => updateColor(i, 'hex', e.target.value)}
              className="h-10 w-16 cursor-pointer rounded-2xl border-gray-300"
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
            className="w-28 rounded-2xl border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
          <Button
            type="button"
            className="rounded-2xl bg-red-100 text-red-500 hover:bg-red-200 cursor-pointer"
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
        className="w-full cursor-pointer gap-2 rounded-2xl border-dashed border-gray-400 hover:border-sky-500 hover:bg-sky-50 hover:text-sky-500"
        onClick={addColor}
      >
        <IoAddSharp className="h-4 w-4" />
        <span>إضافة لون جديد</span>
      </Button>
    </div>
  );
}
