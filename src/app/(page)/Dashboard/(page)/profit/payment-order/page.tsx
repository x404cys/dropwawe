'use client';

import type { ReactNode } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Clock3, TrendingUp, Wallet } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

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

function SummaryCard({ title, value, icon }: { title: string; value: string; icon: ReactNode }) {
  return (
    <div className="bg-card rounded-xl border p-5">
      <div className="flex items-center gap-2 text-neutral-500">
        {icon}
        <p className="text-sm">{title}</p>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function StatusBadge({
  status,
  pendingLabel,
  approvedLabel,
  rejectedLabel,
}: {
  status: Withdrawal['status'];
  pendingLabel: string;
  approvedLabel: string;
  rejectedLabel: string;
}) {
  const map = {
    PENDING: pendingLabel,
    APPROVED: approvedLabel,
    REJECTED: rejectedLabel,
  };

  const color = {
    PENDING: 'text-amber-600',
    APPROVED: 'text-emerald-600',
    REJECTED: 'text-red-600',
  };

  return <span className={`text-sm font-medium ${color[status]}`}>{map[status]}</span>;
}

export default function ProfitStatementPage() {
  const { t, dir, lang } = useLanguage();
  const pageT = t.dashboardPages.profitStatement;
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
      alert(err?.response?.data?.error || pageT.loadError);
    }
  };

  const format = (value: number) =>
    new Intl.NumberFormat('en-IQ', {
      style: 'currency',
      currency: 'IQD',
      minimumFractionDigits: 0,
    }).format(value);

  if (isLoading) return <p className="p-6 text-sm text-neutral-500">{pageT.loading}</p>;

  if (error) {
    return (
      <p className="p-6 text-sm text-red-500">
        {pageT.loadError}: {error.message}
      </p>
    );
  }

  return (
    <div dir={dir} className="mx-auto max-w-6xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{pageT.title}</h1>
          <p className="text-sm text-neutral-500">{pageT.subtitle}</p>
        </div>

        <Button
          onClick={withdraw}
          disabled={isValidating || (data?.remaining ?? 0) <= 0}
          className="cursor-pointer rounded-lg"
        >
          {isValidating ? pageT.sending : pageT.requestWithdraw}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          icon={<Wallet size={18} />}
          title={pageT.availableBalance}
          value={format(data?.remaining ?? 0)}
        />
        <SummaryCard
          icon={<TrendingUp size={18} />}
          title={pageT.totalProfit}
          value={format(data?.totalProfit ?? 0)}
        />
        <SummaryCard
          icon={<Clock3 size={18} />}
          title={pageT.pendingAmount}
          value={format(data?.pendingAmount ?? 0)}
        />
      </div>

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead className="border-b bg-neutral-50 text-neutral-600">
            <tr className="text-center">
              <th className="p-4 font-medium">{t.orders.date}</th>
              <th className="font-medium">{pageT.amount}</th>
              <th className="font-medium">{pageT.status}</th>
            </tr>
          </thead>

          <tbody>
            {data?.withdrawals.map(withdrawal => (
              <tr
                key={withdrawal.id}
                className="border-t text-center transition-colors hover:bg-neutral-50"
              >
                <td className="p-4">
                  {new Date(withdrawal.createdAt).toLocaleDateString(
                    lang === 'en' ? 'en-US' : 'ar-IQ'
                  )}
                </td>
                <td className="font-medium">{format(withdrawal.amount)}</td>
                <td>
                  <StatusBadge
                    status={withdrawal.status}
                    pendingLabel={pageT.underReview}
                    approvedLabel={pageT.paid}
                    rejectedLabel={pageT.rejected}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
