'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Store, ExternalLink, Search, ChevronDown, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { StoreProps } from '@/types/store/StoreType';

type FilterType = 'all' | 'active' | 'inactive';

const StoresList = ({ stores }: { stores: StoreProps[] }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const router = useRouter();

  const options: { label: string; value: FilterType }[] = [
    { label: 'الكل', value: 'all' },
    { label: 'فعال', value: 'active' },
    { label: 'غير فعال', value: 'inactive' },
  ];

  const filteredStores = useMemo(() => {
    if (!stores) return [];

    return stores.filter(store => {
      const matchSearch =
        store.subLink?.toLowerCase().includes(search.toLowerCase()) ||
        store.name?.toLowerCase().includes(search.toLowerCase());

      let matchFilter = true;
      if (filter === 'active') matchFilter = !!store.active;
      else if (filter === 'inactive') matchFilter = !store.active;

      return matchSearch && matchFilter;
    });
  }, [stores, search, filter]);

  return (
    <div className="bg-card border-border w-full overflow-hidden rounded-xl border shadow-sm">
      <div className="border-border bg-muted/30 border-b p-6">
        <div className="flex items-center gap-3">
          <div className="bg-background border-border rounded-lg border p-2.5">
            <Store className="text-muted-foreground h-5 w-5" />
          </div>
          <div>
            <h2 className="text-foreground text-lg font-semibold">المتاجر</h2>
            <p className="text-muted-foreground text-sm">{filteredStores.length} متجر</p>
          </div>
        </div>
      </div>

      <div className="border-border bg-background border-b p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث عن متجر..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring/20 h-10 w-full rounded-lg border px-3 pl-10 text-sm transition-colors focus:ring-2 focus:outline-none"
            />
          </div>

          <div className="bg-muted flex gap-1 rounded-lg p-1">
            {options.map(opt => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  filter === opt.value
                    ? 'bg-background text-foreground border-border border shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-h-[600px] overflow-y-auto">
          {filteredStores.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredStores.map(store => {
                const isExpanded = expanded === store.id;
                const isActive = store.active;

                return (
                  <motion.div
                    key={store.id}
                    layout
                    className="group bg-card border-border hover:border-ring/20 rounded-lg border p-4 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="items-st art mb-3 flex justify-between">
                      <button
                        onClick={() => setExpanded(isExpanded ? null : store.id!)}
                        className="flex min-w-0 flex-1 items-center gap-3 text-left"
                      >
                        <div className="bg-muted border-border group-hover:bg-background flex h-10 w-10 items-center justify-center rounded-lg border transition-colors">
                          <Store className="text-muted-foreground h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground truncate text-sm font-medium">
                            {store.subLink || store.name}
                          </p>
                          <p className="text-muted-foreground text-xs">{store.name}</p>
                        </div>
                      </button>

                      <ChevronDown
                        className={`text-muted-foreground h-4 w-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          isActive
                            ? 'border border-green-200 bg-green-50 text-green-700'
                            : 'border border-red-200 bg-red-50 text-red-700'
                        }`}
                      >
                        {isActive ? 'فعال' : 'غير فعال'}
                      </span>

                      <button
                        onClick={async () => {
                          if (!confirm('هل تريد تغيير حالة المتجر؟')) return;

                          try {
                            await fetch(`/api/admin/stats/inactive/${store.id}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ active: !store.active }),
                            });
                            router.refresh();
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className="hover:bg-muted rounded-md p-1.5 transition-colors"
                      >
                        {store.active ? (
                          <ToggleRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-red-600" />
                        )}
                      </button>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="border-border mt-4 border-t pt-4"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground text-xs font-medium">
                                الرابط:
                              </span>
                              {store.subLink ? (
                                <Link
                                  href={`https://${store.subLink}.dropwave.cloud`}
                                  target="_blank"
                                  className="flex items-center gap-1 text-xs text-blue-600 transition-colors hover:text-blue-700"
                                >
                                  {store.subLink}
                                  <ExternalLink className="h-3 w-3" />
                                </Link>
                              ) : (
                                <span className="text-muted-foreground text-xs">—</span>
                              )}
                            </div>
                            <div className='flex  justify-between items-center'> 
                              <span className='text-xs'>تاريخ الانشاء</span>
                              <span className="text-xs">
                                {store.createdAt
                                  ? new Date(store.createdAt).toLocaleDateString('en')
                                  : '—'}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Store className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground text-sm">لا يوجد متاجر مطابقة</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoresList;
