// Purpose: useStorefront hook — manages active category, search query,
// derived category list, and filtered product results.

'use client';

import { useState, useMemo } from 'react';
import { StorefrontProduct } from '../_lib/types';

export function useStorefront(products: StorefrontProduct[]) {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  const displayCategories = useMemo(
    () => ['الكل', ...Array.from(new Set(products.map((p) => p.category ?? 'عام')))],
    [products]
  );

  const displayFiltered = useMemo(
    () =>
      products.filter((p) => {
        const matchCat =
          activeCategory === 'الكل' || (p.category ?? 'عام') === activeCategory;
        const matchSearch =
          !searchQuery ||
          p.name.includes(searchQuery) ||
          (p.description ?? '').includes(searchQuery);
        return matchCat && matchSearch;
      }),
    [products, activeCategory, searchQuery]
  );

  const getProductsByCat = (cat: string) =>
    products.filter((p) => (p.category ?? 'عام') === cat);

  return {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    displayCategories,
    displayFiltered,
    getProductsByCat,
  };
}
