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
  const { hasAccess } = useSubscriptions();

  return (
    <section dir="rtl" className="hidden min-h-screen bg-background md:flex transition-colors duration-200">
      {/* ── Sidebar ── */}
      <aside className="flex w-64 flex-col border-l border-border/60 bg-card">

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border/60">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/Logo-Matager/Matager-logo2.PNG"
              alt="Matager"
              width={34}
              height={34}
              className="rounded-xl transition-transform group-hover:scale-105"
            />
            <span className="text-base font-bold text-foreground tracking-tight">Matager</span>
          </Link>
        </div>

        {/* Store switcher */}
        <div className="px-4 py-3 border-b border-border/60">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1">
            {t.more.stores}
          </p>
          <div dir="rtl" className="relative w-full">
            <Listbox value={currentStore ?? undefined} onChange={setCurrentStore}>
              <div className="relative">
                <Listbox.Button className="group relative w-full">
                  <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 transition-all duration-200 group-hover:border-primary/40 group-hover:bg-background">
                    <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FaStore className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="flex-1 text-right text-sm font-semibold text-foreground truncate">
                      {currentStore?.name ?? t.home.openStore}
                    </span>
                    <PiCaretDown className="group-ui-open:rotate-180 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground transition-transform duration-200" />
                  </div>
                </Listbox.Button>

                <Listbox.Options
                  dir="rtl"
                  className="absolute top-full z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-border/60 bg-card shadow-xl shadow-black/10"
                >
                  <div className="max-h-56 overflow-y-auto py-1.5 px-1.5 space-y-0.5">
                    {stores.map(store => (
                      <Listbox.Option
                        key={store.id}
                        value={store}
                        className={({ active, selected }) =>
                          clsx(
                            'flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors duration-150',
                            active || selected
                              ? 'bg-primary/10 text-primary'
                              : 'text-foreground hover:bg-muted/60'
                          )
                        }
                      >
                        {({ selected }) => (
                          <>
                            <div className="flex flex-1 items-center gap-2.5">
                              <PiStorefrontLight
                                className={clsx(
                                  'h-4 w-4 flex-shrink-0',
                                  selected ? 'text-primary' : 'text-muted-foreground'
                                )}
                              />
                              <span className="font-medium">{store.name}</span>
                            </div>
                            {selected && <PiCheck className="h-4 w-4 flex-shrink-0 text-primary" />}
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
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <NavSection
            title={t.more.general}
            items={navItems}
            pathname={pathname}
            pendingCount={pendingCount}
            hasAccess={hasAccess}
            t={t}
          />
        </nav>

        {/* Bottom: version */}
        <div className="px-4 py-3 border-t border-border/60">
          <p className="text-[10px] text-muted-foreground/50 text-center">Matager v2.0 · drop-wave.com</p>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <NavBarForDesktop />
        <main className="flex-1 overflow-y-auto bg-background p-2">{children}</main>
      </div>
    </section>
  );
}

function NavSection({
  title,
  items,
  pathname,
  pendingCount,
  role,
  hasAccess,
  t,
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
    <div className="space-y-0.5">
      <p className="mb-2 px-2 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest">
        {title}
      </p>
      {filteredItems.map(item => {
        const Icon = item.icon;
        const active = pathname === item.path;
        const isOrders = item.label === t.orders?.title;

        return (
          <Link
            key={item.path}
            href={item.path}
            className={clsx(
              'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
              active
                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {/* Icon container */}
            <span
              className={clsx(
                'flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg transition-colors',
                active
                  ? 'bg-white/15'
                  : 'bg-muted/0 group-hover:bg-muted'
              )}
            >
              <Icon size={15} />
            </span>

            <span className="flex-1 leading-none">{item.label}</span>

            {/* Pending orders badge */}
            {isOrders && pendingCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                {pendingCount > 99 ? '99+' : pendingCount}
              </span>
            )}

            {/* Active indicator dot */}
            {active && (
              <span className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
