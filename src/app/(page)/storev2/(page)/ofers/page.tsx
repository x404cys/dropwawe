'use client';
import { useEffect, useState } from 'react';
import ProductsList from '../../Data/products/ProductsList';
import { Product } from '@/types/Products';
import axios from 'axios';
import { useProducts } from '../../Data/context/products/ProductsContext';
import Link from 'next/link';
import Image from 'next/image';
import { calculateDiscountedPrice, formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
export default function OfersPage() {
  const { store } = useProducts();
  const [product, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/api/storev2/products/ofers/${store?.subLink}`);
      setProducts(res.data);
    };
    fetchData();
  }, [store?.subLink]);
  if (product.length <= 0) {
    return <div className="mt-10 flex h-screen justify-center">لاتوجد عروض حاليا</div>;
  }
  return (
    <div dir="rtl" className="h-screen bg-white">
      <div className="mx-auto">
        <h2 className="sr-only">Products</h2>
        <div className="mt-10 mb-10 flex justify-center">
          <h1 className="font-bold">العروض</h1>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5">
          {product.map(product => (
            <Link
              key={product.id}
              href={`/storev2/productOverviews/${product.id}`}
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
              <div className="flex items-center gap-4">
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {formatIQD(calculateDiscountedPrice(product.price, product.discount))} د.ع
                </p>
                <p className="mt-1 text-xs font-medium text-gray-500 line-through">
                  {formatIQD(product.price)} د.ع
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
