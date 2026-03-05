'use client';

import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from 'next/navigation';
import {
  Clock,
  ShoppingCart,
  CheckCircle,
  Truck,
  Package,
  XCircle,
  ChevronLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { OrderDetails } from '@/app/(page)/Dashboard/(page)/orderDetails/[orderId]/page';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { Button } from '@/components/ui/button';

interface RecentOrdersPanelProps {
  orders?: OrderDetails[];
}

export default function RecentOrdersPanel({ orders = [] }: RecentOrdersPanelProps) {
  const { t } = useLanguage();
  const router = useRouter();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          color: 'text-amber-700',
          bgColor: 'bg-amber-50 border-amber-200',
          label: 'قيد المعالجة',
          icon: <Clock className="h-4 w-4" />,
        };
      case 'CONFIRMED':
        return {
          color: 'text-emerald-700',
          bgColor: 'bg-emerald-50 border-emerald-200',
          label: 'مؤكد',
          icon: <CheckCircle className="h-4 w-4" />,
        };
      case 'SHIPPED':
        return {
          color: 'text-blue-700',
          bgColor: 'bg-blue-50 border-blue-200',
          label: 'تم الشحن',
          icon: <Truck className="h-4 w-4" />,
        };
      case 'DELIVERED':
        return {
          color: 'text-green-700',
          bgColor: 'bg-green-50 border-green-200',
          label: 'تم التسليم',
          icon: <Package className="h-4 w-4" />,
        };
      case 'CANCELLED':
        return {
          color: 'text-red-700',
          bgColor: 'bg-red-50 border-red-200',
          label: t.orders?.cancelled || 'ملغي',
          icon: <XCircle className="h-4 w-4" />,
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted border-muted-foreground/20',
          label: status,
          icon: <Clock className="h-4 w-4" />,
        };
    }
  };

  return (
    <div className="bg-card mt-6 overflow-hidden rounded-2xl border shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-5">
        <h2 className="text-foreground flex items-center gap-2 font-bold">
          {t.orders?.title || 'أحدث الطلبات'}
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer rounded-lg text-xs"
          onClick={() => router.push('/Dashboard/OrderTrackingPage')}
        >
          {(t.orders as any)?.viewAll || 'عرض الكل'}
        </Button>
      </div>

      <div className="divide-y">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
            <div className="bg-muted mb-4 rounded-full p-4">
              <ShoppingCart className="text-muted-foreground h-8 w-8" />
            </div>
            <h3 className="text-foreground mb-1 text-lg font-semibold">لا توجد طلبات حديثة</h3>
            <p className="text-muted-foreground text-sm">
              عندما يقوم العملاء بالشراء، ستظهر طلباتهم هنا.
            </p>
          </div>
        ) : (
          orders.slice(0, 5).map((order, idx) => {
            const statusConfig = getStatusConfig(order.status);
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={order.id}
                onClick={() => router.push(`/Dashboard/orderDetails/${order.id}`)}
                className="hover:bg-muted/30 flex cursor-pointer items-center justify-between p-4 px-6 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border ${statusConfig.bgColor} ${statusConfig.color}`}
                  >
                    {statusConfig.icon}
                  </div>
                  <div>
                    <h3 className="text-foreground text-sm font-semibold">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </h3>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {order.fullName} • {new Date(order.createdAt).toLocaleDateString('ar-IQ')}
                    </p>
                  </div>
                </div>

                <div className="direction-ltr flex items-center gap-4 text-left">
                  <div className="flex flex-col items-end">
                    <span className="text-foreground text-sm font-bold">
                      {order.total ? formatIQD(order.total) : '0 د.ع'}
                    </span>
                    <span
                      className={`mt-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusConfig.bgColor} ${statusConfig.color}`}
                    >
                      {statusConfig.label}
                    </span>
                  </div>
                  <ChevronLeft className="text-muted-foreground h-5 w-5" />
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
