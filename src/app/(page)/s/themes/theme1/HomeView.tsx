'use client';
import { useProducts } from '../../context/products-context';
import ProductsListTheme1 from './_components/ProductsList/ProductsList';

export default function HomeView() {
  const { products, filteredProductsByCategory, store } = useProducts();
  return (
    <main className="h-s px-2">
      <ProductsListTheme1
        products={products}
        filteredProductsByCategory={filteredProductsByCategory}
        store={store}
      />
    </main>
  );
}
