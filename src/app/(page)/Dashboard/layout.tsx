import FloatingNavBarForDashboard from './_components/FloatingNavBarForDashboard';
import UserActions from './_components/UserActions';
import NavBarForDesktop from './_components/NavBarDesktop';
import { SubscriptionProvider } from './context/useSubscription';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="mb-20 px-2 font-medium md:mx-10">
      <UserActions />
      <NavBarForDesktop />
      <div>
        <SubscriptionProvider>{children}</SubscriptionProvider>
      </div>
      <div className="mt-5 mb-5">
        <FloatingNavBarForDashboard />
      </div>
    </section>
  );
}
