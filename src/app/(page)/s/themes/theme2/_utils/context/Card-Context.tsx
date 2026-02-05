'use client';
import { Product } from '@/types/Products';
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useProducts } from '@/app/(page)/s/context/products-context';
import { calculateDiscountedPrice } from '@/app/lib/utils/CalculateDiscountedPrice';
type CouponResult = {
  valid: boolean;
  message?: string;
  discount: number;
  appliedOn: 'ORDER' | 'PRODUCT';
  productId?: string;
};

type CartContextType = {
  addToCartByKey: (product: Omit<Product, 'quantity'>, keyName: string) => void;
  addToCartWithQtyByKey: (
    product: Omit<Product, 'quantity'>,
    quantity: number,
    keyName: string,
    selectedColor?: string,
    selectedSize?: string
  ) => void;
  removeFromCartByKey: (id: string, keyName: string) => void;
  decreaseQuantityByKey: (id: string, keyName: string) => void;
  clearCartByKey: (keyName: string) => void;
  getCartByKey: (keyName: string) => Product[];
  getTotalQuantityByKey: (keyName: string) => number;
  getTotalPriceByKey: (keyName: string) => number;
  getAllShippingPricesByKey: (keyName: string) => number;
  getTotalPriceAfterDiscountByKey: (keyName: string) => number;
  saveCartId: (cartId: string, keyName: string) => void;
  getCartIdByKey: (keyName: string) => string | null;
  applyCoupon: (code: string, keyName: string) => Promise<void>;
  coupon: CouponResult | null;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [carts, setCarts] = useState<Record<string, Product[]>>({});
  const [coupon, setCoupon] = useState<CouponResult | null>(null);
  const { store } = useProducts();

  useEffect(() => {
    const initialCarts: Record<string, Product[]> = {};
    Object.keys(localStorage).forEach(key => {
      try {
        const data = localStorage.getItem(key);
        if (data) initialCarts[key] = JSON.parse(data);
      } catch {}
    });
    setCarts(initialCarts);
  }, []);

  const persist = (items: Product[], keyName: string) => {
    localStorage.setItem(keyName, JSON.stringify(items));
    setCarts(prev => ({ ...prev, [keyName]: items }));
  };

  const getCartByKey = (keyName: string) => carts[keyName] || [];

  const addToCartByKey = (product: Omit<Product, 'quantity'>, keyName: string) => {
    const prev = getCartByKey(keyName);
    const existing = prev.find(item => item.id === product.id);
    const updated = existing
      ? prev.map(item => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      : [...prev, { ...product, quantity: 1 }];
    persist(updated, keyName);
  };

  const addToCartWithQtyByKey = (
    product: Omit<Product, 'quantity'>,
    quantity: number,
    keyName: string,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    const prev = getCartByKey(keyName);

    const existing = prev.find(
      item => item.id === product.id && item.colors === selectedColor && item.sizes === selectedSize
    );

    const updated = existing
      ? prev.map(item =>
          item.id === product.id && item.colors === selectedColor && item.sizes === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [
          ...prev,
          {
            ...product,
            quantity,
            selectedColor,
            selectedSize,
          },
        ];

    persist(updated, keyName);
  };

  const decreaseQuantityByKey = (id: string, keyName: string) => {
    const prev = getCartByKey(keyName);
    const updated = prev
      .map(item => (item.id === id ? { ...item, quantity: Math.max(item.quantity - 1, 0) } : item))
      .filter(item => item.quantity > 0);
    persist(updated, keyName);
  };

  const removeFromCartByKey = (id: string, keyName: string) => {
    const prev = getCartByKey(keyName);
    const updated = prev.filter(item => item.id !== id);
    persist(updated, keyName);
  };

  const clearCartByKey = (keyName: string) => {
    localStorage.removeItem(keyName);
    setCarts(prev => ({ ...prev, [keyName]: [] }));
  };

  const getTotalQuantityByKey = (keyName: string) =>
    getCartByKey(keyName).reduce((acc, item) => acc + item.quantity, 0);

  const getTotalPriceByKey = (keyName: string) =>
    getCartByKey(keyName).reduce((acc, item) => acc + item.quantity * item.price, 0);
  const getAllShippingPricesByKey = (keyName: string): number => {
    const items = getCartByKey(keyName);
    const prices = items
      .map(item => item.user?.Store?.[0]?.shippingPrice)
      .filter(p => p !== undefined && p !== null) as number[];

    if (prices.length === 0) return 0;

    const frequency: Record<number, number> = {};
    prices.forEach(price => {
      frequency[price] = (frequency[price] ?? 0) + 1;
    });

    return prices.reduce((a, b) => (frequency[a] >= frequency[b] ? a : b));
  };
  const applyCoupon = async (code: string, keyName: string) => {
    const cart = getCartByKey(keyName);

    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        storeId: store.id,
        products: cart.map(p => ({
          id: p.id,
          price: p.price,
          quantity: p.quantity,
        })),
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    setCoupon(data);
  };
  const getTotalAfterCoupon = (keyName: string) => {
    const total = getTotalPriceAfterDiscountByKey(keyName);

    if (!coupon) return total;

    return Math.max(total - coupon.discount, 0);
  };

  const getTotalPriceAfterDiscountByKey = (keyName: string): number => {
    const items = getCartByKey(keyName);
    return items.reduce((acc, item) => {
      const discountPercentage = item.discount ?? 0;
      const priceAfterDiscount = calculateDiscountedPrice(item.price, discountPercentage);
      return acc + item.quantity * priceAfterDiscount;
    }, 0);
  };
  const saveCartId = (cartId: string, keyName: string) => {
    localStorage.setItem(`cartId_${keyName}`, cartId);
  };
  const getCartIdByKey = (keyName: string): string | null => {
    return localStorage.getItem(`cartId_${keyName}`);
  };
  return (
    <CartContext.Provider
      value={{
        addToCartByKey,
        addToCartWithQtyByKey,
        removeFromCartByKey,
        decreaseQuantityByKey,
        clearCartByKey,
        getCartByKey,
        getTotalQuantityByKey,
        getTotalPriceByKey,
        getAllShippingPricesByKey,
        getTotalPriceAfterDiscountByKey,
        saveCartId,
        getCartIdByKey,
        applyCoupon,
        coupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
