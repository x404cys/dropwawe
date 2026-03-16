'use client';

import { ActiveColors } from '../../_lib/types';
import type { StorefrontCategoryOption } from '../../_hooks/useStorefront';

interface CategoryPillsProps {
  categories: StorefrontCategoryOption[];
  activeCategory: string;
  onSelect: (cat: string) => void;
  colors: ActiveColors;
}

export default function CategoryPills({
  categories,
  activeCategory,
  onSelect,
  colors,
}: CategoryPillsProps) {
  return (
    <div className="mb-12 flex flex-wrap items-center justify-center gap-4">
      {categories.map(category => {
        const isActive = activeCategory === category.key;

        return (
          <button
            key={category.key}
            type="button"
            onClick={() => onSelect(category.key)}
            // REDESIGN: convert filters to text-led category controls with subtle active accents.
            className="border-b pb-2 text-xs font-light tracking-[0.28em] uppercase transition-opacity duration-200 hover:opacity-100"
            style={{
              color: isActive ? colors.accent : colors.text,
              borderColor: isActive ? colors.accent : 'rgba(255,255,255,0.08)',
              opacity: isActive ? 1 : 0.55,
            }}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
