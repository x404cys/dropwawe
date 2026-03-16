// THEME: modern-structured — StoreSection

'use client';

import { useMemo, useState } from 'react';
import type { StoreSectionProps, StorefrontProduct } from '../../../_lib/types';
import { useLanguage } from '../../../_context/LanguageContext';
import { useStorefront } from '../../../_hooks/useStorefront';
import ModernStructuredBannerCarousel from '../components/BannerCarousel';
import ModernStructuredProductCard from '../components/ProductCard';
import ModernStructuredSearchBar from '../components/SearchBar';

function sortProducts(products: StorefrontProduct[], sortBy: string) {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

export default function ModernStructuredStoreSection({
  products,
  template,
  colors,
  fonts,
  centerBanners = [],
}: StoreSectionProps) {
  const { t } = useLanguage();
  const [sortBy, setSortBy] = useState('default');
  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    displayCategories,
    displayFiltered,
  } = useStorefront(products);

  const sortedProducts = useMemo(
    () => sortProducts(displayFiltered, sortBy),
    [displayFiltered, sortBy]
  );

  return (
    <section id="store-section" className="bg-[#fafafa]">
      <div className="border-y border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          {/* DESIGN: The filter bar sits in a dedicated bordered band so browsing controls are always visually separated from products. */}
          <div className="flex gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {displayCategories.map(category => {
              const isActive = activeCategory === category.key;

              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => setActiveCategory(category.key)}
                  className="shrink-0 rounded-lg px-4 py-2 text-sm transition-all duration-150 ease-in-out"
                  style={
                    isActive
                      ? {
                          backgroundColor: `${colors.accent}15`,
                          color: colors.accent,
                          fontFamily: fonts.heading,
                        }
                      : { fontFamily: fonts.body }
                  }
                >
                  {category.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full sm:w-48">
              <ModernStructuredSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                colors={colors}
                fonts={fonts}
              />
            </div>
            <select
              value={sortBy}
              onChange={event => setSortBy(event.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-600 transition-all duration-150 ease-in-out outline-none focus:border-gray-400"
              style={{ fontFamily: fonts.body }}
            >
              <option value="default">ترتيب افتراضي</option>
              <option value="name">الاسم</option>
              <option value="price-asc">الأقل سعراً</option>
              <option value="price-desc">الأعلى سعراً</option>
            </select>
          </div>
        </div>
      </div>

      {centerBanners.length > 0 ? (
        <div className="py-8">
          <ModernStructuredBannerCarousel banners={centerBanners} colors={colors} />
        </div>
      ) : null}

      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {sortedProducts.map(product => (
            <ModernStructuredProductCard
              key={product.id}
              product={product}
              colors={colors}
              fonts={fonts}
            />
          ))}
        </div>

        {sortedProducts.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center text-sm text-slate-500">
            {t.store.noProducts}
          </div>
        ) : null}
      </div>
    </section>
  );
}
