'use client';

import { useStore } from '@/app/(page)/s/context/store-context';
import { getTheme } from '@/app/(page)/s/themes';

export default function CartPage() {
  const store = useStore();
  const theme = getTheme(store.theme);

  return <div />;
}
