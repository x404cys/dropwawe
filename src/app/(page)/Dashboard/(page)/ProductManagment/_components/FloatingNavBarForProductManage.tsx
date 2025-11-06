'use client';

import { useRouter } from 'next/navigation';
import { LuPackagePlus } from 'react-icons/lu';
import { AiOutlineProduct } from 'react-icons/ai';
import { LiaShippingFastSolid } from 'react-icons/lia';
import React from 'react';

export default function ProductManageOptions() {
  const router = useRouter();

  const items = [
    {
      icon: <LuPackagePlus size={18} />,
      label: 'إضافة منتج',
      path: '/Dashboard/ProductManagment/add-product',
    },
    {
      icon: <AiOutlineProduct size={18} />,
      label: 'المنتجات',
      path: '/Dashboard/ProductManagment',
    },
    {
      icon: <LiaShippingFastSolid size={18} />,
      label: 'الموردين',
      path: '/Dashboard/ProductManagment',
    },
  ];

  return (
    <div dir="rtl" className="mx-auto mt-3 mb-3 flex max-w-md items-center justify-center gap-6">
      {items.map((item, idx) => (
        <button
          key={idx}
          onClick={() => router.push(item.path)}
          className="flex flex-col items-center gap-1 text-gray-700 transition hover:text-black"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-gray-50 shadow-sm hover:bg-gray-100">
            {item.icon}
          </span>
          <span className="text-[12px] font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
