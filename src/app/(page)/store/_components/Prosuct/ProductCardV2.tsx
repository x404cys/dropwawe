// ProductCardV2.tsx
import { Product } from '@/types/Products';
import Image from 'next/image';

export default function ProductCard({ products }: { products: Product[] }) {
  return (
    <div className="bg-white">
      <div className="mx-auto mt-20">
        <h2 className="sr-only">Products</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5">
          {products.map(product => (
            <a key={product.id} href="#" className="group">
              <Image
                src={product.image ?? '/placeholder.png'}
                alt={product.name}
                width={200}
                height={200}
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
              />
              <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">{product.price}$</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
