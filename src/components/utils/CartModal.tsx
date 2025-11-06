'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/types/Products';
 
interface CartModalProps {
  items: Product[];
  onClose: () => void;
  onViewCart: () => void;
  onCheckout: () => void;
}

export default function CartModal({ items, onClose, onViewCart, onCheckout }: CartModalProps) {
  return (
    <div
      className="relative w-screen max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 transition hover:text-black"
        aria-label="إغلاق السلة"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="mt-4">
        <ul className="max-h-72 space-y-4 overflow-y-auto pr-2">
          {items.map(item => (
            <li
              key={item.id}
              className="flex items-center gap-4 rounded-lg border border-gray-100 p-2 shadow-sm"
            >
              <div className="relative h-14 w-14 overflow-hidden rounded">
                <Image src={item.image as string} alt={item.name} fill className="object-cover" />
              </div>

              <div className="flex flex-col">
                <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                <span className="text-xs text-gray-600">السعر: {item.price} د.ع</span>
                <span className="text-xs text-gray-600">الكمية: {item.quantity}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 space-y-3 text-center">
        <button
          onClick={onViewCart}
          className="w-full rounded-md border border-gray-700 px-4 py-2 text-sm text-gray-800 transition hover:bg-gray-100"
        >
          عرض السلة ({items.length})
        </button>

        <button
          onClick={onCheckout}
          className="w-full rounded-md bg-black px-4 py-2 text-sm text-white transition hover:bg-gray-800"
        >
          متابعة الدفع
        </button>

        <button
          onClick={onClose}
          className="text-sm text-gray-500 underline transition hover:text-gray-700"
        >
          متابعة التسوق
        </button>
      </div>
    </div>
  );
}
