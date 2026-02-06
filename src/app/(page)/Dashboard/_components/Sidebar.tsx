'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CreditCard, Gift, LayoutDashboard, MessageSquare } from 'lucide-react';
import clsx from 'clsx';
import NavBarForDesktop from './NavBarDesktop';
import { getDashboardNavItems } from '../_config/dashboardNavItems';
import { useSession } from 'next-auth/react';
import { useDashboardData } from '../context/useDashboardData';
import { useSubscriptions } from '../context/useSubscription';
import { IoStorefrontOutline } from 'react-icons/io5';
import { PiStorefrontLight } from 'react-icons/pi';
import { useStoreProvider } from '../context/StoreContext';

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { data, loading } = useDashboardData(session?.user.id);
  const navItems = getDashboardNavItems(session?.user.role);
  const { currentStore, stores, setCurrentStore } = useStoreProvider();

  return (
    <section dir="rtl" className="hidden min-h-screen bg-[#F8F8F8] md:flex">
      <aside className="w-72 border-l bg-[#F8F8F8]">
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
              <h1 className="text-xl font-bold text-gray-900">Matager</h1>
            </div>
          </Link>
        </div>
        <hr />
        <div className="px-6 py-4">
          <p className="text-xs text-gray-400">متجرك</p>

          <div className="mt-1 w-full rounded-lg border bg-white p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PiStorefrontLight className="h-6 w-6" />
                <span className="text-sm font-medium text-gray-900">
                  {currentStore?.name ?? 'متجر'}
                </span>
              </div>

              <select
                className="rounded border px-2 py-1 text-xs"
                value={currentStore?.id ?? ''}
                onChange={e => {
                  const selected = stores.find(s => s.id === e.target.value);
                  if (selected) setCurrentStore(selected);
                }}
              >
                {stores.map(store => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <nav className="mt-4 flex flex-col gap-6 px-4 text-sm">
          <Section title="عام" items={navItems} pathname={pathname} />
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <NavBarForDesktop />

        <main className="flex-1 overflow-y-auto p-2">{children}</main>
      </div>
    </section>
  );
}

function Section({ title, items, pathname }: { title: string; items: any[]; pathname: string }) {
  return (
    <div>
      <p className="mb-2 px-2 text-xs font-semibold text-gray-400">{title}</p>

      <div className="flex flex-col gap-1">
        {items.map(item => {
          const Icon = item.icon;
          const active = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2 transition',
                active
                  ? 'bg-gradient-to-r from-sky-300/45 from-20% via-[#04BAF6] via-60% to-[#04BAF6] to-80% text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
