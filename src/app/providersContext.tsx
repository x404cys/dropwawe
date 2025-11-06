'use client';

import { CartProvider } from '@/app/lib/context/CartContext';

export function ProvidersContext({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
