// ProductCardV2.tsx
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { Product } from '@/types/Products';
import Image from 'next/image';
import Link from 'next/link';
import { PiPackageDuotone } from 'react-icons/pi';

export default function ProductCard({ products }: { products: Product[] }) {
  return (
    <div className="">
      <div className="">
        <h2 className="sr-only">Products</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5">
          {products.map(product => (
            <Link
              key={product.id}
              href={`/Dashboard/supplier/produt-overview/${product.id}`}
              className="group"
            >
              <div className="relative">
                <Image
                  src={product.image ?? '/placeholder.png'}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="aspect-square w-full rounded-lg border border-gray-200 bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
                />
                <div className="bg-muted absolute top-1 left-2 flex items-center gap-1 rounded px-2 py-1">
                  {product.unlimited ? (
                    <span className="text-muted-foreground flex items-center gap-1 text-sm">
                      <span>كمية وفيرة</span>
                      <span>📦</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground flex items-center gap-1 text-sm">
                      <span>{product.quantity}</span>
                      <span>📦</span>
                    </span>
                  )}
                </div>
              </div>
              <h3 className="mt-4 text-sm text-foreground">{product.name}</h3>
              <p className="mt-1 text-lg font-medium text-accent">
                {formatIQD(product.price)} د.ع
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
