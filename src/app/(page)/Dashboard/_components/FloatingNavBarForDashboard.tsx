'use client';

import { DollarSign, Home, Settings, ShoppingBag } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { AiOutlineProduct } from 'react-icons/ai';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useDashboardData } from '../_utils/useDashboardData';
import Loader from '@/components/Loader';
import { IoSettingsOutline } from 'react-icons/io5';

export default function FloatingNavBarForDashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data } = useDashboardData(session?.user.id);

  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const handleNavigate = (path: string) => {
    if (pathname === path) {
      router.refresh();
    } else {
      setLoading(true);
      router.push(path);
    }
  };

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [pathname]);

  const baseStyle = 'flex cursor-pointer flex-col items-center justify-center transition';
  const activeStyle = `
  text-sky-600 font-semibold relative
  after:content-[''] after:absolute after:-bottom-1 after:left-1/2
  after:h-[2px] after:w-10 after:-translate-x-1/2
  after:bg-sky-600 after:rounded-full
  transition-all duration-200 ease-out 
`;

  const inactiveStyle = `
  text-gray-500 opacity-70 hover:opacity-100
  transition-all duration-200 ease-out scale-100
`;

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center space-y-4 bg-white/70 backdrop-blur-sm">
          <Loader />
        </div>
      )}

      <div dir="rtl" className="fixed bottom-3 left-1/2 z-50 mt-20 -translate-x-1/2">
        <div className="flex w-72 items-center justify-between rounded-2xl border bg-[#ffffff] px-3 py-2 shadow-xl">
          <button
            className={`${baseStyle} ${isActive('/Dashboard') ? activeStyle : inactiveStyle}`}
            onClick={() => handleNavigate('/Dashboard')}
          >
            <Home size={20} />
            <span className="mt-1 text-xs">الرئيسية</span>
          </button>

          <button
            className={`${baseStyle} ${isActive('/Dashboard/OrderTrackingPage') ? activeStyle : inactiveStyle} relative`}
            onClick={() =>
              handleNavigate(
                `${session?.user.role === 'SUPPLIER' ? '/Dashboard/OrderTrackingPage/SupplierOrderTrackingPage' : '/Dashboard/OrderTrackingPage'}`
              )
            }
          >
            <ShoppingBag size={20} />
            {data?.pendingOrderCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {data.pendingOrderCount}
              </span>
            )}
            <span className="mt-1 text-xs">الطلبات</span>
          </button>

          <button
            className={`${baseStyle} ${isActive('/Dashboard/ProductManagment') ? activeStyle : inactiveStyle}`}
            onClick={() => handleNavigate('/Dashboard/ProductManagment')}
          >
            <AiOutlineProduct size={20} />
            <span className="mt-1 text-xs">المنتجات</span>
          </button>

          <button
            className={`${baseStyle} ${isActive(`/Dashboard/profit`) ? activeStyle : inactiveStyle}`}
            onClick={() => handleNavigate(`/Dashboard/profit`)}
          >
            <DollarSign size={20} />
            <span className="mt-1 text-xs">العوائد</span>
          </button>
          <button
            className={`${baseStyle} ${isActive(`/Dashboard/setting/store`) ? activeStyle : inactiveStyle}`}
            onClick={() => handleNavigate(`/Dashboard/setting/store`)}
          >
            <IoSettingsOutline size={20} />
            <span className="mt-1 text-xs">الاعدادات</span>
          </button>
        </div>
      </div>
    </>
  );
}
