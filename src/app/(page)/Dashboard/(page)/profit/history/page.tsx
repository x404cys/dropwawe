'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useStoreProvider } from '../../../context/StoreContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaMoneyBillWave, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { MdOutlineReceiptLong } from 'react-icons/md';

interface LedgerEntry {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number | null;
  note: string | null;
  createdAt: string;
  order?: {
    id: string;
    total: number;
  } | null;
}

interface Balance {
  available: number;
  pending: number;
}

export default function ProfitHistoryPage() {
  const { currentStore } = useStoreProvider();
  const storeId = currentStore?.id;

  const [history, setHistory] = useState<LedgerEntry[]>([]);
  const [balance, setBalance] = useState<Balance>({ available: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storeId) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/dashboard/profit/history?storeId=${storeId}`);
        setHistory(res.data.history);
        setBalance(res.data.balance);
      } catch (err) {
        console.error(err);
        setError('فشل تحميل سجل المعاملات المالية');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [storeId]);

  const formatCurrency = (num: number) =>
    new Intl.NumberFormat('en-IQ', {
      style: 'currency',
      currency: 'IQD',
      minimumFractionDigits: 0,
    }).format(num);

  const getLedgerTypeLabel = (type: string) => {
    switch (type) {
      case 'PAYMENT_RECEIVED':
        return { label: 'دفعة مستلمة', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
      case 'ORDER_PROFIT':
        return { label: 'أرباح طلب', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
      case 'PLATFORM_FEE':
        return { label: 'رسوم المنصة', color: 'text-red-500', bg: 'bg-red-500/10' };
      case 'WITHDRAW_REQUEST':
        return { label: 'طلب سحب', color: 'text-orange-500', bg: 'bg-orange-500/10' };
      case 'WITHDRAW_APPROVED':
        return { label: 'سحب مكتمل', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
      case 'REFUND':
        return { label: 'استرجاع', color: 'text-red-500', bg: 'bg-red-500/10' };
      default:
        return { label: type, color: 'text-gray-500', bg: 'bg-gray-500/10' };
    }
  };

  if (!storeId) {
    return <div className="text-muted-foreground p-8 text-center">جاري تحميل المتجر...</div>;
  }

  return (
    <section className="mx-auto max-w-6xl p-4 md:p-6" dir="rtl">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="bg-primary/10 flex size-12 items-center justify-center rounded-xl">
          <MdOutlineReceiptLong className="text-primary size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">سجل المعاملات المالية</h1>
          <p className="text-muted-foreground text-sm">متابعة كافة حركات الرصيد والسحوبات</p>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-emerald-600/80">الرصيد المتاح للسحب</p>
              <p className="mt-1 text-3xl font-bold text-emerald-600">
                {formatCurrency(balance.available)}
              </p>
            </div>
            <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600">
              <FaCheckCircle className="size-7" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-orange-600/80">الرصيد المعلق</p>
              <p className="mt-1 text-3xl font-bold text-orange-600">
                {formatCurrency(balance.pending)}
              </p>
            </div>
            <div className="flex size-14 items-center justify-center rounded-full bg-orange-500/20 text-orange-600">
              <FaClock className="size-7" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">سجل الحركات</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="border-muted border-t-primary size-10 animate-spin rounded-full border-4" />
            </div>
          ) : error ? (
            <div className="py-10 text-center text-red-500">{error}</div>
          ) : history.length === 0 ? (
            <div className="text-muted-foreground py-10 text-center">
              لا توجد معاملات مالية حتى الآن.
            </div>
          ) : (
            <div className="space-y-4">
              {history.map(entry => {
                const typeInfo = getLedgerTypeLabel(entry.type);
                const isPositive = [
                  'PAYMENT_RECEIVED',
                  'ORDER_PROFIT',
                  'WITHDRAW_APPROVED',
                ].includes(entry.type);

                return (
                  <div
                    key={entry.id}
                    className="hover:bg-muted/30 flex flex-col justify-between gap-4 rounded-xl border p-4 transition sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex size-12 shrink-0 items-center justify-center rounded-full ${typeInfo.bg}`}
                      >
                        <FaMoneyBillWave className={`size-5 ${typeInfo.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{typeInfo.label}</p>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${typeInfo.bg} ${typeInfo.color}`}
                          >
                            {entry.type === 'REFUND' ? 'استرجاع' : entry.type}
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {new Date(entry.createdAt).toLocaleString('ar-IQ')}
                        </p>
                        {entry.note && (
                          <p className="text-muted-foreground mt-0.5 text-xs">{entry.note}</p>
                        )}
                        {entry.order && (
                          <p className="text-muted-foreground mt-0.5 text-xs">
                            رقم الطلب: {entry.order.id.slice(-6)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-left">
                      <p
                        className={`text-right text-lg font-bold sm:text-left ${isPositive ? 'text-emerald-500' : 'text-foreground'}`}
                      >
                        {isPositive ? '+' : '-'}
                        {formatCurrency(entry.amount)}
                      </p>
                      {entry.balanceAfter !== null && (
                        <p className="text-muted-foreground mt-1 text-right text-xs sm:text-left">
                          الرصيد بعد الحركة: {formatCurrency(entry.balanceAfter)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
