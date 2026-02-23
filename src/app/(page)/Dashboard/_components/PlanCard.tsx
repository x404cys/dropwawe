'use client';

import { Button } from '@/components/ui/button';
import axios from 'axios';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { format, differenceInDays } from 'date-fns';
import Image from 'next/image';
import { BiTestTube } from 'react-icons/bi';
import { RiFireLine } from 'react-icons/ri';
import { Rocket } from 'lucide-react';

import { SubscriptionResponse } from '@/types/users/User';

export default function PlanCard() {
  const router = useRouter();

  const fetcher = (url: string) => axios.get(url, { timeout: 10000 }).then(res => res.data);

  const { data, isLoading } = useSWR<SubscriptionResponse>(
    '/api/plans/subscriptions/check',
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 5000,
      revalidateOnMount: true,
    }
  );

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-6 text-center text-sm text-gray-500">
        جاري تحميل بيانات الاشتراك...
      </div>
    );
  }

  const startDate = data?.subscription?.startDate ? new Date(data.subscription.startDate) : null;

  const endDate = data?.subscription?.endDate ? new Date(data.subscription.endDate) : null;

  const formattedStartDate = startDate ? format(startDate, 'dd/MM/yyyy') : '-';
  const formattedEndDate = endDate ? format(endDate, 'dd/MM/yyyy') : '-';

  const remainingDays =
    startDate && endDate ? Math.max(0, differenceInDays(endDate, new Date()) + 1) : null;

  const status = data?.status;
  //
  return (
    <div dir="rtl" className="relative w-full space-y-5 rounded-lg bg-white">
      <div className="rounded-lg bg-gradient-to-l from-[#04BAF6] via-[#04BAF6] to-[#52d4ff] p-5 text-white shadow-md">
        <div className="flex items-start justify-between">
          {data?.subscription?.type === 'ramadan-plan' && (
            <div className="absolute top-0 -left-3 flex text-3xl">
              <Image
                src={'/img-theme/IMG_8473-removebg-preview.png'}
                alt="al"
                width={80}
                height={180}
              />
            </div>
          )}
          {status === 'SUB_USER' && (
            <div className="space-y-3">
              <div>
                <p className="text-base leading-tight font-semibold">
                  {data?.subscription?.planName}
                </p>

                <p className="mt-1 line-clamp-2 text-xs text-white/80">
                  {data?.subscription?.detailsSubscription.description}
                </p>
              </div>

              <div className="h-px w-full bg-white/20" />

              <div className="space-y-1 text-sm">
                <p className="font-medium text-white/90">الاشتراك تابع لصاحب المتجر</p>

                <div className="flex flex-col text-white/80">
                  <span> {data?.owner?.name}</span>
                  <span className="text-xs opacity-90">{data?.owner?.email}</span>
                </div>
              </div>
            </div>
          )}

          {status === 'TRIAL_ACTIVE' && (
            <div>
              <p className="text-base font-semibold">{data?.subscription?.planName}</p>
              <p className="mt-1 text-xs text-white/80">
                متبقي {remainingDays} يوم من الفترة التجريبية
              </p>
            </div>
          )}

          {status === 'ACTIVE' && (
            <div>
              <p className="text-base font-semibold">{data?.subscription?.planName}</p>
              <p className="mt-1 text-xs text-white/80">
                {data?.subscription?.detailsSubscription.description}
              </p>
            </div>
          )}

          {status === 'NEED_SUBSCRIPTION' && (
            <div>
              <p className="text-base font-semibold">انتهت الفترة التجريبية</p>
              <p className="mt-1 text-xs text-white/80">قم بالاشتراك للاستمرار باستخدام النظام</p>
            </div>
          )}

          <div className="rounded-md border border-white/20 bg-white/10 p-1">
            {data?.subscription?.type !== 'ramadan-plan' && (
              <>
                {status === 'TRIAL_ACTIVE' && <BiTestTube />}
                {status === 'ACTIVE' && <Rocket size={22} />}
                {status === 'NEED_SUBSCRIPTION' && <RiFireLine />}
              </>
            )}
          </div>
        </div>

        {data?.subscription && (
          <div className="mt-4 flex items-center justify-between border-t border-white/20 py-6 text-sm text-white/90">
            <div className="flex flex-col items-center">
              <span>بدأ</span>
              <span className="font-medium">{formattedStartDate}</span>
            </div>

            <div className="flex flex-col items-center">
              <span>الانتهاء</span>
              <span className="font-medium">{formattedEndDate}</span>
            </div>

            <div className="flex flex-col items-center">
              <span>المتبقي</span>
              <span className="font-medium">
                {remainingDays === 0 ? 'منتهي' : `${remainingDays} يوم`}
              </span>
            </div>
          </div>
        )}

        {status !== 'SUB_USER' && (
          <div className="mt-5 flex flex-col flex-wrap gap-3 sm:flex-row">
            <Button
              onClick={() => router.push('/Dashboard/plans')}
              className="w-full cursor-pointer bg-white text-sky-700 hover:bg-sky-50"
            >
              <span className="text-black">عرض الباقات</span>
            </Button>

            <Button
              onClick={() => router.push('/Dashboard/plans')}
              variant="outline"
              className="w-full cursor-pointer border-sky-200 text-sky-700 hover:bg-sky-100"
            >
              <span className="text-black">تجديد الاشتراك</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
