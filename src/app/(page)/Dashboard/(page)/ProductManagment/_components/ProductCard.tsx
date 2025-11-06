'use client';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Product } from '@/types/Products';
import { useRouter } from 'next/navigation';

interface Props {
  product: Product;
  onEdit: (product: Product) => void;
}

export default function ProductCard({ product, onEdit }: Props) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-2 rounded border border-gray-100 p-2">
      <Link href={`/Dashboard/products/${product.id}`}>
        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded border">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>
      </Link>
      <div className="flex flex-1 flex-col justify-center">
        <h3 className="line-clamp-1 text-sm font-semibold text-gray-900">
          {product.name.split(' ').slice(0, 3).join(' ')}
        </h3>
        <div className="mt-0.5 flex gap-4 text-xs font-medium">
          {product.unlimited === false ? (
            <p
              className={`inline-block rounded-md px-2 py-0.5 text-xs ${
                product.quantity === 0
                  ? 'bg-red-100 text-red-600'
                  : product.quantity < 5
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-green-100 text-green-600'
              }`}
            >
              الكمية: {product.quantity}
            </p>
          ) : (
            <div className="inline-block rounded-md bg-green-300 px-2 py-0.5 text-xs text-black">
              غير محدود
            </div>
          )}
          <p className="text-primary font-bold">السعر: {product.price} د.ع</p>
        </div>
      </div>
      <Button
        className="h-8 w-15 bg-gray-900 text-sm text-white"
        variant="outline"
        onClick={() => router.push(`/Dashboard/edit/${product.id}`)}
      >
        <MdOutlineModeEditOutline />
      </Button>
    </div>
  );
}
