// Purpose: Category icons filter - "use client", horizontal scroll of icon buttons.
// Used when categoryDisplayMode === "icons". Matches Storefront.tsx exactly.

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
    <div className="flex gap-4 overflow-x-auto pb-4 mb-6 justify-start sm:justify-center px-2">
      {categories.map((cat) => {
        const iconItem = categoryIcons.find((ci) => ci.category === cat.key);
        const CatIcon = cat.isAll ? Package : getCategoryIcon(iconItem?.icon ?? 'Package');
        const isActive = activeCategory === cat.key;

        return (
          <button
            key={cat.key}
            onClick={() => onSelect(cat.key)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 min-w-[60px] transition-all"
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all overflow-hidden ${
                isActive ? 'shadow-md' : 'border-border bg-card'
              }`}
              style={
                isActive
                  ? { borderColor: colors.primary, backgroundColor: `${colors.primary}15` }
                  : undefined
              }
            >
              {iconItem?.image ? (
                <img
                  src={iconItem.image}
                  alt={cat.label}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <CatIcon
                  className="h-6 w-6 transition-colors"
                  style={{ color: isActive ? colors.primary : undefined }}
                />
              )}
            </div>
            <span
              className={`text-[10px] font-semibold transition-colors ${
                isActive ? '' : 'text-muted-foreground'
              }`}
              style={isActive ? { color: colors.primary } : undefined}
            >
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
