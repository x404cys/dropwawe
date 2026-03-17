// Purpose: Global Cart Context — provides cart state, product modal state,
// and checkout state to all client components in the storefront.
// Eliminates prop-drilling between StoreSection and StorefrontClient.

'use client';

import React, { createContext, useContext, useState } from 'react';
import { CartItem, CheckoutStep, CustomerInfo, StorefrontProduct } from '../_lib/types';
import { getDiscountedPrice } from '../_utils/price';

interface CartContextValue {
  // Cart
  cart: CartItem[];
  addToCart: (product: StorefrontProduct) => void;
  buyNow: (product: StorefrontProduct) => void;
  updateCartQty: (productId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  // Modal
  selectedProduct: StorefrontProduct | null;
  setSelectedProduct: (p: StorefrontProduct | null) => void;
  // Drawer
  showCart: boolean;
  setShowCart: (v: boolean) => void;
  // Checkout
  checkoutStep: CheckoutStep;
  setCheckoutStep: (s: CheckoutStep) => void;
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: CustomerInfo) => void;
  paymentMethod: 'cod' | 'electronic';
  setPaymentMethod: (m: 'cod' | 'electronic') => void;
  // Likes
  liked: string[];
  toggleLike: (id: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<StorefrontProduct | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('cart');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    notes: '',
    location: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'electronic'>('electronic');
  const [liked, setLiked] = useState<string[]>([]);

  const addToCart = (product: StorefrontProduct) => {
    setCart(prev => {
      const existing = prev.find(c => c.product.id === product.id);
      if (existing)
        return prev.map(c => (c.product.id === product.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { product, qty: 1 }];
    });
  };

  const buyNow = (product: StorefrontProduct) => {
    setCart([{ product, qty: 1 }]);
    setCheckoutStep('cart');
    setShowCart(true);
    setSelectedProduct(null);
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(c => (c.product.id === productId ? { ...c, qty: Math.max(0, c.qty + delta) } : c))
        .filter(c => c.qty > 0)
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartTotal = cart.reduce((s, c) => {
    return s + getDiscountedPrice(c.product) * c.qty;
  }, 0);

  const toggleLike = (id: string) => {
    setLiked(prev => (prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        buyNow,
        updateCartQty,
        clearCart,
        cartCount,
        cartTotal,
        selectedProduct,
        setSelectedProduct,
        showCart,
        setShowCart,
        checkoutStep,
        setCheckoutStep,
        customerInfo,
        setCustomerInfo,
        paymentMethod,
        setPaymentMethod,
        liked,
        toggleLike,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
