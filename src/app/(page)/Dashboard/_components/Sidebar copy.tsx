'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
 import { getDashboardNavItems } from '../_config/dashboardNavItems';
import { useSession } from 'next-auth/react';
import { useDashboardData } from '../context/useDashboardData';
import { PiStorefrontLight } from 'react-icons/pi';
import NavBarForDesktop from './NavBarDesktop';

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { data, loading } = useDashboardData(session?.user.id);
  const navItems = getDashboardNavItems(session?.user.role);

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

          <div className="mt-1 w-full rounded-lg border bg-white">
            <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <div className="flex items-center gap-2 px-2 py-1">
                <PiStorefrontLight className="h-6 w-6" />
                <span className="text-sm font-medium text-gray-900">
                  {data?.storeSlug?.name ?? 'متجر'}
                </span>
              </div>

              <svg
                className="ml-2 h-4 w-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
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
