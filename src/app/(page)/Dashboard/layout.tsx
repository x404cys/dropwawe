'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import FloatingNavBarForDashboard from './_components/FloatingNavBarForDashboard';
import UserActions from './_components/UserActions';
import { SubscriptionProvider } from './context/useSubscription';
import { StoreProvider } from './context/StoreContext';
import Sidebar from './_components/Sidebar';
import { fbEvent } from './_utils/pixel';

NProgress.configure({ showSpinner: false, trickleSpeed: 200 });

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    NProgress.done();

    fbEvent('ViewContent', {
      content_name: 'Dashboard',
      path: pathname,
    });
  }, [pathname]);

  return (
    <StoreProvider>
      <SubscriptionProvider>
        <section className="min-h-screen bg-white font-medium">
          <UserActions />

          <main className="mb-18 hidden bg-white lg:block">
            <Sidebar>{children}</Sidebar>
          </main>

          <div className="mb-18 block px-2 lg:hidden">{children}</div>

          <FloatingNavBarForDashboard />
        </section>
      </SubscriptionProvider>
    </StoreProvider>
  );
}
