'use client';

import useSWR from 'swr';
import { FaMoneyBillTransfer, FaClock } from 'react-icons/fa6';
import { Card, CardContent } from '@/components/ui/card';
import { FaCheckCircle } from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { StoreProps } from '@/types/store/StoreType';

type TraderProfit = {
  id: string;
  amount: number;
  remaining: number;
  withdraw: boolean;
  createdAt: string;
  updatedAt: string;
  trader: {
    id: string;
    name: string;
    email: string;
    phone: string;
    Store: StoreProps[];
    UserSubscription: {
      startDate: string;
      endDate: string;
      isActive: boolean;
      plan: {
        name: string;
        type: string;
      };
    }[];
  };
};

export default function TraderProfit() {
  const fetcher = async (url: string) => {
    const res = await fetch(url);
    const json = await res.json();

    return Array.isArray(json) ? json : json.data || json.profits || [];
  };
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data, isLoading, mutate } = useSWR<TraderProfit[]>('/api/admin/trader-profit/', fetcher);

  const stats = {
    totalPending:
      data?.filter(item => item.withdraw === true).reduce((sum, item) => sum + item.remaining, 0) ||
      0,
    totalSettled: data?.filter(item => item.remaining === 0).length || 0,
    pendingCount: data?.filter(item => item.withdraw === true).length || 0,
  };

  return (
    <section className="mx-auto max-w-6xl p-4 md:p-6" dir="rtl">
      <div className="mb-8 flex items-center gap-3">
        <div className="bg-primary/10 flex size-12 items-center justify-center rounded-xl">
          <FaMoneyBillTransfer className="text-primary size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">كشف حساب الأرباح</h1>
          <p className="text-muted-foreground text-sm">إدارة وتسديد أرباح التجار</p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">قيد الانتظار</p>
                <p className="mt-1 text-2xl font-bold">{stats.pendingCount}</p>
              </div>
              <div className="flex size-12 items-center justify-center rounded-lg bg-amber-500/10">
                <FaClock className="size-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">تم التسديد</p>
                <p className="mt-1 text-2xl font-bold">{stats.totalSettled}</p>
              </div>
              <div className="flex size-12 items-center justify-center rounded-lg bg-emerald-500/10">
                <FaCheckCircle className="size-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-muted-foreground text-sm">إجمالي المبالغ المعلقة</p>
              <p className="mt-1 text-2xl font-bold">{stats.totalPending.toLocaleString()} IQD</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading && (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="border-muted border-t-primary mx-auto size-12 animate-spin rounded-full border-4" />
            <p className="text-muted-foreground mt-4 text-sm">جاري التحميل...</p>
          </div>
        </div>
      )}

      {!isLoading && (!data || data.length === 0) && (
        <Card>
          <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-8">
            <div className="bg-muted flex size-16 items-center justify-center rounded-full">
              <FaMoneyBillTransfer className="text-muted-foreground size-8" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">لا توجد أرباح</h3>
            <p className="text-muted-foreground mt-2 text-center text-sm">
              لم يتم العثور على أي سجلات أرباح في الوقت الحالي
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {data?.map(item => (
          <Card key={item.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
                    <span className="text-foreground text-lg font-semibold">
                      {item.trader.name.charAt(0)}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold">{item.trader.name}</h3>
                      {item.remaining === 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          <FaCheckCircle className="size-3" />
                          تم التسديد
                        </span>
                      )}
                      {item.withdraw === true && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-400">
                          <FaClock className="size-3" />
                          معلق{' '}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-0.5 truncate text-sm">
                      {item.trader.email}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {new Date(item.updatedAt).toLocaleDateString('ar', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      اخر تحديث
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <div className="text-left">
                    <p className="text-muted-foreground text-xs">المبلغ المتبقي</p>
                    <p className="text-lg font-bold">{item.remaining.toLocaleString()} IQD</p>
                  </div>

                  {item.withdraw === true && (
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                          تسديد
                        </Button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>تأكيد التسديد</DialogTitle>
                          <div dir="rtl" className="flex items-end">
                            هل أنت متأكد من تسديد المبلغ التالي للتاجر؟
                          </div>
                        </DialogHeader>
                        <div
                          dir="rtl"
                          className="bg-muted flex justify-between rounded-lg p-3 text-sm"
                        >
                          <span>اسم التاجر</span>
                          <span className="font-semibold">{item.trader.name}</span>
                        </div>
                        <div
                          dir="rtl"
                          className="bg-muted flex justify-between rounded-lg p-3 text-sm"
                        >
                          <span>رقم الهاتف </span>
                          <span className="font-semibold">{item.trader.Store[0].phone}</span>
                        </div>
                        <div
                          dir="rtl"
                          className="bg-muted flex justify-between rounded-lg p-3 text-sm"
                        >
                          <span> معلومات المتجر </span>
                          <span className="font-semibold">
                            {item.trader.Store[0].name} - {item.trader.Store[0].subLink}{' '}
                          </span>
                        </div>
                        <div
                          dir="rtl"
                          className="bg-muted flex justify-between rounded-lg p-3 text-sm"
                        >
                          <span> نوع الاشتراك </span>
                          <span className="font-semibold">
                            <span className="font-semibold">
                              {item.trader.UserSubscription?.find(s => s.isActive)?.plan?.name ||
                                'منتهي الصلاحية'}
                            </span>
                            <span className="flex items-center gap-2 font-semibold">
                              {item.trader.UserSubscription?.find(u => u.plan)?.plan.type ||
                                'منتهي الصلاحية'}
                            </span>
                          </span>
                        </div>
                        <div
                          dir="rtl"
                          className="bg-muted flex justify-between rounded-lg p-3 text-sm"
                        >
                          <span>المبلغ</span>
                          <span className="font-semibold">
                            {item.remaining.toLocaleString()} IQD
                          </span>
                        </div>

                        <DialogFooter className="gap-2">
                          <Button variant="outline" onClick={() => setOpen(false)}>
                            إلغاء
                          </Button>

                          <Button
                            disabled={loading}
                            onClick={async () => {
                              try {
                                setLoading(true);
                                await fetch(`/api/admin/trader-profit/settle/${item.id}`, {
                                  method: 'PATCH',
                                });
                                mutate();
                                setOpen(false);
                              } finally {
                                setLoading(false);
                              }
                            }}
                          >
                            {loading ? 'جاري التسديد...' : 'تأكيد التسديد'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
