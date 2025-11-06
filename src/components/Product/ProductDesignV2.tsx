import { Product } from '@/types/Products';
import Link from 'next/link';
import Image from 'next/image';
import { calculateDiscountedPrice, formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
export default function ProductCardV2({ product }: { product: Product }) {
  return (
    <Link key={product.id} href={`/storev2/productOverviews/${product.id}`} className="group">
      <Image
        src={product.image ?? '/placeholder.png'}
        alt={product.name}
        width={200}
        height={200}
        className="aspect-square w-full rounded-lg border border-gray-200 bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
      />
      <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
      <div className="mt-1 flex items-center gap-4">
        {product.discount > 0 ? (
          <>
            <p className="text-lg font-medium text-gray-900">
              {formatIQD(calculateDiscountedPrice(product.price, product.discount))} د.ع
            </p>
            <p className="text-xs font-medium text-gray-500 line-through">
              {formatIQD(product.price)} د.ع
            </p>
          </>
        ) : (
          <p className="text-lg font-medium text-gray-900">{formatIQD(product.price)} د.ع</p>
        )}
      </div>
    </Link>
  );
}
