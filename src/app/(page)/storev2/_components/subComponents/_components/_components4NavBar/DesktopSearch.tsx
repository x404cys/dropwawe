'use client';

import { forwardRef, useEffect, useState } from 'react';
import { Product } from '@/types/Products';
import { useRouter } from 'next/navigation';
import { FiSearch } from 'react-icons/fi';
import { TbCategory } from 'react-icons/tb';
import { AiOutlineClose, AiOutlineLoading3Quarters } from 'react-icons/ai'; // أيقونة تحميل

interface DesktopSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  searchResults: Product[];
  setSearchResults: (value: Product[]) => void;
  categories: string[];
  category: string;
  setCategory: (value: string) => void;
  minPrice: number | '';
  setMinPrice: (value: number | '') => void;
  maxPrice: number | '';
  setMaxPrice: (value: number | '') => void;
  showFilterBox: boolean;
  setShowFilterBox: (value: boolean) => void;
  slug: string;
}

const DesktopSearch = forwardRef<HTMLDivElement, DesktopSearchProps>(
  (
    {
      searchTerm,
      setSearchTerm,
      searchResults,
      setSearchResults,
      categories,
      category,
      setCategory,
      minPrice,
      setMinPrice,
      maxPrice,
      setMaxPrice,
      showFilterBox,
      setShowFilterBox,
      slug,
    },
    ref
  ) => {
    const router = useRouter();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        setDropdownVisible(false);
        setLoading(false);
        return;
      }

      const delayDebounce = setTimeout(async () => {
        try {
          setLoading(true);
          const params = new URLSearchParams();
          params.append('search', searchTerm);
          params.append('slug', slug);
          if (minPrice !== '') params.append('minPrice', String(minPrice));
          if (maxPrice !== '') params.append('maxPrice', String(maxPrice));
          if (category && category !== 'كل التصنيفات') params.append('category', category);

          const res = await fetch(`/api/search?${params.toString()}`);
          if (!res.ok) throw new Error('Failed to fetch products');

          const data: Product[] = await res.json();
          setSearchResults(data);
          setDropdownVisible(data.length > 0);
        } catch {
          setSearchResults([]);
          setDropdownVisible(false);
        } finally {
          setLoading(false);  
        }
      }, 300);

      return () => clearTimeout(delayDebounce);
    }, [searchTerm, slug, minPrice, maxPrice, category, setSearchResults]);

    return (
      <div className="relative hidden items-center justify-between gap-3 md:flex" ref={ref}>
        <div className="relative w-100">
          <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ابحث..."
            className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-9 text-sm transition focus:border-blue-500 focus:ring focus:ring-blue-100"
            onFocus={() => setDropdownVisible(searchResults.length > 0)}
          />
          {loading && (
            <AiOutlineLoading3Quarters
              className="absolute top-1/2 left-10 -translate-y-1/2 animate-spin text-gray-800"
              size={18}
            />
          )}

          {dropdownVisible && (
            <ul className="absolute top-full left-0 z-50 mt-1 max-h-56 w-full overflow-auto rounded-lg border bg-white text-sm shadow-md">
              <div className="flex justify-between p-2">
                <h1>نتائج البحث</h1>
                <button
                  onClick={() => setDropdownVisible(false)}
                  className="cursor-pointer rounded-lg bg-gray-950 p-1 text-white"
                >
                  <AiOutlineClose />
                </button>
              </div>
              {searchResults.map(product => (
                <li
                  key={product.id}
                  className="flex cursor-pointer items-center gap-3 border px-3 py-2 transition hover:bg-gray-100"
                  onClick={() => {
                    setSearchTerm(product.name);
                    setSearchResults([]);
                    setDropdownVisible(false);
                    router.push(`/store/products/${product.id}`);
                  }}
                >
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border bg-gray-50">
                    <img
                      src={product.image || '/placeholder.png'}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="flex flex-col">
                    <span className="line-clamp-1 font-medium text-gray-800">{product.name}</span>
                    {product.price && (
                      <span className="text-xs text-gray-500">{product.price} ر.س</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={() => setShowFilterBox(!showFilterBox)}
          className="rounded-lg border border-gray-300 p-2 transition hover:bg-gray-100"
        >
          <TbCategory size={18} />
        </button>

        {showFilterBox && (
          <div className="absolute top-full left-0 mt-2 w-56 rounded-lg border bg-white p-3 text-sm shadow-md">
            <label className="mb-1 block text-gray-700">التصنيف</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="mb-2 w-full rounded border border-gray-300 p-1.5 text-sm"
            >
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <input
                type="number"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                placeholder="الأدنى"
                className="w-full rounded border border-gray-300 p-1.5 text-sm"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                placeholder="الأعلى"
                className="w-full rounded border border-gray-300 p-1.5 text-sm"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

DesktopSearch.displayName = 'DesktopSearch';
export default DesktopSearch;
