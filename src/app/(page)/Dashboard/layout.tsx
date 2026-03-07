'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import FloatingNavBarForDashboard from './_components/layout/FloatingNavBarForDashboard';
import UserActions from './_components/layout/UserActions';
import { SubscriptionProvider } from './context/useSubscription';
import { StoreProvider } from './context/StoreContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Sidebar from './_components/layout/Sidebar';
import { fbEvent } from './utils/pixel';

NProgress.configure({ showSpinner: false, trickleSpeed: 200 });

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    NProgress.done();
    fbEvent('ViewContent', { content_name: 'Dashboard', path: pathname });
  }, [pathname]);

  return (
    <LanguageProvider>
      <ThemeProvider>
        <StoreProvider>
          <SubscriptionProvider>
            <section className="min-h-screen bg-background font-medium transition-colors duration-200">
              <UserActions />

              <main className="mb-18 hidden bg-background lg:block">
                <Sidebar>{children}</Sidebar>
              </main>

              <div className="mb-18 block lg:hidden">{children}</div>

              <FloatingNavBarForDashboard />
            </section>
          </SubscriptionProvider>
        </StoreProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
