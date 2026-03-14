// Purpose: Store section - "use client". Orchestrates search bar, category filter,
// category rows, and product grid. Reads/writes cart via CartContext.
// Matches Storefront.tsx case "store" exactly.

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

  const showCategoryRows =
    enabledCategorySections.length > 0 && isAllCategory && !searchQuery;

  return (
    <section id="store-section" className="py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Search */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {centerBanners.length > 0 && (
          <div className="my-4">
            <BannerCarousel banners={centerBanners} colors={colors} />
          </div>
        )}

        {/* Category filter */}
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

        {/* Products content */}
        {showCategoryRows ? (
          <div className="space-y-8">
            {/* Per-category rows */}
            {enabledCategorySections.map((cs) => (
              <CategoryRow
                key={cs.id}
                category={cs.category}
                products={getProductsByCat(cs.category)}
                colors={colors}
                headingStyle={headingStyle}
                categoryIcons={template.categoryIcons}
                onViewAll={setActiveCategory}
              />
            ))}

            {/* Remaining products not in any category section */}
            {(() => {
              const sectionCats = enabledCategorySections.map((cs) => cs.category);
              const remaining = products.filter(
                (p) => !sectionCats.includes(getProductCategory(p))
              );
              if (remaining.length === 0) return null;
              return (
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-3" style={headingStyle}>
                    {t.store.otherProducts}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {remaining.map((product) => (
                      <ProductCard key={product.id} product={product} colors={colors} />
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          /* Regular grid when category is selected or search is active */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {displayFiltered.map((product) => (
              <ProductCard key={product.id} product={product} colors={colors} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {displayFiltered.length === 0 && (!isAllCategory || searchQuery) && (
          <div className="text-center py-16">
            <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground">{t.store.noProducts}</p>
          </div>
        )}
      </div>
    </section>
  );
}
