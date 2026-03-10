'use client';

import React from 'react';
import CouponInput from '@/app/(page)/s/_components/Coupons/CouponInput';
import { useCart } from '@/app/lib/context/CartContext';
import { useProducts } from '@/app/(page)/s/context/products-context';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';

type Props = {
  cartKey: string;
};

const OrderSummary = ({ cartKey }: Props) => {
  const {
    getTotalPriceByKey,
    getTotalPriceAfterDiscountByKey,
    getAllShippingPricesByKey,
    getTotalQuantityByKey,
    getTotalAfterCoupon,
  } = useCart();

  const { store } = useProducts();

  const subtotal = getTotalPriceByKey(cartKey);
  const totalAfterDiscount = getTotalPriceAfterDiscountByKey(cartKey);
  const shipping = getAllShippingPricesByKey(cartKey);
  const totalQty = getTotalQuantityByKey(cartKey);
  const totalAfterCoupon = getTotalAfterCoupon(cartKey);

  const finalTotal = totalAfterCoupon ;

  return (
    <div className="sticky top-6 rounded-md border bg-[#f9f6f3] p-6 font-light shadow-md">
      <h2 className="mb-4 text-lg font-semibold">ملخص الطلب</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>عدد المنتجات</span>
          <span>{totalQty}</span>
        </div>

        <div className="flex justify-between">
          <span>المجموع</span>
          <span>{formatIQD(subtotal)}</span>
        </div>

        <div className="flex justify-between text-red-500">
          <span>بعد الخصم</span>
          <span>{formatIQD(totalAfterDiscount)}</span>
        </div>

        <div className="flex justify-between">
          <span>الشحن</span>
          <span>{formatIQD(shipping)}</span>
        </div>

        <div className="flex justify-between text-blue-700">
          <span>بعد تطبيق الكوبون</span>
          <span>{formatIQD(totalAfterCoupon)}</span>
        </div>

        <hr className="my-2" />

        <div className="flex justify-between text-lg font-bold">
          <span>الإجمالي النهائي</span>
          <span>{formatIQD(finalTotal)}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <CouponInput cartKey={cartKey} storeId={store?.id ?? ''} />

        <button
          className="mt-6 w-full max-w-[280px] rounded-none bg-black py-3 text-white transition hover:opacity-90"
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
