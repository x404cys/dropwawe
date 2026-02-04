'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import FloatingNavBarForDashboard from './_components/FloatingNavBarForDashboard';
import UserActions from './_components/UserActions';
import { SubscriptionProvider } from './context/useSubscription';
import Sidebar from './_components/Sidebar';

NProgress.configure({ showSpinner: true, trickleSpeed: 200 });

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();

    NProgress.done();
  }, [pathname]);

  return (
    <SubscriptionProvider>
      <section className="min-h-screen bg-white font-medium">
        <UserActions />

        <main className="hidden bg-white lg:block">
          <Sidebar>{children}</Sidebar>
        </main>

        <div className="block px-2 lg:hidden">{children}</div>

        <FloatingNavBarForDashboard />
      </section>
    </SubscriptionProvider>
  );
}
