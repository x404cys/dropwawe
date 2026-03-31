// Purpose: Floating cart button - "use client".
// fixed bottom-6 right-4, visible only when cart has items, drawer is closed,
// and no product modal is open. Shows count and total.

'use client';

import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../_context/CartContext';
import { useLanguage } from '../../_context/LanguageContext';
import { buildStorefrontCheckoutPath } from '../../_utils/routes';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';

interface FloatingCartProps {
  primaryColor: string;
}

export default function FloatingCart({ primaryColor }: FloatingCartProps) {
  const router = useRouter();
  const { cartCount, cartTotal } = useCart();
  const { t } = useLanguage();

  if (cartCount === 0) return null;

  return (
    <button
      type="button"
      onClick={() => router.push(buildStorefrontCheckoutPath())}
      className="animate-in slide-in-from-bottom fixed right-4 bottom-6 z-30 flex h-12 items-center gap-2 rounded-full px-5 text-sm font-bold text-white shadow-lg transition-transform active:scale-95"
      style={{ backgroundColor: primaryColor }}
    >
      <ShoppingCart className="h-4 w-4" />
      {cartCount} • {formatIQD(cartTotal)} {t.store.currency}
    </button>
  );
}
