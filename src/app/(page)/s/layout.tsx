import { ReactNode } from 'react';
import { StoreProvider } from '@/app/(page)/s/context/store-context';
import { getStoreFromSubdomain } from '@/app/(page)/s/lib/store';
import { getTheme } from '@/app/(page)/s/themes';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const store = await getStoreFromSubdomain();

  const theme = getTheme(store.theme);

  return (
    <StoreProvider store={store}>
      <theme.Layout>{children}</theme.Layout>
    </StoreProvider>
  );
}
