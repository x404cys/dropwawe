// Purpose: Floating cart button — "use client".
// fixed bottom-6 right-4, visible only when cart has items, drawer is closed,
// and no product modal is open. Shows count and total.

'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../_context/CartContext';

interface FloatingCartProps {
  primaryColor: string;
}

export default function FloatingCart({ primaryColor }: FloatingCartProps) {
  const { cartCount, cartTotal, showCart, selectedProduct, setShowCart, setCheckoutStep } = useCart();

  if (cartCount === 0 || showCart || selectedProduct) return null;

  return (
    <button
      onClick={() => {
        setCheckoutStep('cart');
        setShowCart(true);
      }}
      className="fixed bottom-6 right-4 h-12 px-5 rounded-full shadow-lg z-30 flex items-center gap-2 animate-in slide-in-from-bottom font-bold text-sm active:scale-95 transition-transform text-white"
      style={{ backgroundColor: primaryColor }}
    >
      <ShoppingCart className="h-4 w-4" />
      {cartCount} • {cartTotal.toLocaleString('ar-IQ')} د.ع
    </button>
  );
}
