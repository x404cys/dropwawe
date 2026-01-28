'use client';
import { useState } from 'react';
import {
  Home,
  Users,
  ShoppingCart,
  BarChart2,
  Settings,
  Package,
  Store,
  Menu,
  X,
  DollarSignIcon,
} from 'lucide-react';
import Image from 'next/image';
import Logo from '@/components/utils/Logo';
import { useSession } from 'next-auth/react';
import { useSidebar } from '../context/SideBarContext';
import { useRouter } from 'next/navigation';
import { MdLeaderboard, MdPayment } from 'react-icons/md';
import { FaMoneyBillTransfer } from 'react-icons/fa6';

export default function Sidebar() {
  const { activeSection, setActiveSection } = useSidebar();
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems: { name: string; key: string; icon: React.ElementType }[] = [
    { name: 'الرئيسية', key: '/admin', icon: Home },
    { name: 'المتاجر', key: '/admin/stores', icon: Store },
    { name: 'المستخدمين', key: '/admin/users', icon: Users },
    { name: 'الطلبات', key: '/admin/orders', icon: ShoppingCart },
    { name: 'عمليات الدفع', key: '/admin/payment', icon: DollarSignIcon },
    { name: 'كشف حساب', key: '/admin/trader-profit', icon: FaMoneyBillTransfer },
    { name: 'الاشتراكات', key: '/admin/subscriptions', icon: MdPayment },
    { name: 'المنتجات', key: '/admin/products', icon: Package },
    { name: 'التقارير', key: '/admin/stats', icon: BarChart2 },
    { name: 'Leaderboard', key: '/admin/Leaderboard', icon: MdLeaderboard },
  ];

  return (
    <aside dir="rtl" className="hidden w-64 shrink-0 md:block">
      <div
        className={`fixed inset-y-0 right-0 z-50 h-full w-64 border-e border-gray-200 bg-white transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-full flex-col justify-between px-4">
          <div>
            <div className="mt-5 mb-5">
              <div className="flex items-center gap-2">
                <div className="relative h-10 w-10 rounded-2xl md:h-8 md:w-8">
                  <Image
                    src="/Logo-Matager/Matager-logo2.PNG"
                    alt="Matager Logo"
                    fill
                    className="rounded-xl object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-sm font-semibold md:text-xl">Matager</h1>
                </div>
              </div>
            </div>
            <ul className="space-y-2">
              {menuItems.map(item => {
                const Icon = item.icon;
                const isActive = activeSection === item.key;

                return (
                  <li key={item.key}>
                    <button
                      onClick={() => {
                        router.push(item.key);
                        setIsOpen(false);
                      }}
                      className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="border-t border-gray-100 p-4">
            {session?.user && (
              <div className="flex items-center gap-3">
                <img
                  src={session.user.image as string}
                  alt={session.user.name || 'User'}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <p className="text-xs text-gray-500">{session.user.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black opacity-30 md:hidden"
        />
      )}
    </aside>
  );
}
