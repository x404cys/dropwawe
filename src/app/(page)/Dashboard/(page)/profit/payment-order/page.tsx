'use client';

import useSWR from 'swr';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Wallet, TrendingUp, Clock3 } from 'lucide-react';

/* ================= FETCHER ================= */

const fetcher = (url: string) => axios.get(url).then(res => res.data);

/* ================= TYPES ================= */

interface Withdrawal {
  id: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

interface Statement {
  remaining: number;
  totalProfit: number;
  pendingAmount: number;
  withdrawals: Withdrawal[];
}

/* ================= PAGE ================= */

export default function ProfitStatement() {
  const { data, error, isLoading, mutate, isValidating } = useSWR<Statement>(
    '/api/dashboard/profit/statement',
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    }
  );

  const withdraw = async () => {
    try {
      await axios.post('/api/dashboard/profit/withdraw-trader');

      await mutate();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'حدث خطأ أثناء السحب');
    }
  };

  const format = (n: number) =>
    new Intl.NumberFormat('en-IQ', {
      style: 'currency',
      currency: 'IQD',
      minimumFractionDigits: 0,
    }).format(n);

  /* ================= STATES ================= */

  if (isLoading) return <p className="p-6 text-sm text-neutral-500">Loading...</p>;

  if (error)
    return <p className="p-6 text-sm text-red-500">فشل تحميل كشف الحساب: {error.message}</p>;

  /* ================= UI ================= */

  return (
    <div dir="rtl" className="mx-auto max-w-6xl space-y-8 p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">جرد حساب</h1>
          <p className="text-sm text-neutral-500">لبوابة الدفع الإلكتروني فقط</p>
        </div>

        <Button
          onClick={withdraw}
          disabled={isValidating || data!.remaining <= 0}
          className="cursor-pointer rounded-lg"
        >
          {isValidating ? 'جاري الإرسال...' : 'طلب سحب'}
        </Button>
      </div>

      {/* CARDS */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card icon={<Wallet size={18} />} title="الرصيد المتاح" value={format(data!.remaining)} />

        <Card
          icon={<TrendingUp size={18} />}
          title="الأرباح الكلية"
          value={format(data!.totalProfit)}
        />

        <Card icon={<Clock3 size={18} />} title="قيد السحب" value={format(data!.pendingAmount)} />
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead className="border-b bg-neutral-50 text-neutral-600">
            <tr className="text-center">
              <th className="p-4 font-medium">التاريخ</th>
              <th className="font-medium">المبلغ</th>
              <th className="font-medium">الحالة</th>
            </tr>
          </thead>

          <tbody>
            {data!.withdrawals.map(w => (
              <tr key={w.id} className="border-t text-center transition-colors hover:bg-neutral-50">
                <td className="p-4">{new Date(w.createdAt).toLocaleDateString()}</td>

                <td className="font-medium">{format(w.amount)}</td>

                <td>
                  <Status status={w.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Card({ title, value, icon }: any) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="flex items-center gap-2 text-neutral-500">
        {icon}
        <p className="text-sm">{title}</p>
      </div>

      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function Status({ status }: any) {
  const map: any = {
    PENDING: 'قيد المراجعة',
    APPROVED: 'تم الدفع',
    REJECTED: 'مرفوض',
  };

  const color: any = {
    PENDING: 'text-amber-600',
    APPROVED: 'text-emerald-600',
    REJECTED: 'text-red-600',
  };

  return <span className={`text-sm font-medium ${color[status]}`}>{map[status]}</span>;
}
