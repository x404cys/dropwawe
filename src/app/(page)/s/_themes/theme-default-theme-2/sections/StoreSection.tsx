'use client';

import { Package } from 'lucide-react';
import { useMemo } from 'react';

import type { StoreSectionProps } from '../../../_lib/types';
import { useStorefront } from '../../../_hooks/useStorefront';
import DefaultThemeBannerCarousel from '../components/BannerCarousel';
import DefaultThemeProductCard from '../components/ProductCard';
import DefaultThemeSearchBar from '../components/SearchBar';
import {
  storefrontContainerClass,
  storefrontSectionClass,
  storefrontTitleClass,
} from '../themeSystem';

function renderBanner(banners: string[], key: string) {
  if (banners.length === 0) return null;

  return (
    <div key={key} className="overflow-hidden rounded-xl">
      <DefaultThemeBannerCarousel banners={banners} colors={{ primary: '', accent: '', bg: '', text: '' }} />
    </div>
  );
}

export default function DefaultThemeStoreSection({
  products,
  template,
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

  const sectionCategories = useMemo(
    () =>
      enabledCategorySections
        .filter(section => section.enabled !== false)
        .sort((a, b) => a.order - b.order),
    [enabledCategorySections]
  );

  const navigationCategories = useMemo(() => {
    const configured = sectionCategories.map(section => ({
      key: section.category,
      label: section.category,
    }));

    const fallback = displayCategories.filter(category => category.key !== allCategoryKey);
    const merged = (configured.length > 0 ? configured : fallback).filter(
      (category, index, list) => list.findIndex(item => item.key === category.key) === index
    );

    return [{ key: allCategoryKey, label: 'الكل' }, ...merged];
  }, [allCategoryKey, displayCategories, sectionCategories]);

  const activeCategoryLabel =
    navigationCategories.find(category => category.key === activeCategory)?.label ?? 'الكل';

  const showSectionRows =
    sectionCategories.length > 0 && activeCategory === allCategoryKey && !searchQuery.trim();

  const remainingProducts = useMemo(() => {
    const sectionKeys = new Set(sectionCategories.map(section => section.category));
    return products.filter(product => !sectionKeys.has(product.category));
  }, [products, sectionCategories]);

  const introText =
    template.storeDescription?.trim() || 'تصفح مجموعة مرتبة بعناية بتجربة بسيطة وسريعة وواضحة.';

  return (
    <section id="store-section" className={storefrontSectionClass}>
      <div className={storefrontContainerClass}>
        {upStoreBanners.length > 0 ? (
          <div className="mb-10 overflow-hidden rounded-xl">
            <DefaultThemeBannerCarousel banners={upStoreBanners} colors={{ primary: '', accent: '', bg: '', text: '' }} />
          </div>
        ) : null}

        <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-end">
          <div className="space-y-3">
            <span
              className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.12em] uppercase"
              style={{
                backgroundColor: 'var(--store-primary-faint)',
                color: 'var(--store-primary)',
              }}
            >
              Store
            </span>

            <div className="space-y-3">
              <h2 className={storefrontTitleClass} style={{ fontFamily: fonts.heading }}>
                منتجات مرتبة لتجربة تسوق أوضح
              </h2>
              <p
                className="max-w-2xl text-sm leading-7 sm:text-base sm:leading-8"
                style={{ color: 'var(--store-text-muted)' }}
              >
                {introText}
              </p>
            </div>
          </div>

          <div id="store-search">
            <DefaultThemeSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              colors={{ primary: '', accent: '', bg: '', text: '' }}
              fonts={fonts}
            />
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {navigationCategories.map(category => {
            const isActive = activeCategory === category.key;

            return (
              <button
                key={category.key}
                type="button"
                onClick={() => setActiveCategory(category.key)}
                className="rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200"
                style={
                  isActive
                    ? {
                        backgroundColor: 'var(--store-text)',
                        color: 'var(--store-bg)',
                      }
                    : {
                        backgroundColor: 'var(--store-surface)',
                        color: 'var(--store-text-muted)',
                      }
                }
              >
                {category.label}
              </button>
            );
          })}
        </div>

        <div className="mb-10 flex flex-wrap items-center justify-between gap-3 text-sm">
          <p style={{ color: 'var(--store-text-soft)' }}>
            {activeCategoryLabel} · {displayFiltered.length} منتج
          </p>

          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="font-medium transition-colors duration-200"
              style={{ color: 'var(--store-text-muted)' }}
            >
              مسح البحث
            </button>
          ) : null}
        </div>

        {centerBanners.length > 0 ? (
          <div className="mb-12 overflow-hidden rounded-xl">
            <DefaultThemeBannerCarousel banners={centerBanners} colors={{ primary: '', accent: '', bg: '', text: '' }} />
          </div>
        ) : null}

        {showSectionRows ? (
          <div className="space-y-16">
            {sectionCategories.map((section, index) => {
              const productsInCategory = getProductsByCat(section.category);
              if (productsInCategory.length === 0) return null;

              return (
                <div key={section.id} className="space-y-8">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-[11px] font-medium tracking-[0.16em] uppercase" style={{ color: 'var(--store-text-faint)' }}>
                        Collection
                      </p>
                      <h3
                        className="text-2xl font-bold tracking-[-0.02em] sm:text-[2rem]"
                        style={{ fontFamily: fonts.heading }}
                      >
                        {section.category}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveCategory(section.category)}
                      className="text-sm font-medium transition-colors duration-200"
                      style={{ color: 'var(--store-text-muted)' }}
                    >
                      عرض المجموعة كاملة
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                    {productsInCategory.map(product => (
                      <DefaultThemeProductCard
                        key={product.id}
                        product={product}
                        colors={{ primary: '', accent: '', bg: '', text: '' }}
                        fonts={fonts}
                      />
                    ))}
                  </div>

                  {btwCatBanners[index] ? (
                    <div className="overflow-hidden rounded-xl">
                      <DefaultThemeBannerCarousel
                        banners={[btwCatBanners[index]]}
                        colors={{ primary: '', accent: '', bg: '', text: '' }}
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}

            {remainingProducts.length > 0 ? (
              <div className="space-y-8">
                <div className="space-y-2">
                  <p className="text-[11px] font-medium tracking-[0.16em] uppercase" style={{ color: 'var(--store-text-faint)' }}>
                    More
                  </p>
                  <h3
                    className="text-2xl font-bold tracking-[-0.02em] sm:text-[2rem]"
                    style={{ fontFamily: fonts.heading }}
                  >
                    اكتشف المزيد
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                  {remainingProducts.map(product => (
                    <DefaultThemeProductCard
                      key={product.id}
                      product={product}
                      colors={{ primary: '', accent: '', bg: '', text: '' }}
                      fonts={fonts}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : displayFiltered.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {displayFiltered.map(product => (
              <DefaultThemeProductCard
                key={product.id}
                product={product}
                colors={{ primary: '', accent: '', bg: '', text: '' }}
                fonts={fonts}
              />
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-3 rounded-xl border px-6 py-16 text-center"
            style={{
              backgroundColor: 'var(--store-surface)',
              borderColor: 'var(--store-border)',
              color: 'var(--store-text-muted)',
            }}
          >
            <Package className="h-10 w-10" />
            <p className="text-sm font-medium">لا توجد منتجات مطابقة حالياً</p>
          </div>
        )}
      </div>
    </section>
  );
}
