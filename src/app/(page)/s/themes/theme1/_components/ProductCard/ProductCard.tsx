import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { Product } from '@/types/Products';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ products }: { products: Product[] }) {
  return (
    <div className=" ">
      <div className="mx-auto">
        <h2 className="sr-only">Products</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5">
          {products.map(product => (
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
  );
}
