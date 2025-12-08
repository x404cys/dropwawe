'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Menu,
  X,
  Users,
  LogOut,
  Home,
  BarChart3,
  Package,
  ShoppingCart,
  Settings,
  Store,
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { MdOutlineLeaderboard } from 'react-icons/md';
import { useSidebar } from '../context/SideBarContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
const ResponsiveNavbar = () => {
  const { activeSection, setActiveSection } = useSidebar();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  const navItems: { name: string; key: string; icon: React.ElementType }[] = [
    { name: 'الرئيسية', key: '/', icon: Home },
    { name: 'الإحصائيات', key: '/admin/stats', icon: BarChart3 },
    { name: 'المستخدمين', key: '/admin/users', icon: Users },
    { name: 'المنتجات', key: '/admin/products', icon: Package },
    { name: 'الطلبات', key: '/admin/orders', icon: ShoppingCart },
    { name: 'متاجر', key: '/admin/stores', icon: Store },
    {
      name: 'ليدر بورد',
      key: 'Leaderboard',
      icon: MdOutlineLeaderboard,
    },
  ];

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    window.location.href = 'https://www.dropwave.cloud';
  };

  return (
    <nav
      dir="rtl"
      className="sticky top-0 z-50 border-b-2 border-gray-200/60 bg-white/80 backdrop-blur-md md:hidden"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/IMG_3549.PNG"
              alt="Sahl"
              width={50}
              height={50}
              className="h-10 w-10 md:h-16 md:w-16"
            />
            <div className="flex flex-col">
              <h1 className="text-lg font-bold md:text-2xl">داشبورد</h1>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center gap-1">
              {navItems.map(item => (
                <a
                  key={item.name}
                  className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 sm:flex">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {session?.user?.name || 'المدير'}
                </p>
                <p className="text-xs text-gray-500">مدير النظام</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <Users className="h-4 w-4 text-gray-950" />
              </div>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-xl bg-gray-50 p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-gray-200/60 bg-white py-4 md:hidden"
        >
          <div className="space-y-2">
            <ul className="space-y-2">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeSection === item.key;

                return (
                  <li key={item.key}>
                    <button
                      onClick={() => {
                        router.push(item.key);
                        setIsMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition ${
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
            <div className="mt-4 border-t border-gray-200/60 pt-4">
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {session?.user?.name || 'المدير'}
                  </p>
                  <p className="text-xs text-gray-500">مدير النظام</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default ResponsiveNavbar;
