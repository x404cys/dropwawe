// THEME: clean-marketplace - StoreSection

'use client';

import { Flame, Package, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { StoreSectionProps } from '../../../_lib/types';
import { useLanguage } from '../../../_context/LanguageContext';
import { useStorefront } from '../../../_hooks/useStorefront';
import { getCategoryIcon } from '../../../_utils/icons';
import CleanMarketplaceBannerCarousel from '../components/BannerCarousel';
import CleanMarketplaceProductCard from '../components/ProductCard';
import CleanMarketplaceSearchBar from '../components/SearchBar';

export default function CleanMarketplaceStoreSection({
  products,
  template,
  colors,
  fonts,
  enabledCategorySections,
  centerBanners = [],
}: StoreSectionProps) {
  const { t } = useLanguage();
  const [visibleCount, setVisibleCount] = useState(15);
  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    displayCategories,
    displayFiltered,
    allCategoryKey,
  } = useStorefront(products);

  const marketplaceCategories = useMemo(() => {
    const sectionItems = enabledCategorySections
      .filter(section => section.enabled !== false)
      .sort((a, b) => a.order - b.order)
      .map(section => ({ key: section.category, label: section.category }));

    const fallbackItems = displayCategories
      .filter(category => category.key !== allCategoryKey)
      .map(category => ({ key: category.key, label: category.label }));

    const merged = (sectionItems.length > 0 ? sectionItems : fallbackItems).filter(
      (item, index, array) => array.findIndex(candidate => candidate.key === item.key) === index
    );

    return [{ key: allCategoryKey, label: t.store.all }, ...merged];
  }, [allCategoryKey, displayCategories, enabledCategorySections, t.store.all]);

  useEffect(() => {
    setVisibleCount(15);
  }, [activeCategory, searchQuery]);

  const visibleProducts = displayFiltered.slice(0, visibleCount);

  return (
    <section id="store-section" className="w-full bg-white">
      <div id="store-search" className="px-4 pt-4 lg:px-8">
        <CleanMarketplaceSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          colors={colors}
          fonts={fonts}
        />
      </div>

      {centerBanners.length > 0 ? (
        <div className="mt-4">
          <CleanMarketplaceBannerCarousel banners={centerBanners} colors={colors} />
        </div>
      ) : null}

      <div className="border-y border-gray-100 px-4 py-4 lg:px-8">
        {/* DESIGN: Category thumbnails are the main navigation affordance, matching a real marketplace browsing flow. */}
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {marketplaceCategories.map(category => {
            const isActive = activeCategory === category.key;
            const iconItem = template.categoryIcons.find(item => item.category === category.key);
            const normalized = category.label.trim().toLowerCase();
            const isHot = normalized.includes('hot') || normalized.includes('sale');
            const isNew = normalized.includes('new');
            const Icon = iconItem?.icon ? getCategoryIcon(iconItem.icon) : Package;

            return (
              <button
                key={category.key}
                type="button"
                onClick={() => setActiveCategory(category.key)}
                className="flex min-w-[80px] flex-col items-center gap-1"
              >
                <div
                  className={`flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl transition-all duration-200 ease-in-out ${
                    isActive
                      ? 'border-2 border-gray-800 bg-white'
                      : 'border border-transparent bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  {iconItem?.image ? (
                    <img
                      src={iconItem.image}
                      alt={category.label}
                      className="h-full w-full object-cover"
                    />
                  ) : isHot ? (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xl">
                      🔥
                    </div>
                  ) : isNew ? (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xl">
                      ✨
                    </div>
                  ) : iconItem?.icon ? (
                    <Icon className="h-6 w-6 text-gray-600" />
                  ) : category.key === allCategoryKey ? (
                    <Package className="h-6 w-6 text-gray-600" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-500">
                      <Sparkles className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <span
                  className={`text-center text-xs ${isActive ? 'font-semibold text-black' : 'text-gray-600'}`}
                >
                  {category.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full px-4 pt-4 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {visibleProducts.map(product => (
            <CleanMarketplaceProductCard
              key={product.id}
              product={product}
              colors={colors}
              fonts={fonts}
            />
          ))}
        </div>

        {displayFiltered.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-12 text-center text-sm text-gray-500">
            {t.store.noProducts}
          </div>
        ) : null}

        {displayFiltered.length > visibleProducts.length ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount(current => current + 10)}
              className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 ease-in-out hover:border-gray-400 hover:bg-gray-50"
              style={{ fontFamily: fonts.heading }}
            >
              عرض المزيد
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
