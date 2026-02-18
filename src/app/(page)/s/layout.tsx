import { ReactNode } from 'react';
import { StoreProvider } from './context/store-context';
import { ProductsProvider } from './context/products-context';
import { getStoreFromSubdomain } from './lib/store';
import { getTheme } from './themes';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const store = await getStoreFromSubdomain();

  return {
    title: store.name,
    description: store.description,
    metadataBase: new URL(`https://${store.domain}.matager.store`),

    openGraph: {
      title: store.name,
      description: store.description,
      images: [store.image as string],
    },

    twitter: {
      card: 'summary_large_image',
      title: store.name,
      description: store.description,
      images: [store.image as string],
    },
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const store = await getStoreFromSubdomain();
  const theme = getTheme(store.theme);

  const Navbar = theme.Navbar;
  const Footer = theme.Footer;

  return (
    <StoreProvider store={store}>
      <ProductsProvider>
        <section className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </section>
      </ProductsProvider>
    </StoreProvider>
  );
}
