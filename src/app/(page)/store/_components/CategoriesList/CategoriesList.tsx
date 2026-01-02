import { useState } from 'react';
import { useProducts } from '../../Data/context/products/ProductsContext';

export default function CategoriesList() {
  const { categories, setCategory, setCategoryLiset } = useProducts();
  const [activeCategory, setActiveCategory] = useState('الكل');

  const allCategories = ['الكل', ...categories];

  return (
    <div dir="rtl" className="relative my-8 text-center">
      <div className="scrollbar-hide flex gap-2 text-center justify-center overflow-x-auto px-1 py-1 whitespace-nowrap">
        {allCategories.map((name, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCategoryLiset(name === 'الكل' ? null : name);
              setActiveCategory(name);
            }}
            className={`text flex-shrink-0 cursor-pointer px-3 py-1.5 font-medium transition ${
              activeCategory === name
                ? 'text-[#f25933]'
                : 'border-gray-300 text-gray-700 hover:text-gray-950'
            }`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
