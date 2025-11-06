'use client';

import { useState } from 'react';
import type { User } from '@/types/users/User';
import Image from 'next/image';
import { FiTrash2 } from 'react-icons/fi';
import { Search } from 'lucide-react';

export default function UserTableComponents({ users }: { users: User[] }) {
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(
    user =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role?.toLowerCase().includes(search.toLowerCase()) ||
      user.Store?.some(store => store.name?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full space-y-6 px-2 py-2">
      <div className="relative mx-auto flex max-w-md items-center gap-2">
        <div className="rounded bg-gray-950 p-2 text-white">{users.length}</div>

        <input
          type="text"
          placeholder="ابحث بالاسم، البريد، الدور أو المتجر..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="hidden w-full overflow-x-auto rounded-lg border border-gray-200 md:block">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-right text-sm font-semibold">المستخدم</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">المتجر</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">البريد الإلكتروني</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">الدور</th>
              <th className="px-4 py-2 text-center text-sm font-semibold">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <tr key={user.id} className="transition-colors hover:bg-gray-50">
                <td className="flex items-center gap-3 px-4 py-3">
                  <Image
                    alt={user.name || 'User Avatar'}
                    src={user.image || '/placeholder.svg'}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <span className="text-sm font-medium">{user.name}</span>
                </td>
                <td className="px-4 py-3 text-sm">
                  {user.Store?.map(store => store.name).join(', ') || 'لا يوجد متجر'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{user.email}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                    {user.role || 'مستخدم'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button className="flex items-center gap-2 rounded-lg bg-red-100 px-3 py-1 text-xs font-medium text-red-700 transition hover:bg-red-200">
                    <FiTrash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="max-h-[100vh] overflow-y-scroll">
        <div className="space-y-4 md:hidden">
          {filteredUsers.map(user => (
            <div key={user.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Image
                  alt={user.name || 'User Avatar'}
                  src={user.image || '/placeholder.svg'}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-sm">
                <p>
                  <span className="font-semibold">الدور: </span>
                  {user.role || 'مستخدم'}
                </p>
                <p>
                  <span className="font-semibold">المتجر: </span>
                  {user.Store?.map(store => store.name).join(', ') || 'لا يوجد متجر'}
                </p>
              </div>

              <div className="mt-3 flex justify-end">
                <button className="flex items-center gap-2 rounded-lg bg-red-100 px-3 py-1 text-xs font-medium text-red-700 transition hover:bg-red-200">
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
