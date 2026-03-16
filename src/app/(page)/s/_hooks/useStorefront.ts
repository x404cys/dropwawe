// Purpose: useStorefront hook - manages active category, search query,
// derived category list, and filtered product results.

'use client';

import { useCallback, useMemo, useState } from 'react';
import { StorefrontProduct } from '../_lib/types';
import { useLanguage } from '../_context/LanguageContext';

export type StorefrontCategoryOption = {
  key: string;
  label: string;
  isAll?: boolean;
};

const ALL_CATEGORY_KEY = '__all__';
const GENERAL_CATEGORY_KEY = '__general__';

export function useStorefront(products: StorefrontProduct[]) {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY_KEY);
  const [searchQuery, setSearchQuery] = useState('');

  const getProductCategory = useCallback(
    (product: StorefrontProduct) => product.category ?? GENERAL_CATEGORY_KEY,
    []
  );

  const resolveCategoryLabel = useCallback(
    (category: string) => {
      if (category === GENERAL_CATEGORY_KEY) return t.store.general;
      return category;
    },
    [t.store.general]
  );

  const displayCategories = useMemo(() => {
    const uniqueCats = Array.from(new Set(products.map(getProductCategory)));
    return [
      { key: ALL_CATEGORY_KEY, label: t.store.all, isAll: true },
      ...uniqueCats.map(cat => ({ key: cat, label: resolveCategoryLabel(cat) })),
    ];
  }, [getProductCategory, products, resolveCategoryLabel, t.store.all]);

  const displayFiltered = useMemo(
    () =>
      products.filter(p => {
        const matchCat =
          activeCategory === ALL_CATEGORY_KEY || getProductCategory(p) === activeCategory;
        const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
        const matchSearch =
          !normalizedQuery ||
          p.name.toLocaleLowerCase().includes(normalizedQuery) ||
          (p.description ?? '').toLocaleLowerCase().includes(normalizedQuery);
        return matchCat && matchSearch;
      }),
    [activeCategory, getProductCategory, products, searchQuery]
  );

  const getProductsByCat = useCallback(
    (cat: string) => products.filter(p => getProductCategory(p) === cat),
    [getProductCategory, products]
  );

  const isAllCategory = activeCategory === ALL_CATEGORY_KEY;

  return {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    displayCategories,
    displayFiltered,
    getProductsByCat,
    getProductCategory,
    isAllCategory,
    allCategoryKey: ALL_CATEGORY_KEY,
  };
}
