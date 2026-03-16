// THEME: minimal-light — StoreSection

'use client';

import type { ComponentType } from 'react';
import Image from 'next/image';
import { Package } from 'lucide-react';
import type {
  StoreSectionProps,
  StorefrontCategoryIcon,
  StorefrontCategorySection,
  StorefrontProduct,
} from '../../../_lib/types';
import { useStorefront } from '../../../_hooks/useStorefront';
import { useLanguage } from '../../../_context/LanguageContext';
import { getCategoryIcon } from '../../../_utils/icons';
import MinimalLightBannerCarousel from '../components/BannerCarousel';
import MinimalLightProductCard from '../components/ProductCard';
import MinimalLightSearchBar from '../components/SearchBar';

function CategoryFilter({
  label,
  active,
  onClick,
  icon,
  image,
  accent,
  fonts,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: ComponentType<{ className?: string }>;
  image?: string | null;
  accent: string;
  fonts: { body: string };
}) {
  const Icon = icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 border px-4 py-2 text-xs font-medium tracking-[0.16em] uppercase transition-colors duration-200 ${
        active
          ? 'border-stone-900 bg-stone-100 text-stone-950'
          : 'border-stone-200 bg-white text-stone-600'
      }`}
      style={
        active
          ? { borderColor: accent, color: accent, fontFamily: fonts.body }
          : { fontFamily: fonts.body }
      }
    >
      {image ? (
        <span className="relative h-6 w-6 overflow-hidden rounded-full border border-stone-200">
          <Image src={image} alt={label} fill className="object-cover" />
        </span>
      ) : Icon ? (
        <Icon className="h-4 w-4" />
      ) : null}
      <span>{label}</span>
    </button>
  );
}

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
    <div className="grid grid-cols-2 border border-stone-200 md:grid-cols-3 xl:grid-cols-4">
      {products.map(product => (
        <div key={product.id} className="-me-px -mb-px border-e border-b border-stone-200">
          <MinimalLightProductCard product={product} colors={colors} fonts={fonts} />
        </div>
      ))}
    </div>
  );
}

function CategorySectionBlock({
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
      <div className="flex items-center justify-between gap-4">
        <div>
          <p
            className="text-xs font-medium tracking-[0.18em] text-stone-500 uppercase"
            style={{ fontFamily: fonts.body }}
          >
            {section.category}
          </p>
        </div>
      </div>

      <ProductGrid products={products} colors={colors} fonts={fonts} />
    </div>
  );
}

export default function MinimalLightStoreSection({
  products,
  template,
  colors,
  fonts,
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
    <section id="store-section" className="border-b border-stone-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
        <div className="max-w-2xl">
          <p
            className="text-xs font-medium tracking-[0.2em] text-stone-500 uppercase"
            style={{ fontFamily: fonts.body }}
          >
            {t.nav.store}
          </p>
          <h2
            className="mt-4 text-4xl font-medium tracking-tight text-stone-900 lg:text-5xl"
            style={{ fontFamily: fonts.heading }}
          >
            {t.nav.store}
          </h2>
        </div>

        <div className="mt-8">
          <MinimalLightSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            colors={colors}
            fonts={fonts}
          />
        </div>

        {centerBanners.length > 0 ? (
          <div className="mb-8">
            <MinimalLightBannerCarousel banners={centerBanners} colors={colors} />
          </div>
        ) : null}

        <div className="mb-10 flex flex-wrap gap-3">
          {displayCategories.map(category => {
            const iconItem = template.categoryIcons.find(item => item.category === category.key) as
              | StorefrontCategoryIcon
              | undefined;
            const isAllOption = 'isAll' in category && Boolean(category.isAll);
            const Icon = isAllOption ? Package : getCategoryIcon(iconItem?.icon ?? 'Package');

            return (
              <CategoryFilter
                key={category.key}
                label={category.label}
                active={activeCategory === category.key}
                onClick={() => setActiveCategory(category.key)}
                icon={Icon}
                image={iconItem?.image}
                accent={colors.accent}
                fonts={fonts}
              />
            );
          })}
        </div>

        {showCategoryRows ? (
          <div className="space-y-14">
            {enabledCategorySections.map(section => (
              <CategorySectionBlock
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
                <div className="space-y-5">
                  <p
                    className="text-xs font-medium tracking-[0.18em] text-stone-500 uppercase"
                    style={{ fontFamily: fonts.body }}
                  >
                    {t.store.otherProducts}
                  </p>
                  <ProductGrid products={remainingProducts} colors={colors} fonts={fonts} />
                </div>
              );
            })()}
          </div>
        ) : displayFiltered.length > 0 ? (
          <ProductGrid products={displayFiltered} colors={colors} fonts={fonts} />
        ) : (
          <div className="border border-stone-200 bg-stone-50 px-6 py-16 text-center">
            <Package className="mx-auto h-8 w-8 text-stone-300" />
            <p className="mt-4 text-sm text-stone-500" style={{ fontFamily: fonts.body }}>
              {t.store.noProducts}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
