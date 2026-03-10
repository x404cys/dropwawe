'use client';

import { useStore } from '@/app/(page)/s/context/store-context';
import { getTheme } from '@/app/(page)/s/themes';
import { useTrackVisitor } from '@/app/lib/context/SaveVisitorId';

export default function HomePage() {
  const store = useStore();
  const theme = getTheme(store.theme);
  useTrackVisitor(store.subLink as string);

  return <theme.HomeView />;
}
