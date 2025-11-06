import type { Metadata } from 'next';
import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import Providers from './providers';
import { FavoriteProvider } from './lib/context/FavContext';
import { ProvidersContext } from './providersContext';
import { UserProvider } from './lib/context/UserIdContect';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const myCustomFont = localFont({
  src: [
    {
      path: '../fonts/SFArabic-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-custom',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'سهل | منصة المتاجر الإلكترونية',
  description:
    'منصة سهل لإنشاء المتاجر الإلكترونية أنشئ متجرك الإلكتروني في دقائق وابدأ البيع فوراً. منصة سهلة وشاملة مع جميع الأدوات التي تحتاجها لنمو تجارتك.',
  keywords: ['سهل', 'متجر إلكتروني', 'إنشاء متجر', 'ecommerce', 'shop', 'store builder'],
  openGraph: {
    title: 'سهل | منصة المتاجر الإلكترونية',
    description:
      'أنشئ متجرك الإلكتروني في دقائق مع منصة سهل، الحل الأسهل لنمو تجارتك عبر الإنترنت.',
    url: 'https://www.sahlapp.io',
    siteName: 'سهل',
    images: [
      {
        url: 'https://sahel.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'منصة سهل للمتاجر الإلكترونية',
      },
    ],
    locale: 'ar_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'سهل | منصة المتاجر الإلكترونية',
    description:
      'منصة سهلة وسريعة لإنشاء متجرك الإلكتروني مع جميع الأدوات التي تحتاجها لنمو تجارتك.',
    images: ['https://sahel.com/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.sahlapp.io',
  },
};

import { Toaster } from 'sonner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${myCustomFont.className} antialiased`}
      >
        <div className="mx-auto overflow-hidden px-2 font-bold md:px-0">
          <Providers>
            <FavoriteProvider>
              <ProvidersContext>  
                <UserProvider>{children}</UserProvider>
              </ProvidersContext>
            </FavoriteProvider>
          </Providers>
        </div>

        <Toaster position="top-right" />
      </body>
    </html>
  );
}
