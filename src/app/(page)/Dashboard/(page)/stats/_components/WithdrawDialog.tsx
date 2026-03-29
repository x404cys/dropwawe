'use client';

import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowDownToLine, Clock3, Wallet } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BsWhatsapp } from 'react-icons/bs';
import { toast } from 'sonner';
import useSWR from 'swr';
import { useLanguage } from '../../../context/LanguageContext';
import { useStoreProvider } from '../../../context/StoreContext';

export function StoreBalanceWithdraw({ availableBalanceOrder }: { availableBalanceOrder: number }) {
  const { currentStore } = useStoreProvider();
  const { dir, t } = useLanguage();
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetcher = (url: string) =>
    fetch(url, { headers: { 'x-store-id': currentStore?.id || '' } }).then(response =>
      response.json()
    );

  const { data: balance, mutate } = useSWR<{ available: number; pending: number }>(
    currentStore?.id ? '/api/dashboard/wallet/balance' : null,
    fetcher,
    { refreshInterval: 10000, revalidateOnFocus: true }
  );

  const availableBalance = useMemo(() => {
    if (typeof balance?.available === 'number') return balance.available;
    return availableBalanceOrder;
  }, [availableBalanceOrder, balance?.available]);

  const pendingBalance = balance?.pending ?? 0;
  const canWithdraw = availableBalance > 0 && !isSubmitting;

  const handleWithdraw = async () => {
    if (!currentStore?.id) {
      toast.error(t.stats.storeNotSelected);
      return;
    }

    if (availableBalance <= 0) {
      toast.error(t.stats.noAvailableBalance);
      return;
    }

    setIsSubmitting(true);
    const requestedAmount = availableBalance;

    try {
      const response = await fetch('/api/dashboard/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-store-id': currentStore.id,
        },
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(`${t.success}: ${formatIQD(requestedAmount)} ${t.currency}`);
        setWithdrawOpen(false);
        mutate();
      } else {
        toast.error(data.error || t.error);
      }
    } catch (error) {
      console.error(error);
      toast.error(t.stats.networkErrorRetry);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="bg-card border-border/70 flex w-full flex-col justify-center rounded-2xl border p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1.5">
            <p className="text-muted-foreground text-[11px]">{t.stats.totalRevenue}</p>
            <p className="text-foreground text-xl leading-none font-bold">
              {formatIQD(availableBalanceOrder)}
              <span className="text-muted-foreground mr-1 text-xs font-medium">{t.currency}</span>
            </p>
          </div>
          <div className="bg-primary/10 text-primary rounded-xl p-2.5">
            <Wallet className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="bg-card border-border relative flex w-full flex-col justify-center overflow-hidden rounded-2xl border p-4">
        <div className="from-primary/15 pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b to-transparent" />

        <div className="relative flex items-center justify-between gap-3">
          <div className="space-y-1.5">
            <p className="text-muted-foreground text-[11px]">{t.stats.electronicPaymentRevenue}</p>
            <p className="text-foreground text-xl leading-none font-bold">
              {formatIQD(availableBalance)}
              <span className="text-muted-foreground mr-1 text-xs font-medium">{t.currency}</span>
            </p>
          </div>

          <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="h-9 rounded-lg px-3 text-xs font-semibold"
                disabled={availableBalance <= 0 || isSubmitting}
              >
                <ArrowDownToLine className="h-4 w-4" />
                {t.stats.requestWithdraw}
              </Button>
            </DialogTrigger>

            <DialogContent dir={dir} className="rounded-2xl p-5 sm:max-w-[420px]">
              <DialogHeader className={`space-y-1 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                <DialogTitle className="text-base">{t.stats.withdrawTitle}</DialogTitle>
                <DialogDescription className="text-xs leading-5">
                  {t.stats.withdrawDescription}
                </DialogDescription>
              </DialogHeader>

              <div className="bg-muted/30 space-y-2 rounded-xl border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t.stats.requestedWithdrawBalance}</span>
                  <span className="font-semibold">
                    {formatIQD(availableBalance)} {t.currency}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t.stats.pendingWithdrawBalance}</span>
                  <span className="font-semibold">
                    {formatIQD(pendingBalance)} {t.currency}
                  </span>
                </div>
              </div>

              <div className="bg-primary/5 text-muted-foreground flex flex-col gap-2 rounded-lg p-2.5 text-xs">
                <div className="flex items-start gap-2">
                  <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <p>{t.stats.transferTimeNotice}</p>
                </div>
                <div className="flex items-start gap-2">
                  <BsWhatsapp className="inline h-3.5 w-3.5 shrink-0" />
                  <p>{t.stats.whatsappNotice}</p>
                </div>
              </div>

              <DialogFooter className="sm:justify-start">
                <div className="flex w-full items-center gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setWithdrawOpen(false)}
                    disabled={isSubmitting}
                  >
                    {t.cancel}
                  </Button>
                  <Button className="flex-1" onClick={handleWithdraw} disabled={!canWithdraw}>
                    {isSubmitting ? t.loading : t.confirm}
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
