'use client';

import { DollarSign, Home, ShoppingBag, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { AiOutlineProduct } from 'react-icons/ai';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useDashboardData } from '../context/useDashboardData';
import Loader from '@/components/Loader';
import { IoSettingsOutline } from 'react-icons/io5';

const SHOW_MESSAGE_AFTER = 25;
const STORAGE_KEY = 'dashboard_cta_dismissed';

export default function FloatingNavBarForDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { data } = useDashboardData(session?.user.id);

  const [loading, setLoading] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    const startTime = Date.now();

    const timer = setInterval(() => {
      const secondsSpent = Math.floor((Date.now() - startTime) / 1000);

      if (secondsSpent >= SHOW_MESSAGE_AFTER) {
        setShowCTA(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCloseCTA = () => {
    setShowCTA(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleNavigate = (path: string) => {
    if (pathname === path) {
      router.refresh();
    } else {
      setLoading(true);
      router.push(path);
    }
  };

  useEffect(() => {
    if (loading) setLoading(false);
  }, [pathname]);

  const profitPath =
    session?.user.role === 'SUPPLIER'
      ? '/Test-Mode/Dashboard/profit/profit-trader'
      : session?.user.role === 'DROPSHIPPER'
        ? '/Test-Mode/Dashboard/profit/profit-dropshiper'
        : '/Test-Mode/Dashboard/profit';

  const baseStyle = 'flex cursor-pointer flex-col items-center justify-center transition';

  const activeStyle = `
    text-sky-600 font-semibold relative
    after:absolute after:-bottom-1 after:left-1/2
    after:h-[2px] after:w-8 after:-translate-x-1/2
    after:bg-sky-600 after:rounded-full
  `;

  const inactiveStyle = 'text-gray-500 opacity-70 hover:opacity-100';

  const isActive = (path: string) => pathname === path;

  if (pathname.includes('/create-store')) return null;

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur">
          <Loader />
        </div>
      )}

      <div dir="rtl" className="fixed bottom-3 left-1/2 z-50 -translate-x-1/2">
        {showCTA ? (
          <div className="mb-3 flex w-[390px] items-center justify-between gap-3 rounded-2xl bg-gradient-to-l from-sky-500 via-sky-400 to-sky-300 px-4 py-3 text-white shadow-2xl">
            <p className="text-sm leading-snug">عجبتك التجربة ؟ اطلق متجرك الان وخلال دقائق فقط!</p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/login')}
                className="rounded-lg bg-white px-8 py-1 text-xs text-black transition hover:bg-gray-200"
              >
                نشئ متجرك
              </button>

              <button
                onClick={handleCloseCTA}
                className="rounded-full p-1 transition hover:bg-white/15"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex w-72 items-center justify-between rounded-2xl border bg-white px-3 py-2 shadow-xl">
            <button
              className={`${baseStyle} ${
                isActive('/Test-Mode/Dashboard') ? activeStyle : inactiveStyle
              }`}
              onClick={() => handleNavigate('/Test-Mode/Dashboard')}
            >
              <Home size={20} />
              <span className="mt-1 text-xs">الرئيسية</span>
            </button>

            <button
              className={`${baseStyle} ${
                isActive('/Test-Mode/Dashboard/OrderTrackingPage') ? activeStyle : inactiveStyle
              } relative`}
              onClick={() =>
                handleNavigate(
                  session?.user.role === 'SUPPLIER'
                    ? '/Test-Mode/Dashboard/OrderTrackingPage/SupplierOrderTrackingPage'
                    : '/Test-Mode/Dashboard/OrderTrackingPage'
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
              className={`${baseStyle} ${
                isActive('/Test-Mode/Dashboard/ProductManagment') ? activeStyle : inactiveStyle
              }`}
              onClick={() => handleNavigate('/Test-Mode/Dashboard/ProductManagment')}
            >
              <AiOutlineProduct size={20} />
              <span className="mt-1 text-xs">المنتجات</span>
            </button>

            <button
              className={`${baseStyle} ${isActive(profitPath) ? activeStyle : inactiveStyle}`}
              onClick={() => handleNavigate(profitPath)}
            >
              <DollarSign size={20} />
              <span className="mt-1 text-xs">العوائد</span>
            </button>

            <button
              className={`${baseStyle} ${
                isActive('/Test-Mode/Dashboard/setting/store') ? activeStyle : inactiveStyle
              }`}
              onClick={() => handleNavigate('/Test-Mode/Dashboard/setting/store')}
            >
              <IoSettingsOutline size={20} />
              <span className="mt-1 text-xs">الاعدادات</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
