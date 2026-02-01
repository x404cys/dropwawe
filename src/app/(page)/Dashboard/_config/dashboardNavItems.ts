import { Home, ShoppingBag, DollarSign, Settings, Package, Users } from 'lucide-react';
import { FaCrown } from 'react-icons/fa';

export const getDashboardNavItems = (role?: string) => [
  { label: 'الرئيسية', path: '/Dashboard', icon: Home },
  { label: 'المنتجات', path: '/Dashboard/ProductManagment', icon: Package },
  { label: 'اضافة منتج', path: '/Dashboard/ProductManagment/add-product', icon: ShoppingBag },
  {
    label: 'الطلبات',
    path:
      role === 'SUPPLIER'
        ? '/Dashboard/OrderTrackingPage/SupplierOrderTrackingPage'
        : '/Dashboard/OrderTrackingPage',
    icon: DollarSign,
  },
  { label: 'الموردين', path: '/Dashboard/supplier', icon: Users },
  { label: 'المخزن', path: '/Dashboard/products-dropwave', icon: Package },
  { label: 'الاعدادات', path: '/Dashboard/setting/store', icon: Settings },
  { label: 'الباقات', path: '/Dashboard/plans', icon: FaCrown },
];
