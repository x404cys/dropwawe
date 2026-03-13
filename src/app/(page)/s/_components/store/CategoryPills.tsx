// Purpose: Category pills filter — "use client", horizontal scrolling pill buttons.
// Used when categoryDisplayMode === "pills". Matches Storefront.tsx exactly.

'use client';

import { ActiveColors } from '../../_lib/types';

interface CategoryPillsProps {
  categories: string[];
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
    <div className="flex gap-2 overflow-x-auto pb-3 mb-6 justify-center">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeCategory === cat
              ? 'text-white shadow-sm'
              : 'bg-card border border-border text-muted-foreground hover:text-foreground'
          }`}
          style={activeCategory === cat ? { backgroundColor: colors.primary } : undefined}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
