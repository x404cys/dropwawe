'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

import { Home, Package, ShoppingBag, Settings, Users } from 'lucide-react';
import { PiStorefrontLight, PiBoxArrowDown } from 'react-icons/pi';
import { FaCrown } from 'react-icons/fa';
import { CgFolderAdd } from 'react-icons/cg';

import NavBarForDesktop from './NavBarDesktop';

const STORE_DATA = {
  id: 'store_001',
  name: 'متجر عبدالرحمن',
};

const DASHBOARD_NAV_ITEMS = [
  { label: 'الرئيسية', path: '/Test-Mode/Dashboard', icon: Home },
  { label: 'المنتجات', path: '/Test-Mode/Dashboard/ProductManagment', icon: Package },
  {
    label: 'اضافة منتج',
    path: '/Test-Mode/Dashboard/ProductManagment/add-product',
    icon: CgFolderAdd,
  },
  {
    label: 'الطلبات',
    path: '/Test-Mode/Dashboard/OrderTrackingPage',
    icon: ShoppingBag,
  },
  { label: 'الموردين', path: '/Test-Mode/Dashboard/supplier', icon: Users },
  {
    label: 'المخزن',
    path: '/Test-Mode/Dashboard/products-dropwave',
    icon: PiBoxArrowDown,
  },
  { label: 'الاعدادات', path: '/Test-Mode/Dashboard/setting/store', icon: Settings },
  { label: 'الباقات', path: '/Test-Mode/Dashboard/plans', icon: FaCrown },
];

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <section dir="rtl" className="hidden min-h-screen bg-[#F8F8F8] md:flex">
      <aside className="w-72 border-l bg-[#F8F8F8]">
        <div className="flex items-center gap-8 p-4">
          <Link href="/">
            <div className="flex cursor-pointer items-center gap-2">
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

        {/* Store Selector */}
        <div className="px-6 py-4">
          <p className="text-xs text-gray-400">متجرك</p>

          <div className="mt-1 rounded-lg border bg-white">
            <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <PiStorefrontLight className="h-6 w-6" />
                <span>{STORE_DATA.name}</span>
              </div>

              <svg
                className="h-4 w-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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

        <nav className="mt-4 px-4 text-sm">
          <Section title="عام" items={DASHBOARD_NAV_ITEMS} pathname={pathname} />
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <NavBarForDesktop />
        <main className="flex-1 overflow-y-auto p-2">{children}</main>
      </div>
    </section>
  );
}

function Section({
  title,
  items,
  pathname,
}: {
  title: string;
  items: {
    label: string;
    path: string;
    icon: any;
  }[];
  pathname: string;
}) {
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
                  ? 'bg-gradient-to-r from-sky-300/40 via-[#04BAF6] to-[#04BAF6] text-white'
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
