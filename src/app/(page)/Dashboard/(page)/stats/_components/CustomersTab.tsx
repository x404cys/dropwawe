import { useState, useMemo } from 'react';
import { Users, Crown, TrendingUp, Search, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { Customer } from '../types';

interface CustomersTabProps {
  customers: Customer[];
}

export function CustomersTab({ customers }: CustomersTabProps) {
  const { t } = useLanguage();
  const [customerSearch, setCustomerSearch] = useState('');

  const filteredCustomers = useMemo(
    () =>
      customers.filter(
        c => !customerSearch || c.name.includes(customerSearch) || c.phone.includes(customerSearch)
      ),
    [customers, customerSearch]
  );

  const topBuyer =
    customers.length > 0 ? customers.reduce((a, b) => (a.total > b.total ? a : b)) : null;

  const totalCustomerSpent = customers.reduce((s, c) => s + c.total, 0);

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-card border-border rounded-lg border p-3 text-center">
          <Users className="text-primary mx-auto mb-1 h-4 w-4" />
          <span className="text-foreground block text-lg font-bold">{customers.length}</span>
          <span className="text-muted-foreground text-[10px]">{t.customers?.title}</span>
        </div>
        <div className="bg-card border-border rounded-lg border p-3 text-center">
          <Crown className="mx-auto mb-1 h-4 w-4 text-yellow-500" />
          <span className="text-foreground block truncate text-xs font-bold">
            {topBuyer?.name ?? '-'}
          </span>
          <span className="text-muted-foreground text-[10px]">{t.customers?.topBuyer}</span>
        </div>
        <div className="bg-card border-border rounded-lg border p-3 text-center">
          <TrendingUp className="mx-auto mb-1 h-4 w-4 text-green-500" />
          <span className="text-foreground block text-xs font-bold">
            {totalCustomerSpent >= 1_000_000
              ? `${(totalCustomerSpent / 1_000_000).toFixed(1)}M`
              : `${(totalCustomerSpent / 1_000).toFixed(0)}K`}
          </span>
          <span className="text-muted-foreground text-[10px]">{t.customers?.totalSpent}</span>
        </div>
      </div>

      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
        <input
          value={customerSearch}
          onChange={e => setCustomerSearch(e.target.value)}
          placeholder={t.customers?.searchPlaceholder || 'ابحث عن عميل...'}
          className="border-border bg-card text-foreground font-light placeholder:text-muted-foreground focus:ring-primary/30 w-full rounded-xl border px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:outline-none"
        />
      </div>

      <div className="bg-card border-border divide-border divide-y rounded-xl border">
        {filteredCustomers.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-16">
            <Users className="mb-3 h-12 w-12 opacity-30" />
            <p className="text-sm font-medium">{t.customers?.noCustomers || 'لا يوجد عملاء'}</p>
          </div>
        ) : (
          filteredCustomers.map((customer, idx) => (
            <div key={idx} className="flex items-center gap-3 px-4 py-3">
              <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
                <span className="text-primary text-sm font-bold">{customer.name.charAt(0)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-sm font-medium">{customer.name}</p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-muted-foreground text-[11px]">{customer.phone}</span>
                  <span className="text-muted-foreground flex items-center gap-0.5 text-[11px]">
                    <ShoppingCart className="h-2.5 w-2.5" />
                    {customer.orders} {t.orders?.order}
                  </span>
                </div>
              </div>
              <div className="text-left">
                <span className="text-foreground block text-sm font-bold">
                  {customer.total.toLocaleString('ar-IQ')}
                </span>
                <span className="text-muted-foreground text-[10px]">{t.currency}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
