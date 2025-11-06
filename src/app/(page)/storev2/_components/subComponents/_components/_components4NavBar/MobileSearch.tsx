'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/Products';
import { useRouter } from 'next/navigation';
import { FiSearch } from 'react-icons/fi';
import { TbCategory } from 'react-icons/tb';
import { AiOutlineClose, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { VscClose } from 'react-icons/vsc';

interface MobileSearchProps {
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
  slug: string;
}

export default function MobileSearch({
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
  slug,
}: MobileSearchProps) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!searchTerm.trim() && category === 'كل التصنيفات' && minPrice === '' && maxPrice === '') {
      setSearchResults([]);
      setDropdownVisible(false);
      setLoading(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchTerm.trim()) params.append('search', searchTerm);
        params.append('slug', slug);
        if (minPrice !== '') params.append('minPrice', String(minPrice));
        if (maxPrice !== '') params.append('maxPrice', String(maxPrice));
        if (category && category !== 'كل التصنيفات') params.append('category', category);

        const res = await fetch(`/api/search?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch products');

        const data: Product[] = await res.json();
        setSearchResults(data);
        setDropdownVisible(data.length > 0);
      } catch (err) {
        console.error(err);
        setSearchResults([]);
        setDropdownVisible(false);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, slug, minPrice, maxPrice, category, setSearchResults]);

  return (
    <div className="block py-1 md:hidden">
      {!searchVisible && (
        <div dir="rtl" className="flex items-center gap-2">
          <button
            onClick={() => {
              setSearchVisible(true);
              setFilterVisible(false);
            }}
            className="rounded-full text-gray-700 transition hover:bg-blue-600 hover:text-white"
          >
            <FiSearch size={20} />
          </button>
          <button
            onClick={() => setFilterVisible(!filterVisible)}
            className="rounded-full text-gray-700 transition hover:bg-blue-600 hover:text-white"
          >
            <TbCategory size={20} />
          </button>
        </div>
      )}

      {searchVisible && (
        <div dir="rtl" className="relative gap-7">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ابحث عن منتج..."
            className="w-full rounded-lg border border-gray-300 px-7 py-2 text-black"
            autoFocus
            onFocus={() => setDropdownVisible(searchResults.length > 0)}
          />

          <button
            onClick={() => {
              setSearchVisible(false);
              setSearchTerm('');
              setDropdownVisible(false);
              setFilterVisible(false);
            }}
            className="absolute top-1/2 right-1 -translate-y-1/2 px-1 text-gray-500"
          >
            ✕
          </button>

          {loading && (
            <AiOutlineLoading3Quarters
              className="absolute top-1/2 left-2 -translate-y-1/2 animate-spin text-gray-500"
              size={18}
            />
          )}

          {dropdownVisible && (
            <ul className="absolute top-full left-0 z-50 mt-1 max-h-56 w-full overflow-auto rounded-lg border bg-white text-sm shadow-md">
              <div className="flex justify-between p-2">
                <h1>نتائج البحث</h1>
                <button
                  onClick={() => setDropdownVisible(false)}
                  className="cursor-pointer rounded-lg border border-gray-400 bg-gray-950 p-1 text-white"
                >
                  <AiOutlineClose />
                </button>
              </div>
              {searchResults.map(product => (
                <li
                  key={product.id}
                  className="flex cursor-pointer items-center gap-3 rounded border px-3 py-2 transition hover:bg-gray-100"
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
      )}

      {filterVisible && (
        <div className="absolute top-10 right-0 mt-2 w-full rounded-lg border bg-white p-3 shadow-md">
          <div className="flex justify-between py-2">
            <label className="mb-1 block">الفلترة</label>
            <button onClick={() => setFilterVisible(false)}>
              <VscClose className="rounded bg-gray-950 text-white" />
            </button>
          </div>

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="mb-2 w-full rounded border border-gray-300 p-2"
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
              className="w-full rounded border border-gray-300 p-2"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
              placeholder="الأعلى"
              className="w-full rounded border border-gray-300 p-2"
            />
          </div>
        </div>
      )}
    </div>
  );
}
