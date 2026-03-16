'use client';

import { ChevronLeft, Package } from 'lucide-react';
import { ActiveColors, StorefrontCategoryIcon, StorefrontProduct } from '../../_lib/types';
import { getCategoryIcon } from '../../_utils/icons';
import { useLanguage } from '../../_context/LanguageContext';
import ProductCard from './ProductCard';

interface CategoryRowProps {
  category: string;
  products: StorefrontProduct[];
  colors: ActiveColors;
  headingStyle: React.CSSProperties;
  categoryIcons: StorefrontCategoryIcon[];
  onViewAll: (cat: string) => void;
}

export default function CategoryRow({
  category,
  products,
  colors,
  headingStyle,
  categoryIcons,
  onViewAll,
}: CategoryRowProps) {
  const { t } = useLanguage();

  if (products.length === 0) return null;

  const iconItem = categoryIcons.find(item => item.category === category);
  const CategoryIcon = iconItem?.icon ? getCategoryIcon(iconItem.icon) : Package;

  return (
    <div className="space-y-8 border-t border-white/10 pt-10">
      <div className="flex items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center border border-white/10 bg-white/[0.02]">
            {iconItem?.image ? (
              <img src={iconItem.image} alt={category} className="h-full w-full object-cover" />
            ) : (
              <CategoryIcon className="h-4 w-4 opacity-70" style={{ color: colors.text }} />
            )}
          </div>

          <div>
            <p
              className="text-[10px] font-light tracking-[0.3em] uppercase opacity-45"
              style={{ color: colors.text }}
            >
              {t.nav.store}
            </p>
            <h3
              className="text-2xl font-light tracking-tight lg:text-3xl"
              style={{ ...headingStyle, color: colors.text }}
            >
              {category}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onViewAll(category)}
          className="inline-flex items-center gap-2 text-[10px] font-light tracking-[0.28em] uppercase opacity-60 transition-opacity duration-200 hover:opacity-100"
          style={{ color: colors.text }}
        >
          <span>{t.store.viewAll}</span>
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
      </div>

      <div
        // REDESIGN: category collections use the same tight editorial grid as the main catalog.
        className="grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-4"
      >
        {products.map(product => (
          <ProductCard key={product.id} product={product} colors={colors} />
        ))}
      </div>
    </div>
  );
}
