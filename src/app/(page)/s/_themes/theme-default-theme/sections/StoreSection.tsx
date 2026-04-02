// THEME: default-theme - StoreSection

'use client';

import { ChevronLeft, Package } from 'lucide-react';
import { useMemo } from 'react';
import type { StoreSectionProps } from '../../../_lib/types';
import { useStorefront } from '../../../_hooks/useStorefront';
import { useLanguage } from '../../../_context/LanguageContext';
import { getCategoryIcon } from '../../../_utils/icons';
import DefaultThemeBannerCarousel from '../components/BannerCarousel';
import DefaultThemeProductCard from '../components/ProductCard';
import DefaultThemeSearchBar from '../components/SearchBar';
import { getReadableTextColor } from '../themeSystem';

export default function DefaultThemeStoreSection({
  products,
  template,
  colors,
  fonts,
  enabledCategorySections,
  centerBanners = [],
  upStoreBanners = [],
  btwCatBanners = [],
}: StoreSectionProps) {
  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    displayCategories,
    displayFiltered,
    getProductsByCat,
    allCategoryKey,
  } = useStorefront(products);
  const { t } = useLanguage();

  const sectionCategories = useMemo(
    () =>
      enabledCategorySections
        .filter(section => section.enabled !== false)
        .sort((a, b) => a.order - b.order),
    [enabledCategorySections]
  );

  const navigationCategories = useMemo(() => {
    const fallback = displayCategories.filter(category => category.key !== allCategoryKey);
    const configured = sectionCategories.map(section => ({
      key: section.category,
      label: section.category,
    }));
    const merged = (configured.length > 0 ? configured : fallback).filter(
      (category, index, list) => list.findIndex(item => item.key === category.key) === index
    );

    return [{ key: allCategoryKey, label: t.store.all }, ...merged];
  }, [allCategoryKey, displayCategories, sectionCategories, t]);

  const showSectionRows =
    sectionCategories.length > 0 && activeCategory === allCategoryKey && !searchQuery.trim();

  const remainingProducts = useMemo(() => {
    const sectionKeys = new Set(sectionCategories.map(section => section.category));
    return products.filter(product => !sectionKeys.has(product.category));
  }, [products, sectionCategories]);
  const primaryTextColor = getReadableTextColor(colors.primary);

  return (
    <section id="store-section" className="py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {upStoreBanners.length > 0 ? (
          <div
            className="mb-8 overflow-hidden rounded-3xl border"
            style={{ borderColor: 'var(--store-border)' }}
          >
            <DefaultThemeBannerCarousel banners={upStoreBanners} colors={colors} />
          </div>
        ) : null}
        {/* DESIGN: The store block copies the reference browsing flow: centered search, icon/pill categories, then sectional rows or a regular grid. */}
        <div id="store-search" className="mx-auto mb-6 max-w-md">
          <DefaultThemeSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            colors={colors}
            fonts={fonts}
          />
        </div>

        {centerBanners.length > 0 ? (
          <div
            className="mb-8 overflow-hidden rounded-3xl border"
            style={{ borderColor: 'var(--store-border)' }}
          >
            <DefaultThemeBannerCarousel banners={centerBanners} colors={colors} />
          </div>
        ) : null}
        {template.categoryDisplayMode === 'icons' ? (
          <div className="mb-6 flex justify-start gap-4 overflow-x-auto px-2 pb-4 sm:justify-center">
            {navigationCategories.map(category => {
              const iconItem = template.categoryIcons.find(
                item => item.category === category.label || item.category === category.key
              );
              const Icon =
                category.key === allCategoryKey
                  ? Package
                  : getCategoryIcon(iconItem?.icon || 'Package');
              const isActive = activeCategory === category.key;

              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => setActiveCategory(category.key)}
                  className="flex min-w-[60px] flex-shrink-0 flex-col items-center gap-1.5 transition-all"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border-2 transition-all ${''}`}
                    style={
                      isActive
                        ? {
                            borderColor: 'var(--store-primary)',
                            backgroundColor: 'var(--store-primary-faint)',
                          }
                        : {
                            borderColor: 'var(--store-border)',
                            backgroundColor: 'var(--store-surface)',
                          }
                    }
                  >
                    {iconItem?.image ? (
                      <img
                        src={iconItem.image}
                        alt={category.label}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Icon
                        className="h-6 w-6"
                        style={{
                          color: isActive ? 'var(--store-primary)' : 'var(--store-text-muted)',
                        }}
                      />
                    )}
                  </div>
                  <span
                    className="text-[10px] font-semibold"
                    style={{ color: isActive ? 'var(--store-primary)' : 'var(--store-text-muted)' }}
                  >
                    {category.label}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mb-6 flex justify-center gap-2 overflow-x-auto pb-3">
            {navigationCategories.map(category => {
              const isActive = activeCategory === category.key;
              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => setActiveCategory(category.key)}
                  className={`flex-shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 ease-in-out ${
                    isActive ? '' : 'border'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: 'var(--store-primary)',
                          color: primaryTextColor,
                          fontFamily: fonts.heading,
                        }
                      : {
                          backgroundColor: 'var(--store-surface)',
                          borderColor: 'var(--store-border)',
                          color: 'var(--store-text-muted)',
                          fontFamily: fonts.heading,
                        }
                  }
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        )}

        {showSectionRows ? (
          <div className="space-y-8">
            {sectionCategories.map((section, index) => {
              const productsInCategory = getProductsByCat(section.category);
              if (productsInCategory.length === 0) return null;

              const iconItem = template.categoryIcons.find(
                item => item.category === section.category
              );
              const CategoryIcon = getCategoryIcon(iconItem?.icon || 'Package');

              return (
                <div key={section.id}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-xl"
                        style={{ backgroundColor: 'var(--store-primary-faint)' }}
                      >
                        <CategoryIcon
                          className="h-4 w-4"
                          style={{ color: 'var(--store-primary)' }}
                        />
                      </div>
                      <h3
                        className="text-sm font-bold"
                        style={{ color: 'var(--store-text)', fontFamily: fonts.heading }}
                      >
                        {section.category}
                      </h3>
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px]"
                        style={{
                          backgroundColor: 'var(--store-surface-strong)',
                          color: 'var(--store-text-muted)',
                        }}
                      >
                        {productsInCategory.length}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveCategory(section.category)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold"
                      style={{ color: colors.primary }}
                    >
                      {t.store.viewAll} <ChevronLeft className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 overflow-x-auto pb-2 md:grid-cols-4">
                    {productsInCategory.map(product => (
                      <DefaultThemeProductCard
                        key={product.id}
                        product={product}
                        colors={colors}
                        fonts={fonts}
                      />
                    ))}
                  </div>
                  {index === 0 && btwCatBanners.length > 0 && (
                    <div
                      className="mt-8 overflow-hidden rounded-3xl border"
                      style={{ borderColor: 'var(--store-border)' }}
                    >
                      <DefaultThemeBannerCarousel banners={btwCatBanners} colors={colors} />
                    </div>
                  )}
                </div>
              );
            })}

            {remainingProducts.length > 0 ? (
              <div>
                <h3
                  className="mb-3 text-sm font-bold"
                  style={{ color: 'var(--store-text)', fontFamily: fonts.heading }}
                >
                  {t.store.otherProducts}
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                  {remainingProducts.map(product => (
                    <DefaultThemeProductCard
                      key={product.id}
                      product={product}
                      colors={colors}
                      fonts={fonts}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {displayFiltered.map(product => (
              <DefaultThemeProductCard
                key={product.id}
                product={product}
                colors={colors}
                fonts={fonts}
              />
            ))}
          </div>
        )}

        {displayFiltered.length === 0 && !showSectionRows ? (
          <div className="py-16 text-center">
            <Package
              className="mx-auto mb-3 h-12 w-12"
              style={{ color: 'var(--store-text-faint)' }}
            />
            <p className="text-sm" style={{ color: 'var(--store-text-muted)' }}>
              {t.store.noProducts}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

