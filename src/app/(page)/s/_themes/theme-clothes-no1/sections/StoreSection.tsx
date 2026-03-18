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
    <div className="grid grid-cols-2 gap-px md:grid-cols-3 xl:grid-cols-4">
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
      <div
        className="flex items-end justify-between gap-4 border-b pb-3"
        style={{ borderColor: colors.text + '0f' }}
      >
        <p
          className="font-mono text-xs tracking-[0.22em] uppercase"
          style={{ fontFamily: fonts.body, color: colors.text  }}
        >
          {section.category}
        </p>
 
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
      className="border-b"
      style={{
        ...accentVars,
        background: colors.bg,
        borderColor: colors.text + '0f',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        {/* ── HEADER ── */}
        <div
          className="flex flex-col gap-3 border-b pb-6 lg:flex-row lg:items-end lg:justify-between"
          style={{ borderColor: colors.text + '0f' }}
        >
          <div>
            <p
              className="font-mono text-xs tracking-[0.24em] uppercase"
              style={{ fontFamily: fonts.body, color: colors.text + '4d' }}
            >
              PRODUCTS — {displayFiltered.length} ITEMS
            </p>
            <h2
              className="mt-3 font-mono text-3xl font-light tracking-tight lg:text-5xl"
              style={{ fontFamily: fonts.heading, color: colors.text }}
            >
              {t.nav.store}
            </h2>
          </div>
        </div>

        {/* ── SEARCH ── */}
        <div className="mt-8">
          <TechFuturisticSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            colors={colors}
            fonts={fonts}
          />
        </div>

        {/* ── CENTER BANNERS ── */}
        {centerBanners.length > 0 && (
          <div className="mt-8">
            <TechFuturisticBannerCarousel banners={centerBanners} colors={colors} />
          </div>
        )}

        {/* ── CATEGORY FILTERS ── */}
        <div className="mt-8 flex flex-wrap gap-2">
          {displayCategories.map(category => {
            const isActive = activeCategory === category.key;
            return (
              <button
                key={category.key}
                type="button"
                onClick={() => setActiveCategory(category.key)}
                className="border px-4 py-2 font-mono text-xs tracking-[0.2em] uppercase transition-all duration-150 ease-out"
                style={
                  isActive
                    ? {
                        borderColor: colors.accent,
                        color: colors.accent,
                        fontFamily: fonts.body,
                        background: colors.accent + '0f',
                      }
                    : {
                        borderColor: colors.text + '14',
                        color: colors.text + '73',
                        fontFamily: fonts.body,
                        background: 'transparent',
                      }
                }
                onMouseEnter={e => {
                  if (!isActive) {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = colors.text + '26';
                    el.style.color = colors.text + 'b3';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = colors.text + '14';
                    el.style.color = colors.text + '73';
                  }
                }}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {/* ── PRODUCTS ── */}
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
                const sectionCategories = new Set(enabledCategorySections.map(s => s.category));
                const remainingProducts = products.filter(
                  p => !sectionCategories.has(getProductCategory(p))
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
            /* ── EMPTY STATE ── */
            <div
              className="grid min-h-56 place-items-center border text-center"
              style={{
                borderColor: colors.text + '0f',
                background: colors.text + '05',
              }}
            >
              <div>
                <Package className="mx-auto h-8 w-8" style={{ color: colors.text + '33' }} />
                <p
                  className="mt-4 font-mono text-sm"
                  style={{ fontFamily: fonts.body, color: colors.text + '59' }}
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
