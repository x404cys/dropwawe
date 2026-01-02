import Image from 'next/image';
import Link from 'next/link';
import { calculateDiscountedPrice, formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { Product } from '@/types/Products';
import { Eye, ShoppingCart, Heart } from 'lucide-react';

export default function ProductCard3({ product }: { product: Product }) {
  return (
    <Link href={`/store/product-overview/${product.id}`} className="group block">
      <div className="relative overflow-hidden">
        <Image
          src={product.image ?? '/placeholder.png'}
          alt={product.name}
          width={300}
          height={300}
          className="aspect-square w-full border border-gray-200 bg-gray-200 object-cover transition-transform duration-500 group-hover:scale-105 xl:aspect-7/8"
        />

        <div className="absolute inset-0 top-0 flex items-center justify-center gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={e => e.preventDefault()}
            className="rounded-full bg-white p-3 text-gray-800 shadow hover:bg-gray-100"
          >
            <Eye size={18} />
          </button>

          <button
            onClick={e => e.preventDefault()}
            className="rounded-full bg-white p-3 text-gray-800 shadow hover:bg-gray-100"
          >
            <Heart size={18} />
          </button>
        </div>
      </div>

      <div className="text-center">
        <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>

        <div className="mt-1 flex items-center justify-center gap-4">
          {product.discount > 0 ? (
            <div className="flex flex-col">
              <p className="text-lg font-medium text-[#f25933]">
                {formatIQD(calculateDiscountedPrice(product.price, product.discount))} د.ع
              </p>
              <p className="text-xs font-medium text-gray-500 line-through">
                {formatIQD(product.price)} د.ع
              </p>
            </div>
          ) : (
            <p className="text-lg font-medium text-[#f25933]">{formatIQD(product.price)} د.ع</p>
          )}
        </div>
      </div>
    </Link>
  );
}
