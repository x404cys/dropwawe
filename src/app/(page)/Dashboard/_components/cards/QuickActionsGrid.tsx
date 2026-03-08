'use client';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from 'next/navigation';
import { Plus, ShoppingBag, DollarSign, Settings } from 'lucide-react';
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
      primary: true,
    },
    {
      path: '/Dashboard/OrderTrackingPage',
      label: t.orders?.title || 'أحدث الطلبات',
      icon: ShoppingBag,
    },
    {
      path: '/Dashboard/profit/profit-dropshiper',
      label: t.profit?.title || 'الربح',
      icon: DollarSign,
    },
    {
      path: '/Dashboard/settings',
      label: t.settings?.title || 'الإعدادات',
      icon: Settings,
    },
  ];

  const getPath = (path: string) => {
    if (session?.data?.user?.role === 'DROPSHIPPER') return '/Dashboard/profit/profit-dropshiper';
    return path;
  };

  return (
    <div className="grid grid-cols-4 gap-2.5">
      {actions.map((action, i) => {
        const Icon = action.icon;

        const isPrimary = action.primary;

        return (
          <motion.button
            key={action.path}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.25 }}
            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -2 }}
            onClick={() => router.push(getPath(action.path))}
            className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-3 transition-all duration-200 ${
              isPrimary
                ? 'bg-card text-primary-foreground border-primary/10 shadow-sm'
                : 'bg-card border-border hover:bg-muted/50 border-primary/10'
            } `}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                isPrimary ? 'bg-primary/10' : 'bg-muted'
              } `}
            >
              <Icon
                className={`h-5 w-5 ${
                  isPrimary ? 'text-primary' : 'text-muted-foreground'
                }`}
              />
            </div>

            <span
              className={`text-center text-[11px] leading-tight font-semibold ${
                isPrimary ? 'text-muted-foreground' : 'text-foreground'
              }`}
            >
              {action.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
