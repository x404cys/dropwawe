import { useState } from 'react';
import { Product } from '@/types/Products';

import { StoreProps } from '@/types/store/StoreType';
import ProductCardV1 from '@/components/Product/ProductDesignV1';
import ProductCardV2 from '@/components/Product/ProductDesignV2';
import FacebookPixel from '@/app/(page)/storev2/Pixel/FacebookPixel';
import GooglePixel from '@/app/(page)/storev2/Pixel/GooglePixel';
import CategoriesList from '../../_components/CategoriesList/CategoriesList';

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
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5">
            {store?.theme === 'NORMAL' &&
              itemsToRender.map(product => <ProductCardV2 key={product.id} product={product} />)}
          </div>
        </div>
      </div>
      {store?.facebookPixel && <FacebookPixel pixelId={store.facebookPixel} />}
      {store?.googlePixel && <GooglePixel measurementId={store.googlePixel} />}
    </>
  );
}
