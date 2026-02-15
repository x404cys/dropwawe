import { Home, ShoppingBag, DollarSign, Settings, Package, Users } from 'lucide-react';
import { FaCrown } from 'react-icons/fa';
import { CgFolderAdd } from 'react-icons/cg';
import { PiBoxArrowDown } from 'react-icons/pi';

export const getDashboardNavItems = (role?: string) => [
  { label: 'الرئيسية', path: '/Dashboard', icon: Home, show: 'DROPSHIPPER' },
  { label: 'المنتجات', path: '/Dashboard/ProductManagment', icon: Package, show: 'DROPSHIPPER' },
  {
    label: 'اضافة منتج',
    path: '/Dashboard/ProductManagment/add-product',
    icon: CgFolderAdd,
    plans: ['trader-basic', 'trader-pro'],
  },
  {
    label: 'العوائد',
    path:
      role === 'SUPPLIER'
        ? `/Dashboard/profit/profit-trader `
        : role === 'DROPSHIPPER'
          ? `/Dashboard/profit/profit-dropshiper `
          : `/Dashboard/profit `,
    icon: DollarSign,
  },
  {
    label: 'الطلبات',
    path:
      role === 'SUPPLIER'
        ? '/Dashboard/OrderTrackingPage/SupplierOrderTrackingPage'
        : '/Dashboard/OrderTrackingPage',
    icon: ShoppingBag,
  },
  {
    label: 'الموردين',
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
  { label: 'الاعدادات', path: '/Dashboard/setting/store', icon: Settings, show: 'DROPSHIPPER' },
  { label: 'الباقات', path: '/Dashboard/plans', icon: FaCrown, show: 'DROPSHIPPER' },
];
