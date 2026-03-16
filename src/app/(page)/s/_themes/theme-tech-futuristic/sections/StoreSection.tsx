// THEME: tech-futuristic - StoreSection

'use client';

import { Package } from 'lucide-react';
import { type CSSProperties } from 'react';
import type {
  StoreSectionProps,
  StorefrontCategorySection,
  StorefrontProduct,
} from '../../../_lib/types';
import { useLanguage } from '../../../_context/LanguageContext';
import { useStorefront } from '../../../_hooks/useStorefront';
import TechFuturisticBannerCarousel from '../components/BannerCarousel';
import TechFuturisticProductCard from '../components/ProductCard';
import TechFuturisticSearchBar from '../components/SearchBar';

function ProductGrid({
  products,
  colors,
  fonts,
}: {
  products: StorefrontProduct[];
  colors: StoreSectionProps['colors'];
  fonts: StoreSectionProps['fonts'];
}) {
  return (
    <div className="grid grid-cols-2 gap-px bg-[#161616] md:grid-cols-3 xl:grid-cols-4">
      {products.map(product => (
        <TechFuturisticProductCard
          key={product.id}
          product={product}
          colors={colors}
          fonts={fonts}
        />
      ))}
    </div>
  );
}

function CategoryBlock({
  section,
  products,
  colors,
  fonts,
}: {
  section: StorefrontCategorySection;
  products: StorefrontProduct[];
  colors: StoreSectionProps['colors'];
  fonts: StoreSectionProps['fonts'];
}) {
  if (products.length === 0) return null;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4 border-b border-white/[0.06] pb-3">
        <p
          className="font-mono text-xs tracking-[0.22em] text-white/30 uppercase"
          style={{ fontFamily: fonts.body }}
        >
          {section.category}
        </p>
        <span
          className="font-mono text-[11px] tracking-[0.18em] text-white/25 uppercase"
          style={{ fontFamily: fonts.body }}
        >
          {products.length} ITEMS
        </span>
      </div>
      <ProductGrid products={products} colors={colors} fonts={fonts} />
    </div>
  );
}

export default function TechFuturisticStoreSection({
  products,
  template,
  colors,
  fonts,
  enabledCategorySections,
  centerBanners = [],
}: StoreSectionProps) {
  const { t } = useLanguage();
  const accentVars = { ['--tech-accent' as string]: colors.accent } as CSSProperties;
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
    <section
      id="store-section"
      className="border-b border-white/[0.06] bg-[#080808]"
      style={accentVars}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="flex flex-col gap-3 border-b border-white/[0.06] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p
              className="font-mono text-xs tracking-[0.24em] text-white/30 uppercase"
              style={{ fontFamily: fonts.body }}
            >
              PRODUCTS - {displayFiltered.length} ITEMS
            </p>
            <h2
              className="mt-3 font-mono text-3xl font-light tracking-tight text-[#f2f2f2] lg:text-5xl"
              style={{ fontFamily: fonts.heading }}
            >
              {t.nav.store}
            </h2>
          </div>
        </div>

        <div className="mt-8">
          <TechFuturisticSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            colors={colors}
            fonts={fonts}
          />
        </div>

        {centerBanners.length > 0 ? (
          <div className="mt-8">
            <TechFuturisticBannerCarousel banners={centerBanners} colors={colors} />
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-2">
          {displayCategories.map(category => {
            const isActive = activeCategory === category.key;

            return (
              <button
                key={category.key}
                type="button"
                onClick={() => setActiveCategory(category.key)}
                className="border border-white/[0.08] px-4 py-2 font-mono text-xs tracking-[0.2em] text-white/45 uppercase transition-all duration-150 ease-out hover:border-white/[0.15]"
                style={
                  isActive
                    ? {
                        borderColor: colors.accent,
                        color: colors.accent,
                        fontFamily: fonts.body,
                      }
                    : { fontFamily: fonts.body }
                }
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {/* DESIGN: The catalog grid uses gap-px on a darker parent so the layout reads as a visible product matrix. */}
        <div className="mt-10 space-y-12">
          {showCategoryRows ? (
            <>
              {enabledCategorySections.map(section => (
                <CategoryBlock
                  key={section.id}
                  section={section}
                  products={getProductsByCat(section.category)}
                  colors={colors}
                  fonts={fonts}
                />
              ))}

              {(() => {
                const sectionCategories = new Set(
                  enabledCategorySections.map(section => section.category)
                );
                const remainingProducts = products.filter(
                  product => !sectionCategories.has(getProductCategory(product))
                );

                if (remainingProducts.length === 0) return null;

                return (
                  <CategoryBlock
                    section={{
                      id: 'other',
                      category: t.store.otherProducts,
                      enabled: true,
                      order: 999,
                    }}
                    products={remainingProducts}
                    colors={colors}
                    fonts={fonts}
                  />
                );
              })()}
            </>
          ) : displayFiltered.length > 0 ? (
            <ProductGrid products={displayFiltered} colors={colors} fonts={fonts} />
          ) : (
            <div className="grid min-h-56 place-items-center border border-white/[0.06] bg-[#0f0f0f] text-center">
              <div>
                <Package className="mx-auto h-8 w-8 text-white/20" />
                <p
                  className="mt-4 font-mono text-sm text-white/35"
                  style={{ fontFamily: fonts.body }}
                >
                  {t.store.noProducts}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
