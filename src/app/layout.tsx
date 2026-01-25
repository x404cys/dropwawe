import type { Metadata } from 'next';
import './globals.css';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';

import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import Providers from './providers';
import { FavoriteProvider } from './lib/context/FavContext';
import { ProvidersContext } from './providersContext';
import { UserProvider } from './lib/context/UserIdContect';
import { Toaster } from 'sonner';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const myCustomFont = localFont({
  src: [
    {
      path: '../fonts/lyon-arabic-display-bold.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-custom',
  display: 'swap',
});
const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--font-ibm-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dropwave | منصة المتاجر الإلكترونية',
  description:
    'منصة Dropwave لإنشاء المتاجر الإلكترونية أنشئ متجرك الإلكتروني في دقائق وابدأ البيع فوراً. منصة سهلة وشاملة مع جميع الأدوات التي تحتاجها لنمو تجارتك.',
  keywords: ['دروب ويف', 'متجر إلكتروني', 'إنشاء متجر', 'ecommerce', 'shop', 'store builder'],
  openGraph: {
    title: 'Dropwave | منصة المتاجر الإلكترونية',
    description:
      'أنشئ متجرك الإلكتروني في دقائق مع منصة Dropwave، الحل الأسهل لنمو تجارتك عبر الإنترنت.',
    url: 'https://www.dropwave.cloud',
    siteName: 'Dropwave',
    images: [
      {
        url: 'https://dashboard.dropwave.cloud/_next/image?url=%2Flogo-drop.png&w=64&q=75',
        width: 1200,
        height: 630,
        alt: 'Dropwave  للمتاجر الإلكترونية',
      },
    ],
    locale: 'ar_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dropwave | منصة المتاجر الإلكترونية',
    description:
      'منصة سهلة وسريعة لإنشاء متجرك الإلكتروني مع جميع الأدوات التي تحتاجها لنمو تجارتك.',
    images: ['https://sahel.com/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.dropwave.cloud',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${ibmPlexArabic.className} antialiased`}
      >
        <div className="mx-auto overflow-hidden font-bold md:px-0">
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
