'use client';

import { DollarSign, Home, Settings, ShoppingBag } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { AiOutlineProduct } from 'react-icons/ai';
import { useState, useEffect } from 'react';
 import { useSession } from 'next-auth/react';
import { useDashboardData } from '../_utils/useDashboardData';
import Loader from '@/components/Loader';
 

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
  const inactiveStyle = 'text-black opacity-70 hover:opacity-100';
  const activeStyle = 'text-green-600 opacity-100 font-bold';

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
            <span className="mt-1 text-xs text-gray-700">الرئيسية</span>
          </button>

          <button
            className={`${baseStyle} ${isActive('/Dashboard/OrderTrackingPage') ? activeStyle : inactiveStyle} relative`}
            onClick={() => handleNavigate('/Dashboard/OrderTrackingPage')}
          >
            <ShoppingBag size={20} />
            {data?.pendingOrderCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {data.pendingOrderCount}
              </span>
            )}
            <span className="mt-1 text-xs text-gray-700">الطلبات</span>
          </button>

          <button
            className={`${baseStyle} ${isActive('/Dashboard/ProductManagment') ? activeStyle : inactiveStyle}`}
            onClick={() => handleNavigate('/Dashboard/ProductManagment')}
          >
            <AiOutlineProduct size={20} />
            <span className="mt-1 text-xs text-gray-700">المنتجات</span>
          </button>

          <button
            className={`${baseStyle} ${isActive(`/Dashboard/profit`) ? activeStyle : inactiveStyle}`}
            onClick={() => handleNavigate(`/Dashboard/profit`)}
          >
            <DollarSign size={20} />
            <span className="mt-1 text-xs text-gray-700">العوائد</span>
          </button>
        </div> 
      </div>
    </>
  );
}
