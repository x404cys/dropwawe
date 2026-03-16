'use client';

import { Package } from 'lucide-react';
import { ActiveColors, StorefrontCategoryIcon } from '../../_lib/types';
import { getCategoryIcon } from '../../_utils/icons';
import type { StorefrontCategoryOption } from '../../_hooks/useStorefront';

interface CategoryIconsProps {
  categories: StorefrontCategoryOption[];
  activeCategory: string;
  onSelect: (cat: string) => void;
  categoryIcons: StorefrontCategoryIcon[];
  colors: ActiveColors;
}

export default function CategoryIcons({
  categories,
  activeCategory,
  onSelect,
  categoryIcons,
  colors,
}: CategoryIconsProps) {
  return (
    <div className="mb-12 grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
      {categories.map(category => {
        const iconItem = categoryIcons.find(item => item.category === category.key);
        const CategoryIcon = category.isAll
          ? Package
          : getCategoryIcon(iconItem?.icon ?? 'Package');
        const isActive = activeCategory === category.key;

        return (
          <button
            key={category.key}
            type="button"
            onClick={() => onSelect(category.key)}
            // REDESIGN: replace playful icon chips with a stricter category tile system.
            className="group border px-3 py-4 text-center transition-colors duration-200"
            style={{
              borderColor: isActive ? colors.accent : 'rgba(255,255,255,0.08)',
              backgroundColor: isActive ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
              color: isActive ? colors.accent : colors.text,
            }}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center overflow-hidden border border-white/10">
              {iconItem?.image ? (
                <img
                  src={iconItem.image}
                  alt={category.label}
                  className="h-full w-full object-cover"
                />
              ) : (
                <CategoryIcon className="h-4 w-4 opacity-80" />
              )}
            </div>

            <span
              className="mt-3 block text-[10px] font-light tracking-[0.22em] uppercase"
              style={{ opacity: isActive ? 1 : 0.65 }}
            >
              {category.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
