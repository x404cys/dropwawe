import { useState } from 'react';

import { StoreProps } from '@/types/store/StoreType';
import Link from 'next/link';
import Image from 'next/image';

import FacebookPixel from '@/app/(page)/s/context/Pixel/FacebookPixel';
import GooglePixel from '@/app/(page)/s/context/Pixel/GooglePixel';
import { useProducts } from '@/app/(page)/s/context/products-context';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';

interface ProductsListProps {
  store: StoreProps;
}

export default function ProductsListTheme1() {
  const [error, setError] = useState<string | null>(null);
  const {
    products,
    filteredProductsByCategory,
    store,
    categories,
    setCategory,
    loading,
    setCategoryList,
  } = useProducts();
  const [activeCategory, setActiveCategory] = useState('الكل');

  const allCategories = ['الكل', ...categories];

  const itemsToRender =
    filteredProductsByCategory.length > 0 ? filteredProductsByCategory : products;
  return (
    <>
      <div dir="rtl" className="relative my-4">
        <div className="scrollbar-hide flex gap-2 overflow-x-auto py-1 whitespace-nowrap">
          {allCategories.map((name, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCategoryList(name === 'الكل' ? null : name);
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
      <div dir="rtl" className="bg-white">
        <div className="mx-auto">
          <h2 className="sr-only">Products</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5">
            {itemsToRender.map(product => (
              <Link
                key={product.id}
                href={`/s/themes/theme1/productOverviews/${product.id}`}
                className="group"
              >
                <Image
                  src={product.image ?? '/placeholder.png'}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="aspect-square w-full rounded-lg border border-gray-200 bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
                />
                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {formatIQD(product.price)} د.ع
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {store?.facebookPixel && <FacebookPixel pixelId={store.facebookPixel} />}
      {store?.googlePixel && <GooglePixel measurementId={store.googlePixel} />}
    </>
  );
}
