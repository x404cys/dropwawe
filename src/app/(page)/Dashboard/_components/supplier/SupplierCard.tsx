'use client';

import { Supplier } from '@/types/Supplier/SupplierType';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaTelegram } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

type SupplierCardProps = {
  supplier: Supplier;
  totalProducts?: number;
  store: string;
};

// دالة تتحقق من أن الرابط URL صالح 100%
const isValidUrl = (url: string | null | undefined) => {
  if (!url || typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default function SupplierCard({ supplier, totalProducts, store }: SupplierCardProps) {
  const categories = supplier.user?.Product.find(p => p.category)?.category;
  const uniqueCategories = Array.from(new Set(categories));
  const router = useRouter();

  return (
    <motion.div
      dir="rtl"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="group relative mx-auto flex w-full max-w-[380px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white"
    >
      {/* Header Image */}
      <div className="relative h-40 w-full bg-gray-100">
        {isValidUrl(supplier?.Header) ? (
          <Image src={supplier.Header!} alt="Supplier Banner" fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            لا توجد صورة
          </div>
        )}

        {/* Supplier Logo */}
        <div className="absolute right-0 bottom-0 translate-x-[-10%] translate-y-[50%]">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-white shadow-md">
            {isValidUrl(supplier?.image) ? (
              <Image src={supplier.image!} alt="Supplier Logo" fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-bold text-gray-500">
                {supplier.user?.name?.charAt(0) ?? 'م'}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-1 flex-col justify-between px-5 pb-4">
        {/* Supplier Name + Description */}
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-gray-900">
            {supplier.user?.name ?? 'اسم المورد'}
          </h2>
          <p className="line-clamp-2 text-sm text-gray-500">
            {supplier.description ?? 'لا يوجد وصف حالياً'}
          </p>
        </div>

        {/* Categories */}
        {uniqueCategories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {uniqueCategories.slice(0, 4).map((category, index) => (
              <span
                key={index}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700"
              >
                {category}
              </span>
            ))}

            {uniqueCategories.length > 4 && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                +{uniqueCategories.length - 4} أخرى
              </span>
            )}
          </div>
        )}

        {/* Product Count */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-600">
          <div className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
            📦 {totalProducts ?? 0} منتج
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-4 flex items-center gap-3 text-gray-500">
          {supplier.facebookLink && (
            <a href={supplier.facebookLink} target="_blank" rel="noopener noreferrer">
              <FaFacebook className="h-5 w-5 transition hover:text-blue-600" />
            </a>
          )}

          {supplier.instaLink && (
            <a href={supplier.instaLink} target="_blank" rel="noopener noreferrer">
              <FaInstagram className="h-5 w-5 transition hover:text-pink-600" />
            </a>
          )}

          {supplier.telegram && (
            <a href={supplier.telegram} target="_blank" rel="noopener noreferrer">
              <FaTelegram className="h-5 w-5 transition hover:text-sky-500" />
            </a>
          )}
        </div>

        {/* Payment Methods */}
        <div className="mt-3 flex flex-wrap gap-2">
          {(() => {
            try {
              const methods = JSON.parse(supplier.methodPayment || '[]');
              return methods.map((method: string, index: number) => (
                <span
                  key={index}
                  className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs text-gray-700"
                >
                  {method}
                </span>
              ));
            } catch {
              return <span className="text-sm text-gray-400">لا توجد طرق دفع</span>;
            }
          })()}
        </div>

        {/* Buttons */}
        <div className="mt-5 flex justify-between">
          <button
            onClick={() => router.push(`/Dashboard/supplier/supplier-overview/${store}`)}
            className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            عرض المنتجات
          </button>

          <button className="rounded-lg bg-gray-800 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-orange-600">
            تواصل الآن
          </button>
        </div>
      </div>
    </motion.div>
  );
}
