// Purpose: Global Cart Context — provides cart state, product modal state,
// and checkout state to all client components in the storefront.

'use client';

import React, { createContext, useContext, useState } from 'react';
import { CartItem, CheckoutStep, CustomerInfo, StorefrontProduct } from '../_lib/types';
import { getDiscountedPrice } from '../_utils/price';
import { isSameCartLine, productNeedsVariantSelection } from '../_utils/cart';

const STORAGE_KEY = 'storefront-cart-state-v1';

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
  cart: CartItem[];
  addToCart: (product: StorefrontProduct) => void;
  buyNow: (product: StorefrontProduct) => void;
  updateCartQty: (
    productId: string,
    delta: number,
    selectedColor?: string,
    selectedSize?: string
  ) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  selectedProduct: StorefrontProduct | null;
  setSelectedProduct: (p: StorefrontProduct | null) => void;
  showCart: boolean;
  setShowCart: (v: boolean) => void;
  checkoutStep: CheckoutStep;
  setCheckoutStep: (s: CheckoutStep) => void;
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: CustomerInfo) => void;
  paymentMethod: 'cod' | 'electronic';
  setPaymentMethod: (m: 'cod' | 'electronic') => void;

  liked: string[];
  toggleLike: (id: string) => void;

  coupon: CouponState;
  setCouponCode: (code: string) => void;
  applyCoupon: (
    storeId: string,
    products: { id: string; price: number; quantity: number }[]
  ) => Promise<void>;
  removeCoupon: () => void;
  requiresShipping: () => boolean;
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

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as {
        cart?: CartItem[];
        customerInfo?: CustomerInfo;
        paymentMethod?: 'cod' | 'electronic';
        liked?: string[];
        couponCode?: string;
      };

      if (Array.isArray(parsed.cart)) setCart(parsed.cart);
      if (parsed.customerInfo) setCustomerInfo(parsed.customerInfo);
      if (parsed.paymentMethod === 'cod' || parsed.paymentMethod === 'electronic') {
        setPaymentMethod(parsed.paymentMethod);
      }
      if (Array.isArray(parsed.liked)) setLiked(parsed.liked);
      if (parsed.couponCode) setCoupon(prev => ({ ...prev, code: parsed.couponCode ?? '' }));
    } catch {
      // ignore corrupted state
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const payload = {
      cart,
      customerInfo,
      paymentMethod,
      liked,
      couponCode: coupon.code,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [cart, customerInfo, paymentMethod, liked, coupon.code]);

  const addToCart = (product: StorefrontProduct) => {
    if (productNeedsVariantSelection(product)) {
      setSelectedProduct(product);
      return;
    }

    setCart(prev => {
      const existing = prev.find(c => isSameCartLine(c.product, product));
      if (existing)
        return prev.map(c => (isSameCartLine(c.product, product) ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { product, qty: 1 }];
    });
  };

  const buyNow = (product: StorefrontProduct) => {
    if (productNeedsVariantSelection(product)) {
      setSelectedProduct(product);
      return;
    }

    setCart([{ product, qty: 1 }]);
    setCoupon(COUPON_IDLE);
    setCheckoutStep('cart');
    setShowCart(false);
    setSelectedProduct(null);
  };

  const updateCartQty = (
    productId: string,
    delta: number,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    const targetLine = { id: productId, selectedColor, selectedSize };

    setCart(prev =>
      prev
        .map(c =>
          isSameCartLine(c.product, targetLine) ? { ...c, qty: Math.max(0, c.qty + delta) } : c
        )
        .filter(c => c.qty > 0)
    );
  };
  const clearCart = () => {
    setCart([]);
    setCoupon(COUPON_IDLE);
    setSelectedProduct(null);
    setShowCart(false);
    setCheckoutStep('cart');
  };

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartTotal = cart.reduce((s, c) => s + getDiscountedPrice(c.product) * c.qty, 0);
  const requiresShipping = () => cart.some(item => !item.product.isDigital);

  const toggleLike = (id: string) => {
    setLiked(prev => (prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]));
  };

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
      const res = await fetch('/api/coupons/validate', {
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

  const effectiveShipping = (shippingPrice = 0) => {
    const baseShipping = requiresShipping() ? shippingPrice : 0;
    return Math.max(0, baseShipping - coupon.shippingDiscount);
  };

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
        requiresShipping,
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
