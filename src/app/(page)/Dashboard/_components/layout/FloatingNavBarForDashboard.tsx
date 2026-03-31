'use client';
import { useLanguage } from '../../context/LanguageContext';

import {
  BarChart3,
  DollarSign,
  Home,
  MoreHorizontal,
  MoreVertical,
  Settings,
  ShoppingBag,
} from 'lucide-react';
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

  const baseStyle =
    'group relative flex min-w-[3.5rem] flex-1 cursor-pointer flex-col items-center justify-start gap-1 p-1 transition-all duration-300';

  const activeStyle = 'text-primary';
  const inactiveStyle = 'text-muted-foreground hover:text-foreground';

  const isActive = (path: string) => pathname === path;

  const hidden = pathname.includes('/create-store') || pathname.includes('/plans');

  return (
    <>
      <div
        dir="rtl"
        className={`${hidden ? 'hidden' : 'fixed'} right-0 bottom-0 left-0 z-50 md:hidden`}
      >
        <div className="border-border/60 bg-background/85 no-scrollbar flex items-end justify-around overflow-x-auto border-t px-1 pt-2 pb-4 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] backdrop-blur-2xl dark:shadow-[0_-8px_30px_rgba(0,0,0,0.3)]">
          <button
            onClick={() => handleNavigate('/Dashboard')}
            className={`${baseStyle} ${isActive('/Dashboard') ? activeStyle : inactiveStyle}`}
          >
            <div className="flex flex-col items-center justify-center">
              <Home size={22} strokeWidth={2} />
              <span className="mt-1 text-[10px] font-medium">{t.nav.home}</span>
            </div>
            {isActive('/Dashboard') && (
              <span className="bg-primary absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
            )}
          </button>

          <button
            onClick={() => handleNavigate('/Dashboard/OrderTrackingPage')}
            className={`${baseStyle} ${isActive('/Dashboard/OrderTrackingPage') ? activeStyle : inactiveStyle}`}
          >
            <div className="relative flex flex-col items-center justify-center">
              <ShoppingBag size={22} strokeWidth={2} />
              {pendingCount > 0 && (
                <span className="ring-background absolute -top-1.5 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2">
                  {pendingCount > 9 ? '9+' : pendingCount}
                </span>
              )}
              <span className="mt-1 text-[10px] font-medium">{t.orders.title}</span>
            </div>
            {isActive('/Dashboard/OrderTrackingPage') && (
              <span className="bg-primary absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
            )}
          </button>
          <button
            onClick={() => handleNavigate('/Dashboard/ProductManagment')}
            className={`${baseStyle} ${isActive('/Dashboard/ProductManagment') ? activeStyle : inactiveStyle}`}
          >
            <div className="flex flex-col items-center justify-center">
              <AiOutlineProduct size={22} />
              <span className="mt-1 text-[10px] font-medium">{t.inventory.products}</span>
            </div>
            {isActive('/Dashboard/ProductManagment') && (
              <span className="bg-primary absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
            )}
          </button>
          {/* <button
            onClick={() => handleNavigate(profitPath)}
            className={`${baseStyle} ${isActive(profitPath) ? activeStyle : inactiveStyle}`}
          >
            <div className="flex flex-col items-center justify-center">
              <DollarSign size={22} strokeWidth={2} />
              <span className="mt-1 text-[10px] font-medium">{t.stats.revenue}</span>
            </div>
            {isActive(profitPath) && (
               <span className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
            )}
          </button> */}

          {/* Stats */}
          <button
            onClick={() => handleNavigate('/Dashboard/stats')}
            className={`${baseStyle} ${isActive('/Dashboard/stats') ? activeStyle : inactiveStyle}`}
          >
            <div className="flex flex-col items-center justify-center">
              <BarChart3 size={22} strokeWidth={2} />
              <span className="mt-1 text-[10px] font-medium">{t.stats?.title || 'الإحصائيات'}</span>
            </div>
            {isActive('/Dashboard/stats') && (
              <span className="bg-primary absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
            )}
          </button>

          <button
            onClick={() => handleNavigate('/Dashboard/setting/store')}
            className={`${baseStyle} ${isActive('/Dashboard/setting/store') ? activeStyle : inactiveStyle}`}
          >
            <div className="flex flex-col items-center justify-center">
              <MoreHorizontal size={22} strokeWidth={2} />
              <span className="mt-1 text-[10px] font-medium">{t.more.title}</span>
            </div>
            {isActive('/Dashboard/setting/store') && (
              <span className="bg-primary absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}
