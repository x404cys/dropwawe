// Purpose: Global Cart Context — provides cart state, product modal state,
// and checkout state to all client components in the storefront.

'use client';

import React, { createContext, useContext, useState } from 'react';
import { CartItem, CheckoutStep, CustomerInfo, StorefrontProduct } from '../_lib/types';
import { getDiscountedPrice } from '../_utils/price';

// ── COUPON TYPES ──
export interface CouponState {
  status: 'idle' | 'loading' | 'valid' | 'error';
  code: string;
  message?: string;
  discount: number;
  shippingDiscount: number;
  appliedOn?: 'ORDER' | 'PRODUCT' | 'SHIPPING';
}

const COUPON_IDLE: CouponState = {
  status: 'idle',
  code: '',
  discount: 0,
  shippingDiscount: 0,
};

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
  // Coupon
  coupon: CouponState;
  setCouponCode: (code: string) => void;
  applyCoupon: (
    storeId: string,
    products: { id: string; price: number; quantity: number }[]
  ) => Promise<void>;
  removeCoupon: () => void;
  // Derived totals (with coupon applied)
  effectiveShipping: (shippingPrice?: number) => number;
  grandTotal: (shippingPrice?: number) => number;
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
  const [coupon, setCoupon] = useState<CouponState>(COUPON_IDLE);

  // ── CART ──
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
  const cartTotal = cart.reduce((s, c) => s + getDiscountedPrice(c.product) * c.qty, 0);

  // ── LIKES ──
  const toggleLike = (id: string) => {
    setLiked(prev => (prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]));
  };

  // ── COUPON ──
  const setCouponCode = (code: string) => {
    setCoupon(prev => ({ ...prev, code: code.toUpperCase() }));
  };

  const applyCoupon = async (
    storeId: string,
    products: { id: string; price: number; quantity: number }[]
  ) => {
    if (!coupon.code.trim()) return;

    setCoupon(prev => ({ ...prev, status: 'loading', message: undefined }));

    try {
      const res = await fetch('/api/s/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: coupon.code.trim(), storeId, products }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCoupon(prev => ({
          ...prev,
          status: 'error',
          message: data.message,
          discount: 0,
          shippingDiscount: 0,
        }));
        return;
      }

      setCoupon(prev => ({
        ...prev,
        status: 'valid',
        discount: data.discount ?? 0,
        shippingDiscount: data.shippingDiscount ?? 0,
        appliedOn: data.appliedOn,
        message: undefined,
      }));
    } catch {
      setCoupon(prev => ({
        ...prev,
        status: 'error',
        message: 'حدث خطأ، حاول مجدداً',
        discount: 0,
        shippingDiscount: 0,
      }));
    }
  };

  const removeCoupon = () => setCoupon(COUPON_IDLE);

  // ── DERIVED TOTALS ──
  const effectiveShipping = (shippingPrice = 0) =>
    Math.max(0, shippingPrice - coupon.shippingDiscount);

  const grandTotal = (shippingPrice = 0) => {
    const orderDiscount =
      coupon.appliedOn === 'ORDER' || coupon.appliedOn === 'PRODUCT' ? coupon.discount : 0;
    return Math.max(0, cartTotal - orderDiscount + effectiveShipping(shippingPrice));
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
        coupon,
        setCouponCode,
        applyCoupon,
        removeCoupon,
        effectiveShipping,
        grandTotal,
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
