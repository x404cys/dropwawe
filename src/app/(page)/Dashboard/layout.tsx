import FloatingNavBarForDashboard from './_components/FloatingNavBarForDashboard';
import UserActions from './_components/UserActions';
import { SubscriptionProvider } from './context/useSubscription';
import Sidebar from './_components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
