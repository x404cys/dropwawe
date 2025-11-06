'use client';

import { forwardRef } from 'react';

interface FilterBoxProps {
  categories: string[];
  category: string;
  setCategory: (value: string) => void;
  minPrice: number | '';
  setMinPrice: (value: number | '') => void;
  maxPrice: number | '';
  setMaxPrice: (value: number | '') => void;
}

const FilterBox = forwardRef<HTMLDivElement, FilterBoxProps>(
  ({ categories, category, setCategory, minPrice, setMinPrice, maxPrice, setMaxPrice }, ref) => {
    return (
      <div
        ref={ref}
        className="absolute top-full right-0 mt-2 w-64 rounded-lg border bg-white p-4 shadow-lg md:hidden"
      >
        <label>التصنيف</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="mb-2 w-full rounded border p-2"
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label>السعر الأدنى</label>
        <input
          type="number"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value ? Number(e.target.value) : '')}
          className="mb-2 w-full rounded border p-2"
        />

        <label>السعر الأعلى</label>
        <input
          type="number"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
          className="w-full rounded border p-2"
        />
      </div>
    );
  }
);

FilterBox.displayName = 'FilterBox';
export default FilterBox;
