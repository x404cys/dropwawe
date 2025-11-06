'use client';
import { Product } from '@/types/Products';
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { calculateDiscountedPrice } from '../utils/CalculateDiscountedPrice';

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
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [carts, setCarts] = useState<Record<string, Product[]>>({});

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
  const getTotalPriceAfterDiscountByKey = (keyName: string): number => {
    const items = getCartByKey(keyName);
    return items.reduce((acc, item) => {
      const discountPercentage = item.discount ?? 0;
      const priceAfterDiscount = calculateDiscountedPrice(item.price, discountPercentage);
      return acc + item.quantity * priceAfterDiscount;
    }, 0);
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
