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
import { Rocket, ChevronRight, CreditCard, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubscriptionResponse } from '@/types/users/User';

const STATUS_ICON: Record<string, React.ReactNode> = {
  TRIAL_ACTIVE: <BiTestTube className="h-5 w-5 text-primary" />,
  ACTIVE: <Rocket className="h-5 w-5 text-primary" />,
  NEED_SUBSCRIPTION: <RiFireLine className="h-5 w-5 text-destructive" />,
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
    return <div className="h-24 w-full animate-pulse rounded-2xl border border-border bg-card shadow-sm" />;
  }

  const startDate = data?.subscription?.startDate ? new Date(data.subscription.startDate) : null;
  const endDate = data?.subscription?.endDate ? new Date(data.subscription.endDate) : null;

  const formattedStart = startDate ? format(startDate, 'dd/MM/yyyy') : '-';
  const formattedEnd = endDate ? format(endDate, 'dd/MM/yyyy') : '-';

  const remainingDays =
    startDate && endDate ? Math.max(0, differenceInDays(endDate, new Date()) + 1) : null;
  const totalDays = startDate && endDate ? Math.max(1, differenceInDays(endDate, startDate)) : 30;
  const progressPercent =
    remainingDays !== null ? Math.min(100, (remainingDays / totalDays) * 100) : 0;

  const status = data?.status ?? 'NEED_SUBSCRIPTION';
  const isExpiringSoon = remainingDays !== null && remainingDays <= 7;

  const planName = data?.subscription?.planName || t.plans?.noSubscription || 'لا يوجد اشتراك';

  const description =
    status === 'ACTIVE'
      ? data?.subscription?.detailsSubscription?.description
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
      className="w-full rounded-2xl border  shadow-sm border-border border-primary/10 bg-card md:shadow transition-all duration-300 flex flex-col"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 px-4 md:px-5 text-right transition hover:bg-muted/50 rounded-2xl outline-none gap-3"
      >
        <div className="flex items-center gap-3 w-full min-w-0">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 shadow-sm border border-primary/10">
            {STATUS_ICON[status] ?? <CreditCard className="h-5 w-5 text-primary" />}
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <h3 className="text-sm md:text-base font-bold text-foreground flex items-center gap-2">
              <span className="truncate">{planName}</span>
              {status === 'ACTIVE' && <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground truncate font-medium mt-0.5">{description}</p>
          </div>
        </div>

        <ChevronRight
          className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-300 ${
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
            <div className="border-t border-border/50 px-4 md:px-5 pb-5 pt-3 mt-1 space-y-5">
              {/* Status Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-semibold text-foreground">
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
                  {isExpiringSoon && status !== 'NEED_SUBSCRIPTION' && ` · ${t.plans?.expiringSoon || 'ينتهي قريباً'}`}
                </span>
              </div>

              {/* Dates */}
              {data?.subscription && status !== 'SUB_USER' && (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center justify-between text-right rounded-xl bg-muted/50 p-4 border border-border/50">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">{t.plans?.startDate || 'البداية'}</p>
                    <p className="text-sm font-semibold text-foreground">{formattedStart}</p>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-primary/20 mx-4" />
                  <div className="space-y-1 border-t sm:border-t-0 border-border/50 pt-3 sm:pt-0 sm:text-right">
                    <p className="text-xs font-medium text-muted-foreground">{t.plans?.endDate || 'الانتهاء'}</p>
                    <p className="text-sm font-semibold text-foreground">{formattedEnd}</p>
                  </div>
                </div>
              )}

              {/* Progress */}
              {remainingDays !== null && status !== 'SUB_USER' && (
                <div className="space-y-2.5">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-medium text-muted-foreground">
                      {t.plans?.remaining || 'المتبقي'}
                    </span>
                    <span className={`text-sm font-bold ${isExpiringSoon ? 'text-destructive' : 'text-primary'}`}>
                      {remainingDays === 0 ? 'منتهي' : `${remainingDays} ${t.plans?.days || 'يوم'}`}
                    </span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
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

              {/* Actions */}
              {status !== 'SUB_USER' && (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    onClick={() => router.push('/Dashboard/plans')}
                    className="flex-1 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-11 transition-colors"
                  >
                    {t.plans?.viewPlans || 'عرض الباقات'}
                  </Button>

                  <Button
                    onClick={() => router.push('/Dashboard/plans')}
                    variant="outline"
                    className="flex-1 w-full bg-card hover:bg-muted text-foreground border border-border/50 font-semibold rounded-xl h-11 transition-colors"
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
