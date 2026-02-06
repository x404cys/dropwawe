'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import NavBarForDesktop from './NavBarDesktop';
import { getDashboardNavItems } from '../_config/dashboardNavItems';
import { useSession } from 'next-auth/react';
import { useDashboardData } from '../context/useDashboardData';
import { PiCaretDown, PiCheck, PiStorefrontLight } from 'react-icons/pi';
import { useStoreProvider } from '../context/StoreContext';
import { Listbox } from '@headlessui/react';
import { FaStore } from 'react-icons/fa';

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
          <label className="mb-3 block text-xs font-semibold tracking-wider text-gray-500 uppercase">
            متجرك
          </label>

          <div dir="rtl" className="relative w-full max-w-sm">
            <Listbox value={currentStore ?? undefined} onChange={setCurrentStore}>
              <div className="relative">
                <Listbox.Button className="group relative w-full">
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 transition-all duration-200 group-hover:border-blue-400 group-hover:shadow-md focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                    <FaStore className="h-5 w-5 flex-shrink-0 text-[#04BAF6]" />

                    <span className="flex-1 px-3 text-right text-sm font-medium text-gray-800">
                      {currentStore?.name ?? 'اختر المتجر'}
                    </span>

                    <PiCaretDown className="group-ui-open:rotate-180 h-4 w-4 flex-shrink-0 text-gray-400 transition-transform duration-200" />
                  </div>
                </Listbox.Button>

                <Listbox.Options
                  dir="rtl"
                  className="absolute top-full z-10 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
                >
                  <div className="max-h-64 overflow-y-auto py-1">
                    {stores.map(store => (
                      <Listbox.Option
                        key={store.id}
                        value={store}
                        className={({ active, selected }) =>
                          `relative flex cursor-pointer items-center justify-between px-4 py-3 transition-colors duration-150 ${
                            active
                              ? 'bg-blue-50 text-blue-600'
                              : selected
                                ? 'bg-blue-50 text-gray-800'
                                : 'text-gray-700 hover:bg-gray-50'
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <div className="flex flex-1 items-center gap-3">
                              <PiStorefrontLight
                                className={`h-5 w-5 flex-shrink-0 transition-colors ${
                                  selected ? 'text-blue-500' : 'text-gray-400'
                                }`}
                              />
                              <span className="text-sm font-medium">{store.name}</span>
                            </div>

                            {selected && (
                              <PiCheck className="h-5 w-5 flex-shrink-0 text-blue-500" />
                            )}
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
