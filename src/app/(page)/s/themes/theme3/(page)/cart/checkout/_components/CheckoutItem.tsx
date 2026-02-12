'use client';

import React from 'react';
import { Product } from '@/types/Products';
import { calculateDiscountedPrice } from '@/app/lib/utils/CalculateDiscountedPrice';
import { useCart } from '@/app/lib/context/CartContext';

type Props = {
  item: Product;
  CART_KEY: string;
};

const CheckoutItem = ({ item, CART_KEY }: Props) => {
  const { decreaseQuantityByKey, addToCartByKey, removeFromCartByKey } = useCart();

  const priceAfterDiscount = calculateDiscountedPrice(item.price, item.discount ?? 0);

  return (
    <div className="flex gap-4 border bg-[#f9f6f3] p-4 font-light">
      <img src={item.image} alt={item.name} className="h-24 w-24 object-cover" />

      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>

        {item.selectedColor && <p className="text-sm text-gray-500">اللون: {item.selectedColor}</p>}
        {item.selectedSize && <p className="text-sm text-gray-500">المقاس: {item.selectedSize}</p>}

        <div className="mt-2 flex items-center gap-3">
          <button
            onClick={() => decreaseQuantityByKey(item.id, CART_KEY)}
            className="h-8 w-8 cursor-pointer rounded-full border"
          >
            −
          </button>

          <span>{item.quantity}</span>

          <button
            onClick={() => addToCartByKey(item, CART_KEY)}
            className="h-8 w-8 cursor-pointer rounded-full border"
          >
            +
          </button>
        </div>
      </div>

      <div className="text-right">
        {item.discount ? (
          <>
            <p className="text-sm text-gray-400 line-through">
              {(item.price * item.quantity).toFixed(2)}
            </p>
            <p className="font-semibold text-red-400">
              {(priceAfterDiscount * item.quantity).toFixed(2)}
            </p>
          </>
        ) : (
          <p className="font-semibold">{(item.price * item.quantity).toFixed(2)}</p>
        )}

        <button
          onClick={() => removeFromCartByKey(item.id, CART_KEY)}
          className="text-red-1 mt-2 cursor-pointer text-sm"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default CheckoutItem;
