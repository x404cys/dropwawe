// THEME: default-theme - StoreSection

'use client';

import { ChevronLeft, Heart, Package, ShoppingCart, Star } from 'lucide-react';
import { useMemo } from 'react';
import type { StoreSectionProps, StorefrontProduct } from '../../../_lib/types';
import { useCart } from '../../../_context/CartContext';
import { useStorefront } from '../../../_hooks/useStorefront';
import { getCategoryIcon } from '../../../_utils/icons';
import { formatPrice, getDiscountedPrice } from '../../../_utils/price';
import DefaultThemeBannerCarousel from '../components/BannerCarousel';
import DefaultThemeProductCard from '../components/ProductCard';
import DefaultThemeSearchBar from '../components/SearchBar';

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
  const { addToCart, liked, setSelectedProduct, toggleLike } = useCart();
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

    return [{ key: allCategoryKey, label: 'الكل' }, ...merged];
  }, [allCategoryKey, displayCategories, sectionCategories]);

  const showSectionRows =
    sectionCategories.length > 0 && activeCategory === allCategoryKey && !searchQuery.trim();

  const remainingProducts = useMemo(() => {
    const sectionKeys = new Set(sectionCategories.map(section => section.category));
    return products.filter(product => !sectionKeys.has(product.category));
  }, [products, sectionCategories]);

  return (
    <section id="store-section" className="py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {upStoreBanners.length > 0 ? (
          <div className="mb-8 overflow-hidden rounded-3xl border border-gray-200 shadow-sm">
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
          <div className="mb-8 overflow-hidden rounded-3xl border border-gray-200 shadow-sm">
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
                    className={`flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border-2 transition-all ${
                      isActive ? 'shadow-md' : 'border-gray-200 bg-white'
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
                        alt={category.label}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Icon
                        className="h-6 w-6"
                        style={{ color: isActive ? colors.primary : '#6b7280' }}
                      />
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-semibold ${isActive ? '' : 'text-gray-500'}`}
                    style={isActive ? { color: colors.primary } : undefined}
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
                    isActive
                      ? 'text-white shadow-sm'
                      : 'border border-gray-200 bg-white text-gray-500 hover:text-gray-900'
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: colors.primary, fontFamily: fonts.heading }
                      : { fontFamily: fonts.heading }
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
                        style={{ backgroundColor: `${colors.primary}15` }}
                      >
                        <CategoryIcon className="h-4 w-4" style={{ color: colors.primary }} />
                      </div>
                      <h3
                        className="text-sm font-bold text-gray-900"
                        style={{ fontFamily: fonts.heading }}
                      >
                        {section.category}
                      </h3>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
                        {productsInCategory.length}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveCategory(section.category)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold"
                      style={{ color: colors.primary }}
                    >
                      عرض الكل <ChevronLeft className="h-3 w-3" />
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
                    <div className="mt-8 overflow-hidden rounded-3xl border border-gray-200 shadow-sm">
                      <DefaultThemeBannerCarousel banners={btwCatBanners} colors={colors} />
                    </div>
                  )}
                </div>
              );
            })}

            {remainingProducts.length > 0 ? (
              <div>
                <h3
                  className="mb-3 text-sm font-bold text-gray-900"
                  style={{ fontFamily: fonts.heading }}
                >
                  منتجات أخرى
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
            <Package className="mx-auto mb-3 h-12 w-12 text-gray-300" />
            <p className="text-sm text-gray-500">لا توجد منتجات</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
