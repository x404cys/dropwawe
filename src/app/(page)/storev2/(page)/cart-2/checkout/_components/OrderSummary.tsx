'use client';

import { useCart } from '@/app/lib/context/CartContext';
import React from 'react';

type Props = {
  cartKey: string;
};

const OrderSummary = ({ cartKey }: Props) => {
  const {
    getTotalPriceByKey,
    getTotalPriceAfterDiscountByKey,
    getAllShippingPricesByKey,
    getTotalQuantityByKey,
  } = useCart();

  const subtotal = getTotalPriceByKey(cartKey);
  const totalAfterDiscount = getTotalPriceAfterDiscountByKey(cartKey);
  const shipping = getAllShippingPricesByKey(cartKey);
  const totalQty = getTotalQuantityByKey(cartKey);

  const finalTotal = totalAfterDiscount + shipping;

  return (
    <div className="sticky top-6 border p-6 font-light">
      <h2 className="mb-4 text-lg font-semibold">ملخص الطلب</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>عدد المنتجات</span>
          <span>{totalQty}</span>
        </div>

        <div className="flex justify-between">
          <span>المجموع</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-red-400">
          <span>بعد الخصم</span>
          <span>{totalAfterDiscount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>الشحن</span>
          <span>{shipping.toFixed(2)}</span>
        </div>
    
        <hr />

        <div className="flex justify-between text-lg font-bold">
          <span>الإجمالي</span>
          <span>{finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          className="mt-6 w-72 cursor-pointer bg-black py-3 text-white transition hover:opacity-90"
          onClick={() => {
            const checkoutSection = document.getElementById('checkout-section');
            if (checkoutSection) {
              checkoutSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          إتمام الطلب
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
