'use client';

import { useState, useMemo } from 'react';
import { Users, Search, ChevronDown, Filter } from 'lucide-react';
import Image from 'next/image';
import type { UserProps } from '@/types/Products';
import { motion, AnimatePresence } from 'framer-motion';

type FilterType = 'all' | 'withStore' | 'withoutStore';

const UsersList = ({ users }: { users: UserProps[] }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const options: { label: string; value: FilterType }[] = [
    { label: 'الكل', value: 'all' },
    { label: 'لديهم متجر', value: 'withStore' },
    { label: 'بدون متجر', value: 'withoutStore' },
  ];

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchSearch =
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.storeSlug?.toLowerCase().includes(search.toLowerCase());

      const matchFilter =
        filter === 'all'
          ? true
          : filter === 'withStore'
            ? Boolean(user.storeSlug)
            : !user.storeSlug;

      return matchSearch && matchFilter;
    });
  }, [users, search, filter]);

  return (
    <div id="Users" className="w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-gray-50 p-2">
          <Users className="h-5 w-5 text-gray-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">المستخدمين {users.length}</h2>
      </div>

      <div className="mb-4 flex items-center gap-3">
        {/* حقل البحث */}
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن مستخدم..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pr-3 pl-10 text-sm focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 text-gray-500" />
            {options.find(opt => opt.value === filter)?.label}
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </button>

          {open && (
            <div className="absolute right-0 z-20 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg">
              {options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setFilter(opt.value);
                    setOpen(false);
                  }}
                  className={`block w-full px-4 py-2 text-right text-sm transition hover:bg-gray-100 ${
                    filter === opt.value ? 'bg-gray-50 font-semibold' : ''
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-h-140 space-y-3 overflow-y-auto pr-2">
        {filteredUsers.length > 0 ? (
          <ul role="list" className="divide-y divide-gray-200">
            {filteredUsers.map(user => {
              const isExpanded = expanded === user.id;
              return (
                <li
                  key={user.id}
                  className="mt-1 mb-1 rounded-lg border border-b px-2 py-2 shadow-sm transition hover:bg-white"
                >
                  <button
                    onClick={() => setExpanded(isExpanded ? null : user.id!)}
                    className="flex w-full items-center gap-3 text-left"
                  >
                    <Image
                      src={user.image as string}
                      alt={user.name || 'User'}
                      width={48}
                      height={48}
                      className="size-12 flex-none rounded-full bg-gray-200 object-cover"
                    />
                    <p className="flex-1 text-sm font-semibold text-gray-900">{user.name}</p>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 space-y-2 text-sm text-gray-600"
                      >
                        <p>
                          <span className="font-medium">المتجر:</span> {user.storeSlug || '—'}
                        </p>
                        <p>
                          <span className="font-medium">الهاتف:</span> {user.phone || '—'}
                        </p>
                        <p>
                          <span className="font-medium">الدور:</span> {user.role || '—'}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="p-4 text-center text-sm text-gray-500">لا يوجد مستخدمين مطابقين</p>
        )}
      </div>
    </div>
  );
};

export default UsersList;
