'use client';

import { IoAddSharp } from 'react-icons/io5';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    <div className="my-4 max-w-92 md:max-w-full overflow-y-auto border-b border-gray-200 pb-4">
      {sizes.map((s, i) => (
        <div key={i} className="flex items-center gap-3 p-1">
          <Input
            placeholder="المقاس أو النوع"
            value={s.size}
            onChange={e => updateSize(i, 'size', e.target.value)}
            className="flex-1 rounded-2xl border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
          <Input
            type="number"
            placeholder="الكمية"
            value={s.stock === 0 ? '' : s.stock}
            onChange={e => {
              const val = e.target.value;
              updateSize(i, 'stock', val === '' ? 0 : Number(val));
            }}
            className="w-28 rounded-2xl border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
          <Button
            type="button"
            className="cursor-pointer rounded-2xl bg-red-100 text-red-500 hover:bg-red-200"
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
        className="mt-2 w-full cursor-pointer gap-2 rounded-2xl border-dashed border-gray-400 bg-transparent hover:border-sky-500 hover:bg-sky-50 hover:text-sky-500"
        onClick={addSize}
      >
        <IoAddSharp className="h-4 w-4" />
        <span>إضافة حجم جديد</span>
      </Button>
    </div>
  );
}
