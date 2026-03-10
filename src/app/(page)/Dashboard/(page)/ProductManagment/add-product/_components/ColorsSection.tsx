'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const EXAMPLE_COLORS = [
  { name: 'أسود', hex: '#000000' },
  { name: 'أبيض', hex: '#FFFFFF' },
  { name: 'أزرق', hex: '#3B82F6' },
  { name: 'أحمر', hex: '#EF4444' },
];

export interface ColorsSectionProps {
  colors: { name: string; hex: string; stock: number }[];
  setColors: React.Dispatch<React.SetStateAction<{ name: string; hex: string; stock: number }[]>>;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function ColorsSection({ colors, setColors, isExpanded, onToggle }: ColorsSectionProps) {
  const { t } = useLanguage();

  const [customColor, setCustomColor] = useState('#000000');
  const [customColorName, setCustomColorName] = useState('');
  const [extraColors, setExtraColors] = useState<{ name: string; hex: string }[]>([]);

  const selectedColorHexes = colors.map(c => c.hex);

  // Combine predefined colors with any custom colors added during the session
  const allColorsMap = new Map();
  [...EXAMPLE_COLORS, ...extraColors].forEach(c => {
    if (!allColorsMap.has(c.hex)) {
      allColorsMap.set(c.hex, c);
    }
  });
  const allColors = Array.from(allColorsMap.values());

  const toggleColor = (colorHex: string, colorName: string) => {
    if (selectedColorHexes.includes(colorHex)) {
      setColors(colors.filter(c => c.hex !== colorHex));
    } else {
      setColors([...colors, { name: colorName, hex: colorHex, stock: 0 }]);
    }
  };

  const addCustomColor = () => {
    const n = customColorName.trim();
    if (n && customColor) {
      // Add to extra options available
      setExtraColors(prev => {
        if (!prev.find(c => c.hex === customColor)) {
          return [...prev, { name: n, hex: customColor }];
        }
        return prev;
      });
      // Toggle it on if it isn't
      if (!selectedColorHexes.includes(customColor)) {
        setColors(prev => [...prev, { name: n, hex: customColor, stock: 0 }]);
      }
      setCustomColorName('');
    }
  };

  return (
    <div className="my-4 space-y-2">
      <Label className="text-muted-foreground text-sm font-medium">
        {t.inventory?.colorName || 'الألوان'}
      </Label>
      <div className="flex flex-wrap gap-2">
        {allColors.map(color => (
          <button
            key={color.hex}
            type="button"
            onClick={() => toggleColor(color.hex, color.name)}
            className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors ${
              selectedColorHexes.includes(color.hex)
                ? 'border-primary ring-primary/30 ring-2'
                : 'border-border hover:border-primary'
            }`}
          >
            <span
              className="border-border h-4 w-4 rounded-full border"
              style={{ backgroundColor: color.hex }}
            />
            {color.name}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={customColor}
          onChange={e => setCustomColor(e.target.value)}
          className="border-border h-9 w-9 cursor-pointer rounded border p-0"
        />
        <Input
          value={customColorName}
          onChange={e => setCustomColorName(e.target.value)}
          placeholder={t.inventory?.colorName || 'اسم اللون...'}
          className="max-w-[180px] flex-1"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addCustomColor();
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addCustomColor}
          disabled={!customColorName.trim()}
        >
          {t.add || 'أضف'}
        </Button>
      </div>
    </div>
  );
}
