'use client';

import { useState } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const EXAMPLE_SIZES = ['S', 'M', 'L', 'XL'];

export interface SizesSectionProps {
  sizes: { size: string; stock: number }[];
  setSizes: React.Dispatch<React.SetStateAction<{ size: string; stock: number }[]>>;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function SizesSection({ sizes, setSizes, isExpanded, onToggle }: SizesSectionProps) {
  const { t } = useLanguage();
  const [extraSizes, setExtraSizes] = useState<string[]>([]);
  const [customSize, setCustomSize] = useState('');

  const selectedSizes = sizes.map(s => s.size);
  const allSizes = Array.from(new Set([...EXAMPLE_SIZES, ...extraSizes]));

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSizes(sizes.filter(s => s.size !== size));
    } else {
      setSizes([...sizes, { size, stock: 0 }]);
    }
  };

  const addCustomSize = () => {
    const s = customSize.trim();
    if (s && !allSizes.includes(s) && !selectedSizes.includes(s)) {
      setExtraSizes(prev => [...prev, s]);
      setSizes(prev => [...prev, { size: s, stock: 0 }]);
      setCustomSize('');
    } else if (s && !selectedSizes.includes(s)) {
      setSizes(prev => [...prev, { size: s, stock: 0 }]);
      setCustomSize('');
    }
  };

  return (
    <div className="my-4 space-y-2">
      <Label className="text-muted-foreground text-sm font-medium">
        {t.inventory?.sizeOrType || 'الأحجام'}
      </Label>
      <div className="flex flex-wrap gap-2">
        {allSizes.map(size => (
          <button
            key={size}
            type="button"
            onClick={() => toggleSize(size)}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedSizes.includes(size)
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-secondary text-secondary-foreground border-border hover:border-primary'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={customSize}
          onChange={e => setCustomSize(e.target.value)}
          placeholder={t.inventory?.addNewSize || 'حجم مخصص...'}
          className="max-w-[180px] flex-1"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addCustomSize();
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addCustomSize}
          disabled={!customSize.trim()}
        >
          {t.add || 'أضف'}
        </Button>
      </div>
    </div>
  );
}
