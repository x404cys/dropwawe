'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Loader2, Search } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

type Plan = {
  id: string;
  name: string;
  type: string;
  price: number;
  durationDays: number;
};

type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  active: boolean;
  createdAt: string;
};

type Subscription = {
  id: string;
  planId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  autoRenew: boolean;
  plan: Plan;
  user: User | null;
};

export default function SubscriptionsPage() {
  const { data, isLoading } = useSWR<Subscription[]>('/api/admin/plans/subscriptions/get', fetcher);

  const [query, setQuery] = useState('');

  if (isLoading) {
    return (
      <div className="mt-10 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    );
  }

  const subscriptions = data || [];

  const filtered = subscriptions?.filter(sub => {
    const text = `
      ${sub.user?.name || ''}
      ${sub.user?.email || ''}
      ${sub.plan?.name || ''}
      ${sub.plan?.type || ''}
    `.toLowerCase();

    return text.includes(query.toLowerCase());
  });

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">الاشتراكات</h1>
        <p className="text-muted-foreground text-sm">{filtered.length} اشتراك</p>
      </div>

      <div className="border-border bg-background flex items-center gap-2 rounded-xl border px-3 py-2 shadow-sm">
        <Search className="text-muted-foreground h-4 w-4" />
        <input
          type="text"
          placeholder="ابحث عن مستخدم أو خطة..."
          className="w-full bg-transparent outline-none"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 && (
        <div className="text-muted-foreground py-10 text-center">لا توجد نتائج</div>
      )}

      <div className="hidden overflow-x-auto rounded-xl border md:block">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs">
            <tr>
              {['المستخدم', 'البريد', 'الخطة', 'السعر', 'الحالة', 'البداية', 'النهاية'].map(h => (
                <th key={h} className="p-3 text-right font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map(sub => (
              <tr key={sub.id} className="hover:bg-muted/30 border-t">
                <td className="p-3">{sub.user?.name}</td>
                <td className="p-3">{sub.user?.email}</td>
                <td className="p-3">{sub.plan.name}</td>
                <td className="p-3">{sub.plan.price.toLocaleString()} IQD</td>

                <td className="p-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      sub.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {sub.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </td>

                <td className="p-3">{new Date(sub.startDate).toLocaleDateString('ar')}</td>

                <td className="p-3">{new Date(sub.endDate).toLocaleDateString('ar')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {filtered.map(sub => {
          const end = new Date(sub.endDate);
          const today = new Date();

          const daysLeft = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

          const isExpired = daysLeft <= 0;
          const isExpiring = daysLeft <= 7 && daysLeft > 0;

          const statusColor = isExpired
            ? 'bg-rose-100 text-rose-700'
            : isExpiring
              ? 'bg-amber-100 text-amber-700'
              : 'bg-emerald-100 text-emerald-700';

          return (
            <div
              key={sub.id}
              className="rounded-xl border bg-white p-3 shadow-sm transition hover:shadow-md"
            >
              {/* TOP ROW */}
              <div className="flex items-center gap-3">
                {sub.user?.image && (
                  <img src={sub.user.image} className="h-10 w-10 rounded-full object-cover" />
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{sub.user?.name}</p>

                  <p className="truncate text-[11px] text-gray-500">{sub.user?.email}</p>
                </div>

                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    sub.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {sub.isActive ? 'نشط' : 'غير نشط'}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs">
                <div className="font-medium text-gray-800">
                  {sub.plan.name}
                  <span className="ml-1 text-gray-500">
                    • {sub.plan.price.toLocaleString()} IQD
                  </span>
                </div>

                <div className="text-gray-600">{isExpired ? 'انتهى' : `${daysLeft} يوم`}</div>
              </div>

              <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-gray-500">
                <span>بداية: {new Date(sub.startDate).toLocaleDateString('ar')}</span>

                <span>•</span>

                <span>تجديد: {sub.autoRenew ? 'ON' : 'OFF'}</span>

                <span>•</span>

                <span>{sub.plan.type}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-muted/30 rounded-lg p-2">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="font-medium">{children}</p>
    </div>
  );
}
