'use client';
import { useLanguage } from '../../context/LanguageContext';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import NavBarForDesktop from './NavBarDesktop';
import { getDashboardNavItems } from '../../_config/dashboardNavItems';
import { useSession } from 'next-auth/react';
import { useDashboardData } from '../../context/useDashboardData';
import { PiCaretDown, PiCheck, PiStorefrontLight } from 'react-icons/pi';
import { useStoreProvider } from '../../context/StoreContext';
import { Listbox } from '@headlessui/react';
import { FaStore } from 'react-icons/fa';
import { useSubscriptions } from '../../context/useSubscription';
import { usePendingOrders } from '../../hooks/usePendingOrders';

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { data, loading } = useDashboardData(session?.user.id);
  const navItems = getDashboardNavItems(session?.user.role, t);
  const { currentStore, stores, setCurrentStore } = useStoreProvider();
  const { pendingCount } = usePendingOrders(currentStore?.id);
  const { hasAccess, userPlanType } = useSubscriptions();

  return (
    <section dir="rtl" className="hidden min-h-screen bg-background md:flex transition-colors duration-200">
      <aside className="w-72 border-l border-border bg-card transition-colors duration-200">
        {/* Logo */}
        <div className="flex items-center gap-8 p-4">
          <Link href="/">
            <div className="flex cursor-pointer items-center gap-1">
              <Image
                src="/Logo-Matager/Matager-logo2.PNG"
                alt="Matager - متاجر"
                width={38}
                height={38}
                className="rounded-2xl"
              />
              <h1 className="text-xl font-bold text-foreground">Matager</h1>
            </div>
          </Link>
        </div>
        <hr className="border-border" />

        {/* Store switcher */}
        <div className="px-6 py-4">
          <label className="mb-3 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {t.more.stores}
          </label>
          <div dir="rtl" className="relative w-full max-w-sm">
            <Listbox value={currentStore ?? undefined} onChange={setCurrentStore}>
              <div className="relative">
                <Listbox.Button className="group relative w-full">
                  <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 transition-all duration-200 group-hover:border-primary group-hover:shadow-md">
                    <FaStore className="h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="flex-1 px-3 text-right text-sm font-medium text-foreground">
                      {currentStore?.name ?? t.home.openStore}
                    </span>
                    <PiCaretDown className="group-ui-open:rotate-180 h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform duration-200" />
                  </div>
                </Listbox.Button>

                <Listbox.Options
                  dir="rtl"
                  className="absolute top-full z-10 mt-2 w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg"
                >
                  <div className="max-h-64 overflow-y-auto py-1">
                    {stores.map(store => (
                      <Listbox.Option
                        key={store.id}
                        value={store}
                        className={({ active, selected }) =>
                          `relative flex cursor-pointer items-center justify-between px-4 py-3 transition-colors duration-150 ${
                            active
                              ? 'bg-primary/10 text-primary'
                              : selected
                                ? 'bg-primary/10 text-foreground'
                                : 'text-foreground hover:bg-muted'
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <div className="flex flex-1 items-center gap-3">
                              <PiStorefrontLight
                                className={`h-5 w-5 flex-shrink-0 transition-colors ${
                                  selected ? 'text-primary' : 'text-muted-foreground'
                                }`}
                              />
                              <span className="text-sm font-medium">{store.name}</span>
                            </div>
                            {selected && <PiCheck className="h-5 w-5 flex-shrink-0 text-primary" />}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </div>
                </Listbox.Options>
              </div>
            </Listbox>
          </div>
        </div>

        {/* Nav links */}
        <nav className="mt-4 flex flex-col gap-6 px-4 text-sm">
          <Section
            title={t.more.general}
            items={navItems}
            pathname={pathname}
            pendingCount={pendingCount}
            hasAccess={hasAccess}
            t={t}
          />
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <NavBarForDesktop />
        <main className="flex-1 overflow-y-auto p-2 bg-background">{children}</main>
      </div>
    </section>
  );
}

function Section({
  title, items, pathname, pendingCount, role, hasAccess, t,
}: {
  title: string;
  items: any[];
  pathname: string;
  pendingCount: number;
  role?: string;
  hasAccess: (plan: any) => boolean;
  t: any;
}) {
  const filteredItems = items.filter(item => {
    const roleAllowed = !item.roles || item.roles.includes(role);
    const planAllowed = !item.plans || item.plans.some((p: any) => hasAccess(p));
    return roleAllowed && planAllowed;
  });

  return (
    <div>
      <p className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase">{title}</p>
      <div className="flex flex-col gap-1">
        {filteredItems.map(item => {
          const Icon = item.icon;
          const active = pathname === item.path;
          const isOrders = item.label === t.orders.title;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={clsx(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-gradient-to-l from-primary/80 via-primary to-primary/90 text-primary-foreground shadow-sm shadow-primary/30'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon size={18} />
              {item.label}
              {isOrders && pendingCount > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">
                  {pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
