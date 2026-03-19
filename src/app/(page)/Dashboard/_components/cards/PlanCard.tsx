'use client';

import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { format, differenceInDays } from 'date-fns';
import { BiTestTube } from 'react-icons/bi';
import { RiFireLine } from 'react-icons/ri';
import { Rocket, ChevronRight, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubscriptionResponse } from '@/types/users/User';

const STATUS_ICON: Record<string, React.ReactNode> = {
  TRIAL_ACTIVE: <BiTestTube className="text-primary h-5 w-5" />,
  ACTIVE: <Rocket className="text-primary h-5 w-5" />,
  NEED_SUBSCRIPTION: <RiFireLine className="text-destructive h-5 w-5" />,
};

export default function PlanCard() {
  const { t } = useLanguage();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const STATUS_LABEL: Record<string, string> = {
    TRIAL_ACTIVE: t.plans?.trial || 'تجريبي',
    ACTIVE: t.plans?.active || 'نشط',
    NEED_SUBSCRIPTION: t.plans?.expired || 'منتهي',
    SUB_USER: t.plans?.subtitle || 'مشترك فرعي',
  };

  const fetcher = (url: string) => axios.get(url, { timeout: 10000 }).then(res => res.data);

  const { data, isLoading } = useSWR<SubscriptionResponse>(
    '/api/plans/subscriptions/check',
    fetcher
  );

  if (isLoading) {
    return (
      <div className="border-border bg-card h-24 w-full animate-pulse rounded-2xl border shadow-sm" />
    );
  }

  const startDate = data?.subscription?.startDate ? new Date(data.subscription.startDate) : null;
  const endDate = data?.subscription?.endDate ? new Date(data.subscription.endDate) : null;

  const formattedStart = startDate ? format(startDate, 'dd/MM/yyyy') : '-';
  const formattedEnd = endDate ? format(endDate, 'dd/MM/yyyy') : '-';

  const isUnlimitedPlan = data?.subscription?.type === 'trader-basic';

  const remainingDays = isUnlimitedPlan
    ? null
    : startDate && endDate
      ? Math.max(0, differenceInDays(endDate, new Date()) + 1)
      : null;

  const totalDays =
    !isUnlimitedPlan && startDate && endDate
      ? Math.max(1, differenceInDays(endDate, startDate))
      : 30;

  const progressPercent =
    remainingDays !== null ? Math.min(100, (remainingDays / totalDays) * 100) : 0;

  const status = data?.status ?? 'NEED_SUBSCRIPTION';
  const isExpiringSoon = !isUnlimitedPlan && remainingDays !== null && remainingDays <= 7;

  const planName = data?.subscription?.planName || t.plans?.noSubscription || 'لا يوجد اشتراك';

  const description =
    status === 'ACTIVE'
      ? isUnlimitedPlan
        ? 'اشتراك مفتوح'
        : data?.subscription?.detailsSubscription?.description
      : status === 'TRIAL_ACTIVE'
        ? `${t.plans?.remainingTrial || 'متبقي'} ${remainingDays ?? 0} ${t.plans?.days || 'يوم'}`
        : status === 'SUB_USER'
          ? t.plans?.subAccount || 'الاشتراك تابع لصاحب المتجر'
          : t.plans?.trialEnded || 'انتهت الفترة التجريبية';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      dir="rtl"
      className="border-border border-primary/10 bg-card flex w-full flex-col rounded-2xl border shadow-sm transition-all duration-300 md:shadow"
    >
      <button
        onClick={() => setOpen(!open)}
        className="hover:bg-muted/50 flex w-full items-center justify-between gap-3 rounded-2xl p-4 px-4 text-right transition outline-none md:px-5"
      >
        <div className="flex w-full min-w-0 items-center gap-3">
          <div className="bg-primary/10 border-primary/10 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border shadow-sm">
            {STATUS_ICON[status] ?? <CreditCard className="text-primary h-5 w-5" />}
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <h3 className="text-foreground flex items-center gap-2 text-sm font-bold md:text-base">
              <span className="truncate">{planName}</span>
            </h3>
            <p className="text-muted-foreground mt-0.5 truncate text-xs font-medium md:text-sm">
              {description}
            </p>
          </div>
        </div>

        <ChevronRight
          className={`text-muted-foreground h-5 w-5 flex-shrink-0 transition-transform duration-300 ${
            open ? 'rotate-90' : 'rotate-180'
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-border/50 mt-1 space-y-5 border-t px-4 pt-3 pb-5 md:px-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-foreground text-sm font-semibold">
                  {t.home?.planAndSub || 'الباقة والاشتراك'}
                </span>
                <span
                  className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-bold tracking-wide ${
                    status === 'NEED_SUBSCRIPTION' || isExpiringSoon
                      ? 'bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-red-400'
                      : 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                  }`}
                >
                  {STATUS_LABEL[status]}
                  {isExpiringSoon &&
                    status !== 'NEED_SUBSCRIPTION' &&
                    ` · ${t.plans?.expiringSoon || 'ينتهي قريباً'}`}
                </span>
              </div>

              {data?.subscription && status !== 'SUB_USER' && (
                <div className="bg-muted/50 border-border/50 flex flex-col justify-between gap-3 rounded-xl border p-4 text-right sm:flex-row sm:items-center sm:gap-0">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium">
                      {t.plans?.startDate || 'البداية'}
                    </p>
                    <p className="text-foreground text-sm font-semibold">{formattedStart}</p>
                  </div>

                  <div className="bg-primary/20 mx-4 hidden h-8 w-px sm:block" />

                  <div className="border-border/50 space-y-1 border-t pt-3 sm:border-t-0 sm:pt-0 sm:text-right">
                    <p className="text-muted-foreground text-xs font-medium">
                      {t.plans?.endDate || 'الانتهاء'}
                    </p>
                    <p className="text-foreground text-sm font-semibold">
                      {isUnlimitedPlan ? 'مفتوح' : formattedEnd}
                    </p>
                  </div>
                </div>
              )}

              {status !== 'SUB_USER' && isUnlimitedPlan && (
                <div className="space-y-2.5">
                  <div className="flex items-end justify-between">
                    <span className="text-muted-foreground text-sm font-medium">
                      {t.plans?.remaining || 'المتبقي'}
                    </span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {'غير محدود'}
                    </span>
                  </div>

                  <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
                    <div className="h-full w-full rounded-full bg-emerald-500" />
                  </div>
                </div>
              )}

              {remainingDays !== null && status !== 'SUB_USER' && !isUnlimitedPlan && (
                <div className="space-y-2.5">
                  <div className="flex items-end justify-between">
                    <span className="text-muted-foreground text-sm font-medium">
                      {t.plans?.remaining || 'المتبقي'}
                    </span>
                    <span
                      className={`text-sm font-bold ${isExpiringSoon ? 'text-destructive' : 'text-primary'}`}
                    >
                      {remainingDays === 0 ? 'منتهي' : `${remainingDays} ${t.plans?.days || 'يوم'}`}
                    </span>
                  </div>

                  <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        isExpiringSoon ? 'bg-destructive' : 'bg-primary'
                      }`}
                    />
                  </div>
                </div>
              )}

              {status !== 'SUB_USER' && (
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Button
                    onClick={() => router.push('/Dashboard/plans')}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 w-full flex-1 rounded-xl font-semibold transition-colors"
                  >
                    {t.plans?.viewPlans || 'عرض الباقات'}
                  </Button>

                  <Button
                    onClick={() => router.push('/Dashboard/plans')}
                    variant="outline"
                    className="bg-card hover:bg-muted text-foreground border-border/50 h-11 w-full flex-1 rounded-xl border font-semibold transition-colors"
                  >
                    {t.plans?.renew || 'تجديد'}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
