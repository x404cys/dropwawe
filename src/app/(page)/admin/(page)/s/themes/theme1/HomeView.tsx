'use client';
import { useProducts } from '../../context/products-context';
import ProductsListTheme1 from './_components/ProductsList/ProductsList';

export default function HomeView() {
  return (
    <main className="h-s px-2">
      <ProductsListTheme1 />
    </main>
  );
}
