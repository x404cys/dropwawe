// THEME: glassmorphism — StoreSection

'use client';

import { Package } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { StoreSectionProps } from '../../../_lib/types';
import { getCategoryIcon } from '../../../_utils/icons';
import GlassmorphismBannerCarousel from '../components/BannerCarousel';
import GlassmorphismProductCard from '../components/ProductCard';
import GlassmorphismSearchBar from '../components/SearchBar';

export default function GlassmorphismStoreSection({
  products,
  template,
  colors,
  fonts,
  centerBanners = [],
}: StoreSectionProps) {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(
    () => ['الكل', ...Array.from(new Set(products.map(product => product.category)))],
    [products]
  );

  const filteredProducts = useMemo(
    () =>
      products.filter(product => {
        const matchCat = activeCategory === 'الكل' || product.category === activeCategory;
        const matchSearch =
          !searchQuery ||
          product.name.includes(searchQuery) ||
          (product.description?.includes(searchQuery) ?? false);
        return matchCat && matchSearch;
      }),
    [activeCategory, products, searchQuery]
  );

  const productDisplayMode = template.categoryDisplayMode === 'icons' ? 'icons' : 'pills';
  const gridItems = filteredProducts.flatMap((product, index) => {
    const items: Array<{
      type: 'product' | 'banner';
      id: string;
      productId?: string;
      bannerIndex?: number;
    }> = [{ type: 'product', id: product.id, productId: product.id }];

    if ((index + 1) % 10 === 0 && centerBanners.length > 0) {
      items.push({
        type: 'banner',
        id: `banner-${index}`,
        bannerIndex: Math.floor(index / 10) % centerBanners.length,
      });
    }

    return items;
  });

  return (
    <section
      id="store-section"
      className="relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at top, ${colors.primary}15 0%, transparent 60%), radial-gradient(ellipse at bottom right, ${colors.accent}10 0%, transparent 50%), ${colors.bg}`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -end-40 top-20 h-80 w-80 rounded-full opacity-15 blur-[128px]"
          style={{ backgroundColor: colors.primary }}
        />
        <div
          className="absolute -start-40 bottom-20 h-72 w-72 rounded-full opacity-10 blur-[128px]"
          style={{ backgroundColor: colors.accent }}
        />
      </div>

      <div className="relative z-[1] mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p
            className="text-xs tracking-widest text-white/35 uppercase"
            style={{ fontFamily: fonts.body }}
          >
            المنتجات
          </p>
          <span className="text-xs text-white/20" style={{ fontFamily: fonts.body }}>
            {filteredProducts.length} عنصر
          </span>
        </div>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map(category => {
              const iconItem = template.categoryIcons.find(item => item.category === category);
              const Icon = iconItem?.icon ? getCategoryIcon(iconItem.icon) : Package;
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`shrink-0 rounded-xl border border-white/[0.08] px-4 py-2 text-xs transition-all duration-200 ease-in-out ${
                    productDisplayMode === 'icons'
                      ? 'flex flex-col items-center gap-2'
                      : 'text-white/50'
                  } ${
                    isActive
                      ? 'border-white/[0.18] bg-white/[0.10] text-white/90'
                      : 'bg-white/[0.04] hover:bg-white/[0.08]'
                  }`}
                  style={
                    isActive
                      ? {
                          borderColor: `${colors.accent}50`,
                          color: colors.accent,
                          fontFamily: fonts.body,
                        }
                      : { fontFamily: fonts.body }
                  }
                >
                  {productDisplayMode === 'icons' ? (
                    <>
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
                        {iconItem?.image ? (
                          <img
                            src={iconItem.image}
                            alt={category}
                            className="h-full w-full rounded-xl object-cover"
                          />
                        ) : (
                          <Icon className="h-4 w-4 text-white/60" />
                        )}
                      </span>
                      <span>{category}</span>
                    </>
                  ) : (
                    <span>{category}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="w-full lg:max-w-sm">
            <GlassmorphismSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              colors={colors}
              fonts={fonts}
            />
          </div>
        </div>

        {centerBanners.length > 0 ? (
          <div className="mb-6 lg:hidden">
            <GlassmorphismBannerCarousel banners={centerBanners} colors={colors} />
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {gridItems.map(item => {
            if (item.type === 'banner' && typeof item.bannerIndex === 'number') {
              return (
                <div
                  key={item.id}
                  className="col-span-full overflow-hidden rounded-2xl border border-white/10"
                >
                  <div className="aspect-[3/1] bg-white/[0.04]">
                    <img
                      src={centerBanners[item.bannerIndex]}
                      alt="Banner"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              );
            }

            return (
              <GlassmorphismProductCard
                key={item.id}
                product={products.find(product => product.id === item.productId)!}
                colors={colors}
                fonts={fonts}
              />
            );
          })}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-white/[0.12] bg-white/[0.06] px-6 py-12 text-center text-sm text-white/50 backdrop-blur-2xl">
            لا توجد منتجات مطابقة
          </div>
        ) : null}
      </div>
    </section>
  );
}
