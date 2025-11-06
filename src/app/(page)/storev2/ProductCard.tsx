import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/Products';
export default function ProductCart({ product }: { product: Product }) {
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
      <p className="mt-1 text-lg font-medium text-gray-900">{product.price} د.ع</p>
    </Link>
  );
}
