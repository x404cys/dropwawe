import { useState } from 'react';
import { Product } from '@/types/Products';

import { StoreProps } from '@/types/store/StoreType';

import CategoriesList from '../CategoriesList/CategoriesList';
import ProductCard from '../ProductCard/ProductCard';
import FacebookPixel from '@/app/(page)/s/context/Pixel/FacebookPixel';
import GooglePixel from '@/app/(page)/s/context/Pixel/GooglePixel';

interface ProductsListProps {
  products: Product[];
  filteredProductsByCategory: Product[];
  store: StoreProps;
}

export default function ProductsListTheme1({
  products,
  filteredProductsByCategory,
  store,
}: ProductsListProps) {
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const itemsToRender =
    filteredProductsByCategory.length > 0 ? filteredProductsByCategory : products;

  return (
    <>
      <CategoriesList />
      <div dir="rtl" className="bg-white">
        <div className="mx-auto">
          <h2 className="sr-only">Products</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-1">
            {itemsToRender.map(product => (
              <ProductCard key={product.id} products={products || []} />
            ))}
          </div>
        </div>
      </div>
      {store?.facebookPixel && <FacebookPixel pixelId={store.facebookPixel} />}
      {store?.googlePixel && <GooglePixel measurementId={store.googlePixel} />}
    </>
  );
}
