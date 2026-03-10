'use client';

import useSWR from 'swr';
import { FaMoneyBillTransfer, FaClock, FaWhatsapp } from 'react-icons/fa6';
import { FaCheckCircle } from 'react-icons/fa';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Loader from '../../_components/Loader-check';

type ProfitWithdrawal = {
  id: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  method: string | null;
  note: string | null;

  store: {
    id: string;
    name: string | null;
    phone: string | null;
    users: {
      user: {
        id: string;
        name: string | null;
        email: string | null;
      };
    }[];
  };
};

import { getTraderProfits, approveTraderProfit } from '@/server/actions/admin-profit.actions';

const fetcher = async () => {
  return await getTraderProfits();
};

export default function WithdrawalsPage() {
  const { data, isLoading, mutate, error } = useSWR<ProfitWithdrawal[]>(
    'trader-profits-list',
    fetcher
  );

  const [selected, setSelected] = useState<ProfitWithdrawal | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const stats = {
    pendingCount: data?.filter(w => w.status === 'PENDING').length ?? 0,
    approvedCount: data?.filter(w => w.status === 'APPROVED').length ?? 0,
    totalPending:
      data?.filter(w => w.status === 'PENDING').reduce((sum, w) => sum + w.amount, 0) ?? 0,
  };

  const handleApprove = async () => {
    if (!selected) return;

    try {
      setLoadingId(selected.id);
      await approveTraderProfit(selected.id);
      await mutate();
      setSelected(null);
    } catch {
      alert('حدث خطأ');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section className="mx-auto max-w-6xl p-4 md:p-6" dir="rtl">
      {/* HEADER */}
      <Header />

      {/* STATS */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard title="طلبات قيد الانتظار" value={stats.pendingCount} icon={<FaClock />} />

        <StatCard title="تم التسديد" value={stats.approvedCount} icon={<FaCheckCircle />} />

        <StatCard
          title="إجمالي المبالغ المعلقة"
          value={`${stats.totalPending.toLocaleString()} IQD`}
        />
      </div>

      {isLoading && <Loader />}

      {error && (
        <Card>
          <CardContent className="p-8 text-center text-red-500">فشل تحميل البيانات</CardContent>
        </Card>
      )}

      {/* LIST */}
      <div className="space-y-3">
        {data?.map(item => {
          const store = item.store;
          const owner = store?.users?.[0]?.user;

          return (
            <Card key={item.id} className="transition hover:shadow-md">
              <CardContent className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center">
                {/* USER */}
                <div className="flex items-start gap-3">
                  <Avatar name={owner?.name || 'مجهول'} />

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{owner?.name || 'مجهول'}</h3>

                      {item.status === 'APPROVED' && <Badge green text="تم التسديد" />}
                      {item.status === 'PENDING' && <Badge orange text="معلق" />}
                    </div>

                    <p className="text-muted-foreground text-sm">
                      {owner?.email || 'لا يوجد بريد'}
                    </p>

                    {store && <p className="text-muted-foreground mt-1 text-xs">{store.name}</p>}
                    {item.method && (
                      <p className="text-muted-foreground mt-1 text-xs">الطريقة: {item.method}</p>
                    )}
                  </div>
                </div>

                {/* ACTION */}
                <div className="border-t pt-3 sm:border-0 sm:pt-0 sm:text-left">
                  <p className="text-muted-foreground hidden text-xs sm:block">المبلغ</p>
                  <div className="flex items-center justify-between sm:block">
                    <p className="text-muted-foreground text-xs sm:hidden">المبلغ:</p>
                    <p className="text-left text-lg font-bold">
                      {item.amount.toLocaleString()} IQD
                    </p>
                  </div>

                  <div className="mt-3 flex shrink-0 flex-wrap items-center justify-start gap-2 sm:mt-2 sm:justify-end">
                    {store?.phone && (
                      <Button
                        variant="outline"
                        className="h-9 border-green-200 px-3 text-xs text-green-600 hover:bg-green-50 hover:text-green-700 dark:border-green-900/50 dark:hover:bg-green-900/20"
                        onClick={() =>
                          window.open(
                            `https://wa.me/964${store.phone?.replace(/[^1-9+]/g, '')}`,
                            '_blank'
                          )
                        }
                      >
                        <FaWhatsapp className="ml-1.5 size-4" />
                        واتساب
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="h-9 px-3 text-xs"
                      onClick={() =>
                        (window.location.href = `/admin/trader-profit/history/${store?.id}`)
                      }
                    >
                      السجل
                    </Button>
                    {item.status === 'PENDING' && (
                      <Button
                        className="h-9 px-4 text-xs"
                        disabled={loadingId === item.id}
                        onClick={() => setSelected(item)}
                      >
                        تسديد
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* DIALOG */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        {selected && (
          <DialogContent dir="rtl">
            <DialogHeader>
              <DialogTitle>تأكيد التسديد</DialogTitle>
            </DialogHeader>

            <InfoRow label="التاجر" value={selected.store?.users?.[0]?.user?.name || 'مجهول'} />
            <InfoRow label="المتجر" value={selected.store?.name || 'غير معروف'} />
            <InfoRow label="طريقة التسديد" value={selected.method || 'غير محدد'} />
            <InfoRow label="المبلغ" value={`${selected.amount.toLocaleString()} IQD`} />

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelected(null)}>
                إلغاء
              </Button>

              <Button onClick={handleApprove}>تأكيد</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}

/* ================= COMPONENTS ================= */

const Header = () => (
  <div className="mb-8 flex items-center gap-3">
    <div className="bg-primary/10 flex size-12 items-center justify-center rounded-xl">
      <FaMoneyBillTransfer className="text-primary size-6" />
    </div>
    <div>
      <h1 className="text-2xl font-semibold">طلبات سحب الأرباح</h1>
      <p className="text-muted-foreground text-sm">إدارة عمليات السحب للتجار</p>
    </div>
  </div>
);

function StatCard({ title, value, icon }: any) {
  return (
    <Card>
      <CardContent className="flex justify-between p-4">
        <div>
          <p className="text-muted-foreground text-sm">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {icon && (
          <div className="bg-muted flex size-12 items-center justify-center rounded-lg">{icon}</div>
        )}
      </CardContent>
    </Card>
  );
}

const Badge = ({ text, green, orange }: any) => (
  <span
    className={`rounded-full px-2 py-0.5 text-xs ${green && 'bg-emerald-500/10 text-emerald-700'} ${orange && 'bg-orange-500/10 text-orange-500'}`}
  >
    {text}
  </span>
);

const Avatar = ({ name }: { name: string }) => (
  <div className="bg-muted flex size-10 items-center justify-center rounded-lg font-bold">
    {name.charAt(0)}
  </div>
);

const InfoRow = ({ label, value }: any) => (
  <div className="bg-muted flex justify-between rounded-lg p-3 text-sm">
    <span>{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);
