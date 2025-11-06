import { useState } from 'react';
import { Product } from '@/types/Products';
import Image from 'next/image';

interface ProductsListProps {
  products: Product[];
  filteredProductsByCategory: Product[];
}

export default function ProductsList({ products, filteredProductsByCategory }: ProductsListProps) {
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const itemsToRender =
    filteredProductsByCategory.length > 0 ? filteredProductsByCategory : products;

  return (
    <div dir="rtl" className="bg-white">
      <div className="mx-auto">
        <h2 className="sr-only">Products</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5">
          {itemsToRender.map(product => (
            <a key={product.id} href="#" className="group">
              <Image
                src={product.image ?? '/placeholder.png'}
                alt={product.name}
                width={200}
                height={200}
                className="aspect-square w-full rounded-lg border border-gray-200 bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
              />
              <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">{product.price} د.ع</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
