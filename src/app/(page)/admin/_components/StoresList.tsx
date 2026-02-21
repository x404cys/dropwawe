'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Store, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { StoreProps } from '@/types/store/StoreType';
import { toast } from 'sonner';

type FilterType = 'all' | 'active' | 'inactive';

export default function StoresList({ stores }: { stores: StoreProps[] }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const router = useRouter();

  const filteredStores = useMemo(() => {
    return stores?.filter(store => {
      const matchSearch =
        store.name?.toLowerCase().includes(search.toLowerCase()) ||
        store.subLink?.toLowerCase().includes(search.toLowerCase());

      let matchFilter = true;
      if (filter === 'active') matchFilter = !!store.active;
      if (filter === 'inactive') matchFilter = !store.active;

      return matchSearch && matchFilter;
    });
  }, [stores, search, filter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-2 py-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">المتاجر</h1>
              <p className="text-sm text-gray-500">
                {filteredStores?.length} من {stores?.length}
              </p>
            </div>

            <div className="relative w-full max-w-md">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ابحث عن متجر..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pr-3 pl-10 text-sm focus:border-gray-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            {['all', 'active', 'inactive'].map(v => (
              <button
                key={v}
                onClick={() => setFilter(v as FilterType)}
                className={`rounded-md px-4 py-1.5 text-xs font-medium transition ${
                  filter === v
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {v === 'all' ? 'الكل' : v === 'active' ? 'فعال' : 'متوقف'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <div className="mx-auto max-w-7xl">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-200 bg-white text-xs text-gray-700 uppercase">
                <th className="px-6 py-4">المتجر</th>
                <th className="px-6 py-4">الرابط</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4">الإنشاء</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredStores?.map(store => (
                <tr key={store.id} className="transition hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{store.name}</td>

                  <td className="px-6 py-4 text-sm text-blue-600">{store.subLink}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        store.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {store.active ? 'فعال' : 'متوقف'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {store.createdAt ? new Date(store.createdAt).toLocaleDateString() : '-'}
                  </td>

                  <td className="px-6 py-4 text-left">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`https://${store.subLink}.matager.store`}
                        target="_blank"
                        className="rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                      >
                        فتح
                      </Link>

                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(`https://${store.subLink}.matager.store`)
                        }
                        className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                      >
                        نسخ
                      </button>

                      <button
                        onClick={async () => {
                          await fetch(`/api/admin/stats/inactive/${store.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ active: !store.active }),
                          });
                          router.refresh();
                        }}
                        className="rounded-md bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                      >
                        {store.active ? 'إيقاف' : 'تفعيل'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-2 p-1 md:hidden">
        {filteredStores?.map(store => (
          <div
            key={store.id}
            className="rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{store.name}</p>
                <p className="truncate text-xs text-gray-500">{store.subLink}.matager.store</p>
              </div>

              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  store.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {store.active ? 'فعال' : 'متوقف'}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-gray-400">تاريخ الإنشاء</p>
                <p className="font-medium text-gray-800">
                  {store.createdAt ? new Date(store.createdAt).toLocaleDateString() : '-'}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Store phone</p>
                <p className="truncate font-mono text-gray-700">{store.phone}</p>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-gray-50 p-2 text-[11px] text-gray-600">
              https://{store.subLink}.matager.store
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <Link
                href={`https://${store.subLink}.matager.store`}
                target="_blank"
                className="rounded-lg bg-blue-50 py-2 text-center text-xs font-medium text-blue-700 hover:bg-blue-100"
              >
                فتح
              </Link>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://${store.subLink}.matager.store`);
                  toast.success('تم نسخ رابط المتجر');
                }}
                className="rounded-lg bg-gray-100 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200"
              >
                نسخ
              </button>

              <button
                onClick={async () => {
                  await fetch(`/api/admin/stats/inactive/${store.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ active: !store.active }),
                  });
                  location.reload();
                }}
                className="rounded-lg bg-red-50 py-2 text-xs font-medium text-red-700 hover:bg-red-100"
              >
                {store.active ? 'إيقاف' : 'تفعيل'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
