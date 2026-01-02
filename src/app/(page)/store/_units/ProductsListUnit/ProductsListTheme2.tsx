import { useMemo } from 'react';
import { Product } from '@/types/Products';
import { StoreProps } from '@/types/store/StoreType';

import FacebookPixel from '@/app/(page)/storev2/Pixel/FacebookPixel';
import GooglePixel from '@/app/(page)/storev2/Pixel/GooglePixel';
import ProductCard3 from '../../_components/Product-Card/ProductCard';

interface ProductsListProps {
  products: Product[];
  filteredProductsByCategory: Product[];
  store: StoreProps;
}

export default function ProductsList({
  products,
  filteredProductsByCategory,
  store,
}: ProductsListProps) {
  const featuredProducts = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  const remainingProducts = useMemo(() => {
    const featuredIds = new Set(featuredProducts.map(p => p.id));

    const base = filteredProductsByCategory.length > 0 ? filteredProductsByCategory : products;

    return base.filter(product => !featuredIds.has(product.id));
  }, [products, filteredProductsByCategory, featuredProducts]);

  const groupedByCategory = useMemo(() => {
    return remainingProducts.reduce<Record<string, Product[]>>((acc, product) => {
      const categoryName = product.category || 'أخرى';

      acc[categoryName] = acc[categoryName] || [];
      acc[categoryName].push(product);

      return acc;
    }, {});
  }, [remainingProducts]);

  return (
    <div dir="rtl" className="bg-white px-2">
      {featuredProducts.length > 0 && (
        <div className="mb-16">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {featuredProducts.map(product => (
              <ProductCard3 key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-14">
        {Object.entries(groupedByCategory).map(
          ([categoryName, items]) =>
            items.length > 0 && (
              <div key={categoryName}>
                <div className="mb-6 flex items-center justify-center gap-4">
                  <span className="h-[1.5px] w-48 bg-gray-300" />
                  <h2 className="text-lg font-bold text-gray-800">{categoryName}</h2>
                  <span className="h-[1.5px] w-48 bg-gray-300" />
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
                  {items.map(product => (
                    <ProductCard3 key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )
        )}
      </div>

      {store?.facebookPixel && <FacebookPixel pixelId={store.facebookPixel} />}
      {store?.googlePixel && <GooglePixel measurementId={store.googlePixel} />}
    </div>
  );
}
