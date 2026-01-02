'use client';

import { useCart } from '@/app/lib/context/CartContext';
import React from 'react';
import CheckoutItem from './_components/CheckoutItem';
import OrderSummary from './_components/OrderSummary';
import { useProducts } from '../../../../../Data/context/products/ProductsContext';
import OrderSubmi from './_components/OrderSubmit';

const CheckoutPage = () => {
  const { getCartByKey } = useCart();
  const { store } = useProducts();
  const cartItems = getCartByKey(`cart/${store?.id}`);

  if (cartItems.length === 0) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-lg text-gray-500">
        سلة التسوق فارغة
      </div>
    );
  }

  return (
    <div dir="rtl" className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">إتمام الطلب</h1>

      <div className="flex flex-col gap-5">
        <div className="space-y-4 lg:col-span-2">
          {cartItems.map(item => (
            <CheckoutItem
              CART_KEY={`cart/${store?.id}`}
              key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
              item={item}
            />
          ))}
        </div>

        <OrderSummary cartKey={`cart/${store?.id}`} />
        <OrderSubmi />
      </div>
    </div>
  );
};

export default CheckoutPage;
