'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Loader2, Search } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

type Store = {
  name: string;
  phone: string;
};

type User = {
  name: string;
  email: string;
  Store?: Store[];
};

type Subscription = {
  id: string;
  user: User | null;
  planId: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  limitProducts: number;
};

export default function SubscriptionsPage() {
  const { data, isLoading } = useSWR<Subscription[]>('/api/admin/plans/subscriptions/get', fetcher);

  const [query, setQuery] = useState('');

  if (isLoading) {
    return (
      <div className="mt-10 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-700" />
      </div>
    );
  }

  const subscriptions = data || [];

  const filtered = subscriptions.filter(sub => {
    const user = sub.user;
    const store = user?.Store?.[0];

    const text = `
      ${user?.name || ''}
      ${user?.email || ''}
      ${store?.name || ''}
      ${store?.phone || ''}
      ${sub.planId || ''}
    `.toLowerCase();

    return text.includes(query.toLowerCase());
  });

  return (
    <div className="space-y-6 p-4 md:p-8">
      <h1 className="mb-4 text-2xl font-bold md:text-3xl">الاشتراكات</h1>

      <div className="mb-4 flex items-center gap-2 rounded-xl border bg-white px-3 py-2 shadow-sm transition-all hover:shadow-md">
        <Search className="h-5 w-5 text-gray-500" />
        <input
          type="text"
          placeholder="ابحث عن مستخدم، بريد، متجر، رقم هاتف..."
          className="w-full bg-transparent text-right text-sm outline-none"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 && (
        <div className="py-6 text-center text-gray-500">لا توجد نتائج مطابقة</div>
      )}

      <div className="hidden overflow-x-auto rounded-xl border border-gray-200 shadow-sm md:block">
        <table className="w-full table-auto border-collapse text-sm">
          <thead className="bg-gray-900 text-xs text-white">
            <tr>
              {[
                'الرقم',
                'المستخدم',
                'البريد',
                'الخطة',
                'الحالة',
                'تاريخ البداية',
                'تاريخ النهاية',
                'حد المنتجات',
                'اسم المتجر',
                'الهاتف',
              ].map(h => (
                <th key={h} className="border border-gray-800 p-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((sub, idx) => (
              <tr key={sub.id} className="transition even:bg-gray-50 hover:bg-gray-100">
                <td className="border p-2">{idx + 1}</td>
                <td className="border p-2">{sub.user?.name || '—'}</td>
                <td className="border p-2">{sub.user?.email || '—'}</td>
                <td className="border p-2 text-xs">{sub.planId}</td>
                <td className="border p-2">
                  <span
                    className={`rounded-md px-2 py-1 text-[11px] font-semibold ${
                      sub.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {sub.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </td>
                <td className="border p-2">{new Date(sub.startDate).toLocaleDateString('ar')}</td>
                <td className="border p-2">{new Date(sub.endDate).toLocaleDateString('ar')}</td>
                <td className="border p-2">{sub.limitProducts}</td>
                <td className="border p-2 text-xs">{sub.user?.Store?.[0]?.name || '—'}</td>
                <td className="border p-2 text-xs">{sub.user?.Store?.[0]?.phone || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:hidden">
        {filtered.map(sub => (
          <div
            key={sub.id}
            className="rounded-xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 p-5 shadow-lg transition-shadow hover:shadow-xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">{sub.user?.name || '—'}</h2>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  sub.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {sub.isActive ? 'نشط' : 'غير نشط'}
              </span>
            </div>

            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <span className="font-medium">البريد:</span> {sub.user?.email || '—'}
              </p>
              <p>
                <span className="font-medium">الخطة:</span> {sub.planId}
              </p>
              <p>
                <span className="font-medium">تاريخ البداية:</span>{' '}
                {new Date(sub.startDate).toLocaleDateString('ar')}
              </p>
              <p>
                <span className="font-medium">تاريخ النهاية:</span>{' '}
                {new Date(sub.endDate).toLocaleDateString('ar')}
              </p>
              <p>
                <span className="font-medium">حد المنتجات:</span> {sub.limitProducts}
              </p>
            </div>

            {sub.user?.Store?.length ? (
              <div className="mt-4 border-t border-gray-200 pt-3">
                <h3 className="mb-1 font-semibold text-gray-800">المتجر</h3>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">اسم المتجر:</span> {sub.user.Store![0].name}
                  </p>
                  <p>
                    <span className="font-medium">الهاتف:</span> {sub.user.Store![0].phone}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
