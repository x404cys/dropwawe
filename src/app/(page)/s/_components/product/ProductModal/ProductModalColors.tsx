import { Check } from 'lucide-react';

import type { StorefrontProduct } from '../../../_lib/types';

interface ProductModalColorsProps {
  colors: StorefrontProduct['colors'];
  selectedColor: string | null;
  selectedColorName: string | null;
  onSelect: (colorId: string) => void;
  primaryColor: string;
  label: string;
}

export default function ProductModalColors({
  colors,
  selectedColor,
  selectedColorName,
  onSelect,
  primaryColor,
  label,
}: ProductModalColorsProps) {
  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="mb-3 text-sm font-semibold">{label}</p>

      <div className="flex flex-wrap gap-3">
        {colors.map(color => {
          const active = selectedColor === color.id;

          return (
            <button
              key={color.id}
              onClick={() => onSelect(color.id)}
              className="relative flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-[var(--muted)]"
            >
              <span
                className="h-5 w-5 rounded-full border border-black/10"
                style={{ backgroundColor: color.hex ?? color.name }}
              />
              <span className="text-xs">{color.name}</span>

              {active && (
                <span
                  className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Check className="h-3 w-3" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selectedColorName && (
        <p className="text-muted-foreground mt-2 text-xs">المحدد: {selectedColorName}</p>
      )}
    </div>
  );
}
