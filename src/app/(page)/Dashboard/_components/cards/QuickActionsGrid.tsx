'use client';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from 'next/navigation';
import { Plus, BarChart, ShoppingCart, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

export default function QuickActionsGrid() {
  const session = useSession();
  const { t } = useLanguage();
  const router = useRouter();

  const actions = [
    {
      path: '/Dashboard/ProductManagment/add-product',
      label: 'إضافة منتج',
      icon: Plus,
      iconColor: 'text-cyan-500', // Matches the cyan/primary tint in image
      bgColor: 'bg-cyan-500/10',
    },
    {
      path: '/Dashboard/analytics',
      label: 'التحليلات',
      icon: BarChart,
      iconColor: 'text-foreground',
      bgColor: 'bg-muted',
    },
    {
      path: '/Dashboard/OrderTrackingPage',
      label: t.orders?.title || 'الطلبات',
      icon: ShoppingCart,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      path: '/Dashboard/ProductManagment',
      label: 'المنتجات',
      icon: Package,
      iconColor: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
  ];

  const getPath = (path: string) => {
    if (session?.data?.user?.role === 'DROPSHIPPER') return '/Dashboard/profit/profit-dropshiper';
    return path;
  };

  return (
    <div className="grid grid-cols-4 gap-2 md:gap-3">
      {actions.map((action, i) => {
        const Icon = action.icon;

        return (
          <motion.button
            key={action.path}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.25 }}
            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -2 }}
            onClick={() => router.push(getPath(action.path))}
            className="border-border bg-card hover:bg-muted/50 flex cursor-pointer flex-col items-center gap-2 rounded-2xl border p-2 transition-all duration-200 md:gap-3 md:p-3"
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 md:h-12 md:w-12 ${action.bgColor}`}
            >
              <Icon className={`h-5 w-5 md:h-6 md:w-6 ${action.iconColor}`} />
            </div>

            <span className="text-foreground text-center text-[10px] font-bold md:text-xs">
              {action.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
