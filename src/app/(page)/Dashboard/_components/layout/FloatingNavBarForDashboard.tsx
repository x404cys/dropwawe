'use client';
import { useLanguage } from '../../context/LanguageContext';

import { BarChart3, DollarSign, Home, Settings, ShoppingBag } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { AiOutlineProduct } from 'react-icons/ai';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useDashboardData } from '../../context/useDashboardData';
import Loader from '@/components/Loader';
import { useStoreProvider } from '../../context/StoreContext';
import { usePendingOrders } from '../../hooks/usePendingOrders';

export default function FloatingNavBarForDashboard() {
  const { t } = useLanguage();
  const router = useRouter();
  const { data: session } = useSession();
  const { currentStore } = useStoreProvider();
  const { data } = useDashboardData(session?.user.id);

  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const { pendingCount } = usePendingOrders(currentStore?.id);

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
      ? '/Dashboard/profit/profit-trader'
      : session?.user.role === 'DROPSHIPPER'
        ? '/Dashboard/profit/profit-dropshiper'
        : '/Dashboard/profit';

  const baseStyle = 'flex cursor-pointer flex-col items-center justify-center gap-0.5 transition';

  const activeStyle =
    "text-primary relative after:content-[''] after:absolute after:-bottom-1.5 after:left-1/2 after:h-[3px] after:w-8 after:-translate-x-1/2 after:bg-primary after:rounded-full transition-all duration-200";

  const inactiveStyle = 'text-muted-foreground hover:text-foreground transition-all duration-200';

  const isActive = (path: string) => pathname === path;

  const hidden = pathname.includes('/create-store') || pathname.includes('/plans');

  return (
    <>
      <div
        dir="rtl"
        className={`${hidden ? 'hidden' : 'fixed'} bottom-0 left-1/2 z-50 -translate-x-1/2 md:hidden`}
      >
        <div className="border-border bg-card flex items-center gap-1 border px-4 py-2 shadow-lg shadow-black/10 backdrop-blur-sm">
          {/* Home */}
          <button
            onClick={() => handleNavigate('/Dashboard')}
            className={`${baseStyle} px-3 py-1 ${isActive('/Dashboard') ? activeStyle : inactiveStyle}`}
          >
            <Home size={20} />
            <span className="text-[10px] font-medium">{t.nav.home}</span>
          </button>

          {/* Products */}
          <button
            onClick={() => handleNavigate('/Dashboard/ProductManagment')}
            className={`${baseStyle} px-3 py-1 ${isActive('/Dashboard/ProductManagment') ? activeStyle : inactiveStyle}`}
          >
            <AiOutlineProduct size={20} />
            <span className="text-[10px] font-medium">{t.inventory.products}</span>
          </button>

          {/* Orders */}
          <button
            onClick={() => handleNavigate('/Dashboard/OrderTrackingPage')}
            className={`${baseStyle} relative px-3 py-1 ${isActive('/Dashboard/OrderTrackingPage') ? activeStyle : inactiveStyle}`}
          >
            <ShoppingBag size={20} />
            {pendingCount > 0 && (
              <span className="absolute -top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {pendingCount > 9 ? '9+' : pendingCount}
              </span>
            )}
            <span className="text-[10px] font-medium">{t.orders.title}</span>
          </button>

          {/* Revenue */}
          <button
            onClick={() => handleNavigate(profitPath)}
            className={`${baseStyle} px-3 py-1 ${isActive(profitPath) ? activeStyle : inactiveStyle}`}
          >
            <DollarSign size={20} />
            <span className="text-[10px] font-medium">{t.stats.revenue}</span>
          </button>
          <button
            onClick={() => handleNavigate('/Dashboard/stats')}
            className={`${baseStyle} px-3 py-1 ${isActive('/Dashboard/stats') ? activeStyle : inactiveStyle}`}
          >
            <BarChart3 size={20} />
            <span className="text-[10px] font-medium">{t.stats?.title || 'الإحصائيات'}</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => handleNavigate('/Dashboard/setting/store')}
            className={`${baseStyle} px-3 py-1 ${isActive('/Dashboard/setting/store') ? activeStyle : inactiveStyle}`}
          >
            <Settings size={20} />
            <span className="text-[10px] font-medium">{t.more.settingsLabel}</span>
          </button>
        </div>
      </div>
    </>
  );
}
