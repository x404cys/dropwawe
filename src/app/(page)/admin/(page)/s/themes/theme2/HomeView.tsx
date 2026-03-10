'use client';
import { StoreProps } from '@/types/store/StoreType';
import { useProducts } from '../../context/products-context';
import ProductsListTheme2 from './_components/ProductsList/Products-List';

export default function HomeView() {
  const { products, filteredProductsByCategory, store } = useProducts();
  return (
    <main className="h-s px-2">
      {store?.theme === 'MODERN' && (
        <ProductsListTheme2
          products={products}
          filteredProductsByCategory={filteredProductsByCategory}
          store={store as StoreProps}
        />
      )}
    </main>
  );
}
