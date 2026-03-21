import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Package, MapPin, Truck, Clock, Check, X, CreditCard, Banknote } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { Order } from '@/types/Products';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { CgMoreVertical } from 'react-icons/cg';
import { useRouter } from 'next/navigation';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | string;

interface OrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus?: (orderId: string, newStatus: OrderStatus) => void;
}

const STATUS_FLOW: {
  status: OrderStatus;
  label: string;
  icon: typeof Check;
  variant: 'default' | 'destructive' | 'outline';
}[] = [
  { status: 'CONFIRMED', label: 'تأكيد الطلب', icon: Check, variant: 'default' },

  { status: 'CANCELLED', label: 'إلغاء الطلب', icon: X, variant: 'destructive' },
];

const OrderDetailDialog = ({
  order,
  open,
  onOpenChange,
  onUpdateStatus,
}: OrderDetailDialogProps) => {
  const { t, lang } = useLanguage();
  if (!order) return null;
  const router = useRouter();
  const status = lang === 'ku' ? order.status : order.status;

  const itemsToDisplay = order.items || [];

  const getAvailableActions = () => {
    switch (order.status) {
      case 'PENDING':
        return STATUS_FLOW.filter(s => s.status === 'CONFIRMED' || s.status === 'CANCELLED');
      case 'CONFIRMED':
        return STATUS_FLOW.filter(s => s.status === 'SHIPPED' || s.status === 'CANCELLED');
      case 'SHIPPED':
        return STATUS_FLOW.filter(s => s.status === 'CONFIRMED' || s.status === 'CANCELLED');
      default:
        return [];
    }
  };

  const actions = getAvailableActions();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="mx-auto max-w-sm text-right">
        <DialogHeader className="text-right">
          <DialogTitle className="flex items-center gap-2 text-right text-base">
            {t.orders.orderDetails} {order.id.slice(0, 8).toUpperCase()}#
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={`''} rounded-full px-2 py-1 text-xs font-medium`}>{status}</span>
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3" />
              {order.createdAt}
            </span>
          </div>

          {/* Payment Method */}

          {/* Customer */}
          <div className="bg-muted space-y-1 rounded-lg p-3">
            <p className="text-foreground text-sm font-medium">{order.fullName}</p>
            <p className="text-muted-foreground text-xs" dir="ltr">
              {order.phone || '0770 123 4567'}
            </p>
            <p className="text-muted-foreground flex items-center gap-1 text-xs">
              <MapPin className="h-3 w-3" />
              {order.location || (lang === 'ku' ? 'بەغدا، حەیی المنسوور' : 'بغداد، حي المنصور')}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-muted-foreground flex items-center gap-1 text-xs font-semibold">
              <Package className="h-3 w-3" />
              {t.orders.products}
            </h4>
            <div className="bg-card border-border divide-border divide-y rounded-lg border">
              {itemsToDisplay.length > 0 ? (
                itemsToDisplay.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2">
                    <div>
                      <p className="text-foreground text-sm">{item.name}</p>
                      <p className="text-muted-foreground text-[11px]">الكمية: {item.quantity}</p>
                      <img src={item.product?.image} alt="" className="h-12 w-12" />
                    </div>
                    {item.color && (
                      <div className="flex items-center gap-1">
                        <span className="h-3 w-3 rounded-full border" />
                        <span className="text-muted-foreground text-xs">{item.color}</span>
                      </div>
                    )}
                    {item.size && (
                      <span className="text-muted-foreground text-xs">{item.size}</span>
                    )}
                    <span className="text-foreground text-sm font-medium">
                      {item.price.toLocaleString('ar-IQ')} {t.currency}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground p-4 text-center text-xs">لا توجد منتجات</div>
              )}
            </div>
          </div>

          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <Truck className="h-3.5 w-3.5" />
            <span>
              {t.orders.deliveryStatus}:
              {status === 'PENDING'
                ? t.orders.new
                : status === 'CONFIRMED'
                  ? t.orders.completed
                  : status === 'SHIPPED'
                    ? t.orders.deliveryStatus
                    : status === 'DELIVERED'
                      ? t.orders.completed
                      : status === 'CANCELLED'
                        ? t.orders.cancelled
                        : ''}
            </span>
          </div>

          <div className="border-border flex items-center justify-between border-t pt-3">
            <span className="text-foreground text-sm font-semibold">{t.orders.total}</span>
            <span className="text-primary text-base font-bold">
              {formatIQD(order.total)} {t.currency}
            </span>
          </div>

          <div className="flex gap-2 pt-1">
            {actions.map(action => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.status}
                  variant={action.variant}
                  size="sm"
                  className="flex-1 cursor-pointer gap-1.5 text-xs"
                  onClick={() => {
                    onUpdateStatus?.(order.id, action.status);
                    onOpenChange(false);
                  }}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {`${order.status === 'SHIPPED' && action.status === 'CONFIRMED' ? 'تاكيد اتمام التوصيل' : action.label}`}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full flex-1 cursor-pointer gap-1.5 text-xs hover:bg-none"
            onClick={() => router.push(`/Dashboard/orderDetails/${order.id}`)}
          >
            <span>تفاصيل اكثر</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
