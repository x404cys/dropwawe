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
import { Rocket, Calendar, Clock, Crown, ChevronRight, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { SubscriptionResponse } from '@/types/users/User';

const STATUS_ICON: Record<string, React.ReactNode> = {
  TRIAL_ACTIVE: <BiTestTube className="text-[#27a9d6]" />,
  ACTIVE: <Rocket size={18} className="text-[#27a9d6]" />,
  NEED_SUBSCRIPTION: <RiFireLine className="text-[#27a9d6]" />,
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
    return <div className="h-24 animate-pulse rounded-xl border border-[#cfeaf3] bg-[#f7fafc]" />;
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
    <div dir="rtl" className="w-full">
      <div className="overflow-hidden rounded-xl border border-[#cfeaf3] bg-[#f7fafc] transition">
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between px-4 py-3 text-right transition hover:bg-[#eef7fb]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-12 items-center justify-center rounded-full bg-[#dff3fa]">
              {STATUS_ICON[status] ?? <CreditCard className="h-4 w-4 text-[#27a9d6]" />}
            </div>

            <div>
              <p className="text-sm font-bold text-[#1f2937]">{planName}</p>
              <p className="text-xs text-[#6b7280]">{description}</p>
            </div>
          </div>

          <ChevronRight
            className={`h-4 w-4 text-[#6b7280] transition-transform duration-300 ${
              open ? 'rotate-90' : ''
            }`}
          />
        </button>

        {open && <div className="border-t border-[#e6f3f8]" />}

        <motion.div
          initial={false}
          animate={{
            height: open ? 'auto' : 0,
            opacity: open ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="space-y-4 px-4 py-4">
            <span
              className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold ${
                isExpiringSoon ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'
              }`}
            >
              {STATUS_LABEL[status]}
              {isExpiringSoon && ` · ${t.plans?.expiringSoon || 'ينتهي قريباً'}`}
            </span>

            {data?.subscription && status !== 'SUB_USER' && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500">{t.plans?.startDate || 'البداية'}</p>
                  <p className="font-semibold">{formattedStart}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">{t.plans?.endDate || 'الانتهاء'}</p>
                  <p className="font-semibold">{formattedEnd}</p>
                </div>
              </div>
            )}

            {remainingDays !== null && status !== 'SUB_USER' && (
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>{t.plans?.remaining || 'المتبقي'}</span>
                  <span className="font-semibold">
                    {remainingDays === 0 ? 'منتهي' : `${remainingDays} ${t.plans?.days || 'يوم'}`}
                  </span>
                </div>

                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isExpiringSoon ? 'bg-red-400' : 'bg-primary/50'
                    }`}
                    style={{
                      width: `${progressPercent}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {status !== 'SUB_USER' && (
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => router.push('/Dashboard/plans')}
                  className="bg-primary/60 hover:bg-primary/70 flex-1 cursor-pointer rounded-lg text-xs text-white"
                >
                  {t.plans?.viewPlans || 'عرض الباقات'}
                </Button>

                <Button
                  onClick={() => router.push('/Dashboard/plans')}
                  variant="outline"
                  className="hover:bg-primary flex-1 cursor-pointer rounded-lg text-xs"
                >
                  {t.plans?.renew || 'تجديد'}
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
