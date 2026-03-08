import { useLanguage } from '../context/LanguageContext';
import { Home, ShoppingBag, DollarSign, Settings, Package, Users, BarChart3 } from 'lucide-react';
import { FaCrown } from 'react-icons/fa';
import { CgFolderAdd } from 'react-icons/cg';
import { PiBoxArrowDown } from 'react-icons/pi';

export const getDashboardNavItems = (role: string | undefined, t: any) => [
  { label: t.nav.home, path: '/Dashboard', icon: Home, show: 'DROPSHIPPER' },
  {
    label: t.inventory.products,
    path: '/Dashboard/ProductManagment',
    icon: Package,
    show: 'DROPSHIPPER',
  },
  {
    label: t.inventory.addProduct,
    path: '/Dashboard/ProductManagment/add-product',
    icon: CgFolderAdd,
    plans: ['trader-basic', 'trader-pro'],
  },
  {
    label: 'العوائد', // Will require a translation key if missing, let's use t.stats?.revenue ?? 'العوائد' or add to translation later. Actually we have t.stats.revenue
    path:
      role === 'SUPPLIER'
        ? `/Dashboard/profit/profit-trader `
        : role === 'DROPSHIPPER'
          ? `/Dashboard/profit/profit-dropshiper `
          : `/Dashboard/profit `,
    icon: DollarSign,
  },
  {
    label: t.orders.title,
    path:
      role === 'SUPPLIER'
        ? '/Dashboard/OrderTrackingPage/SupplierOrderTrackingPage'
        : '/Dashboard/OrderTrackingPage',
    icon: ShoppingBag,
  },
  {
    label: 'الموردين', // Let's use generic string for now, will add suppliers to t later
    path: '/Dashboard/supplier',
    icon: Users,
    show: 'DROPSHIPPER',
    plans: ['drop-basics', 'drop-pro'],
  },

  {
    label: 'المخزن',
    path: '/Dashboard/products-dropwave',
    icon: PiBoxArrowDown,
    show: 'DROPSHIPPER',
    plans: ['drop-basics', 'drop-pro'],
  },
  { label: t.more.stats,  path: '/Dashboard/stats', icon: BarChart3 },
  {
    label: t.more.settingsLabel,
    path: '/Dashboard/setting/store',
    icon: Settings,
    show: 'DROPSHIPPER',
  },
  { label: t.plans.title, path: '/Dashboard/plans', icon: FaCrown, show: 'DROPSHIPPER' },
];
