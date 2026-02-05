import { Home, ShoppingBag, DollarSign, Settings, Package, Users } from 'lucide-react';
import { FaCrown } from 'react-icons/fa';
import { CgFolderAdd } from 'react-icons/cg';
import { PiBoxArrowDown } from 'react-icons/pi';

export const getDashboardNavItems = (role?: string) => [
  { label: 'الرئيسية', path: '/Dashboard', icon: Home },
  { label: 'المنتجات', path: '/Dashboard/ProductManagment', icon: Package },
  { label: 'اضافة منتج', path: '/Dashboard/ProductManagment/add-product', icon: CgFolderAdd },
  {
    label: 'الطلبات',
    path:
      role === 'SUPPLIER'
        ? '/Dashboard/OrderTrackingPage/SupplierOrderTrackingPage'
        : '/Dashboard/OrderTrackingPage',
    icon: ShoppingBag,
  },
  { label: 'الموردين', path: '/Dashboard/supplier', icon: Users },
  { label: 'المخزن', path: '/Dashboard/products-dropwave', icon: PiBoxArrowDown },
  { label: 'الاعدادات', path: '/Dashboard/setting/store', icon: Settings },
  { label: 'الباقات', path: '/Dashboard/plans', icon: FaCrown },
];
