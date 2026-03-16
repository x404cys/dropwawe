'use client';

import { Package } from 'lucide-react';
import {
  ActiveColors,
  StorefrontCategorySection,
  StorefrontProduct,
  StorefrontTemplate,
} from '../../_lib/types';
import { useStorefront } from '../../_hooks/useStorefront';
import BannerCarousel from '../BannerCarousel';
import SearchBar from '../store/SearchBar';
import CategoryIcons from '../store/CategoryIcons';
import CategoryPills from '../store/CategoryPills';
import CategoryRow from '../store/CategoryRow';
import ProductCard from '../store/ProductCard';
import { useLanguage } from '../../_context/LanguageContext';

interface StoreSectionProps {
  products: StorefrontProduct[];
  template: StorefrontTemplate;
  colors: ActiveColors;
  headingStyle: React.CSSProperties;
  enabledCategorySections: StorefrontCategorySection[];
  centerBanners?: string[];
}

export default function StoreSection({
  products,
  template,
  colors,
  headingStyle,
  enabledCategorySections,
  centerBanners = [],
}: StoreSectionProps) {
  const { t } = useLanguage();
  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    displayCategories,
    displayFiltered,
    getProductsByCat,
    getProductCategory,
    isAllCategory,
  } = useStorefront(products);

  const showCategoryRows = enabledCategorySections.length > 0 && isAllCategory && !searchQuery;

  return (
    <section id="store-section" className="border-b border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
        <div className="mb-12 max-w-2xl">
          <p
            className="text-xs font-light tracking-[0.32em] uppercase opacity-40"
            style={{ color: colors.text }}
          >
            {t.nav.store}
          </p>
          <h2
            // REDESIGN: storefront heading is simplified to a single monumental line.
            className="mt-6 text-4xl font-thin tracking-tight lg:text-6xl"
            style={{ ...headingStyle, color: colors.text }}
          >
            {t.nav.store}
          </h2>
        </div>

        <SearchBar value={searchQuery} onChange={setSearchQuery} colors={colors} />

        {centerBanners.length > 0 ? (
          <div className="mb-12">
            <BannerCarousel banners={centerBanners} colors={colors} />
          </div>
        ) : null}

        {template.categoryDisplayMode === 'icons' ? (
          <CategoryIcons
            categories={displayCategories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
            categoryIcons={template.categoryIcons}
            colors={colors}
          />
        ) : (
          <CategoryPills
            categories={displayCategories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
            colors={colors}
          />
        )}

        {showCategoryRows ? (
          <div className="space-y-16">
            {enabledCategorySections.map(section => (
              <CategoryRow
                key={section.id}
                category={section.category}
                products={getProductsByCat(section.category)}
                colors={colors}
                headingStyle={headingStyle}
                categoryIcons={template.categoryIcons}
                onViewAll={setActiveCategory}
              />
            ))}

            {(() => {
              const usedCategories = new Set(
                enabledCategorySections.map(section => section.category)
              );
              const remainingProducts = products.filter(
                product => !usedCategories.has(getProductCategory(product))
              );

              if (remainingProducts.length === 0) return null;

              return (
                <div className="space-y-8 border-t border-white/10 pt-10">
                  <div>
                    <p
                      className="text-[10px] font-light tracking-[0.3em] uppercase opacity-45"
                      style={{ color: colors.text }}
                    >
                      {t.store.otherProducts}
                    </p>
                    <h3
                      className="mt-4 text-2xl font-light tracking-tight lg:text-3xl"
                      style={{ ...headingStyle, color: colors.text }}
                    >
                      {t.store.otherProducts}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-4">
                    {remainingProducts.map(product => (
                      <ProductCard key={product.id} product={product} colors={colors} />
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        ) : displayFiltered.length > 0 ? (
          <div
            // REDESIGN: products move to an editorial grid with tight gutters and no decorative cards.
            className="grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-4"
          >
            {displayFiltered.map(product => (
              <ProductCard key={product.id} product={product} colors={colors} />
            ))}
          </div>
        ) : (
          <div className="border border-white/10 bg-white/[0.02] px-6 py-16 text-center">
            <Package className="mx-auto h-8 w-8 opacity-30" style={{ color: colors.text }} />
            <p className="mt-4 text-sm font-light opacity-60" style={{ color: colors.text }}>
              {t.store.noProducts}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
