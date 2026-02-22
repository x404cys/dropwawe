'use client';

import useSWR from 'swr';
import { FaMoneyBillTransfer, FaClock } from 'react-icons/fa6';
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
import { StoreProps } from '@/types/store/StoreType';

/* ================= TYPES ================= */

type ProfitWithdrawal = {
  id: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;

  trader: {
    id: string;
    name: string;
    email: string;
    Store: StoreProps[];
  };
};

/* ================= FETCHER ================= */

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error();
  return res.json();
};

/* ================= PAGE ================= */

export default function WithdrawalsPage() {
  const { data, isLoading, mutate, error } = useSWR<ProfitWithdrawal[]>(
    '/api/admin/trader-profit',
    fetcher
  );

  const [selected, setSelected] = useState<ProfitWithdrawal | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  /* ================= STATS ================= */

  const stats = {
    pendingCount: data?.filter(w => w.status === 'PENDING').length ?? 0,
    approvedCount: data?.filter(w => w.status === 'APPROVED').length ?? 0,
    totalPending:
      data?.filter(w => w.status === 'PENDING').reduce((sum, w) => sum + w.amount, 0) ?? 0,
  };

  /* ================= APPROVE ================= */

  const handleApprove = async () => {
    if (!selected) return;

    try {
      setLoadingId(selected.id);

      const res = await fetch(`/api/admin/trader-profit/approve/${selected.id}`, { method: 'PATCH' });

      if (!res.ok) throw new Error();

      await mutate();
      setSelected(null);
    } catch {
      alert('حدث خطأ');
    } finally {
      setLoadingId(null);
    }
  };

  /* ================= UI ================= */

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
          const store = item.trader.Store?.[0];

          return (
            <Card key={item.id} className="transition hover:shadow-md">
              <CardContent className="flex justify-between p-4">
                {/* USER */}
                <div className="flex gap-3">
                  <Avatar name={item.trader.name} />

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{item.trader.name}</h3>

                      {item.status === 'APPROVED' && <Badge green text="تم التسديد" />}
                      {item.status === 'PENDING' && <Badge orange text="معلق" />}
                    </div>

                    <p className="text-muted-foreground text-sm">{item.trader.email}</p>

                    {store && <p className="text-muted-foreground mt-1 text-xs">{store.name}</p>}
                  </div>
                </div>

                {/* ACTION */}
                <div className="text-left">
                  <p className="text-muted-foreground text-xs">المبلغ</p>
                  <p className="text-lg font-bold">{item.amount.toLocaleString()} IQD</p>

                  {item.status === 'PENDING' && (
                    <Button
                      className="mt-2"
                      disabled={loadingId === item.id}
                      onClick={() => setSelected(item)}
                    >
                      تسديد
                    </Button>
                  )}
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

            <InfoRow label="التاجر" value={selected.trader.name} />
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

const Loader = () => (
  <div className="flex justify-center py-20">
    <div className="border-muted border-t-primary size-12 animate-spin rounded-full border-4" />
  </div>
);
