import { useState } from 'react';
import { useProducts } from '../../Data/context/products/ProductsContext';

export default function CategoriesList() {
  const { categories, setCategory, setCategoryLiset } = useProducts();
  const [activeCategory, setActiveCategory] = useState('الكل');

  const allCategories = ['الكل', ...categories];

  return (
    <div dir="rtl" className="relative my-4">
      <div className="scrollbar-hide flex gap-2 overflow-x-auto  py-1 whitespace-nowrap">
        {allCategories.map((name, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCategoryLiset(name === 'الكل' ? null : name);
              setActiveCategory(name);
            }}
            className={`flex-shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
              activeCategory === name
                ? 'border-[#292526] bg-[#292526] text-white'
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
