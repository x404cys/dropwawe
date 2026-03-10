'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  ReceiptText,
  Wallet,
  Clock,
  ArrowDownToLine,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface LedgerEntry {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number | null;
  note: string | null;
  store: {
    id: string;
    name: string | null;
  };
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

export default function AdminStoreProfitHistoryPage() {
  const { storeId } = useParams() as { storeId: string };
  const router = useRouter();

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
      maximumFractionDigits: 0,
    }).format(num);

  const getLedgerTypeStyle = (type: string) => {
    switch (type) {
      case 'PAYMENT_RECEIVED':
      case 'ORDER_PROFIT':
        return {
          icon: <TrendingUp className="h-5 w-5 text-emerald-500" />,
          label: type === 'ORDER_PROFIT' ? 'أرباح طلب' : 'دفعة مستلمة',
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-500',
        };
      case 'PLATFORM_FEE':
        return {
          icon: <ArrowDownToLine className="h-5 w-5 text-red-500" />,
          label: 'رسوم المنصة',
          bg: 'bg-red-500/10',
          text: 'text-red-500',
        };
      case 'WITHDRAW_REQUEST':
        return {
          icon: <Clock className="h-5 w-5 text-amber-500" />,
          label: 'طلب سحب',
          bg: 'bg-amber-500/10',
          text: 'text-amber-500',
        };
      case 'WITHDRAW_APPROVED':
        return {
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
          label: 'سحب مكتمل',
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-500',
        };
      case 'REFUND':
        return {
          icon: <RotateCcw className="h-5 w-5 text-red-500" />,
          label: 'استرجاع',
          bg: 'bg-red-500/10',
          text: 'text-red-500',
        };
      default:
        return {
          icon: <ReceiptText className="h-5 w-5 text-gray-400" />,
          label: type,
          bg: 'bg-gray-100 dark:bg-gray-800',
          text: 'text-gray-500',
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-transparent" dir="rtl">
      <main className="mx-auto max-w-5xl space-y-8 p-4 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="from-primary/20 to-primary/5 text-primary border-primary/10 flex h-14 w-14 items-center justify-center rounded-2xl border bg-linear-to-br shadow-inner">
              <ReceiptText className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-foreground text-2xl font-bold tracking-tight">
                سجل حركات {history[0]?.store?.name}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                تتبع كافة الإيرادات والمصروفات بدقة (صلاحيات المسؤول)
              </p>
            </div>
          </div>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="group hover:bg-muted flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-medium transition-all"
          >
            <ArrowRight className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            العودة للخلف
          </Button>
        </div>

        {/* Balance Overview */}
        <div className="grid gap-5 sm:grid-cols-2">
          <Card className="via-background to-background relative overflow-hidden rounded-2xl border-none bg-linear-to-br from-emerald-500/10 shadow-sm ring-1 ring-emerald-500/20">
            <div className="absolute top-0 left-0 h-full w-1 bg-emerald-500" />
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-sm font-medium text-emerald-600/80 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    الرصيد المتاح للسحب
                  </p>
                  {loading ? (
                    <Skeleton className="h-9 w-32" />
                  ) : (
                    <p className="text-3xl font-black text-emerald-700 dark:text-emerald-300">
                      {formatCurrency(balance.available)}
                    </p>
                  )}
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 shadow-inner">
                  <Wallet className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="via-background to-background relative overflow-hidden rounded-2xl border-none bg-linear-to-br from-amber-500/10 shadow-sm ring-1 ring-amber-500/20">
            <div className="absolute top-0 left-0 h-full w-1 bg-amber-500" />
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-sm font-medium text-amber-600/80 dark:text-amber-400">
                    <Clock className="h-4 w-4" />
                    الرصيد المعلق
                  </p>
                  {loading ? (
                    <Skeleton className="h-9 w-32" />
                  ) : (
                    <p className="text-3xl font-black text-amber-700 dark:text-amber-300">
                      {formatCurrency(balance.pending)}
                    </p>
                  )}
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 shadow-inner">
                  <Clock className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <div className="border-border/50 bg-card rounded-2xl border shadow-sm">
          <div className="border-border/50 border-b px-6 py-5">
            <h2 className="text-foreground text-lg font-bold">الحركات المالية الأخيرة</h2>
          </div>

          <div className="p-2 sm:p-4">
            {loading ? (
              <div className="space-y-3 p-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <ReceiptText className="mb-3 h-12 w-12 text-red-400/50" />
                <p className="text-sm font-medium text-red-500">{error}</p>
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <ReceiptText className="text-muted-foreground/30 mb-4 h-14 w-14" />
                <p className="text-foreground text-lg font-medium">لا توجد حركات بعد</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  لم يتم إجراء أي عمليات مالية على هذا المتجر.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map(entry => {
                  const style = getLedgerTypeStyle(entry.type);
                  const isPositive = [
                    'PAYMENT_RECEIVED',
                    'ORDER_PROFIT',
                    'WITHDRAW_APPROVED',
                  ].includes(entry.type);

                  return (
                    <div
                      key={entry.id}
                      className="group hover:bg-muted/40 flex flex-col justify-between gap-4 rounded-xl border border-transparent p-4 transition-all sm:flex-row sm:items-center"
                    >
                      <div className="flex items-start gap-4 sm:items-center">
                        <div
                          className={`mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${style.bg} transition-transform group-hover:scale-110 sm:mt-0`}
                        >
                          {style.icon}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-foreground text-base font-semibold">
                              {style.label}
                            </h3>
                          </div>
                          <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(entry.createdAt).toLocaleString('ar-IQ', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {entry.order && (
                              <span className="flex items-center gap-1">
                                • رقم الطلب{' '}
                                <span className="text-foreground/80 font-mono font-medium">
                                  #{entry.order.id.slice(-6)}
                                </span>
                              </span>
                            )}
                          </div>
                          {entry.note && (
                            <p className="text-muted-foreground mt-1 text-xs">{entry.note}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-row items-center justify-between sm:flex-col sm:items-end">
                        <span className="text-muted-foreground text-xs font-medium sm:hidden">
                          المبلغ
                        </span>
                        <div className="text-right">
                          <p
                            className={`text-lg font-bold tracking-tight ${isPositive ? 'text-emerald-500 dark:text-emerald-400' : 'text-foreground'}`}
                          >
                            {isPositive ? '+' : '-'}
                            {formatCurrency(entry.amount)}
                          </p>
                          {entry.balanceAfter !== null && (
                            <p className="text-muted-foreground mt-0.5 text-[11px] font-medium">
                              الرصيد بعد: {formatCurrency(entry.balanceAfter)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
