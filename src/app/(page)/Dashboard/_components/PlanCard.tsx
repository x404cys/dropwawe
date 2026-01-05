import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { Button } from '@/components/ui/button';
import { SubscriptionResponse } from '@/types/users/User';
import axios from 'axios';
import { Rocket } from 'lucide-react';
import { IoBusinessOutline } from 'react-icons/io5';
import useSWR from 'swr';
import { format, differenceInDays } from 'date-fns';
import { BiTestTube } from 'react-icons/bi';
import { RiFireLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';

export default function PlanCard() {
  const router = useRouter();
  const fetcher = (url: string) => axios.get(url, { timeout: 10000 }).then(res => res.data);

  const { data } = useSWR<SubscriptionResponse>('/api/plans/subscriptions/check', fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 5000,
    revalidateOnMount: true,
  });

  const startDate = data?.subscription?.startDate ? new Date(data.subscription.startDate) : null;
  const endDate = data?.subscription?.endDate ? new Date(data.subscription.endDate) : null;

  const formattedStartDate = startDate ? format(startDate, 'dd/MM/yyyy') : '-';
  const formattedEndDate = endDate ? format(endDate, 'dd/MM/yyyy') : '-';
  const remainingDays = startDate && endDate ? differenceInDays(endDate, new Date()) + 1 : '-';

  return (
    <div dir="rtl" className="w-full space-y-5 rounded-lg bg-white">
      <div className="rounded-lg bg-gradient-to-b from-sky-600 via-sky-600 to-sky-700 p-5 text-white shadow-md">
        <div className="flex items-center justify-between">
          {!data || !data.subscription || !data.subscription.detailsSubscription ? (
            <div className="text-white/90">انت غير مشترك حاليا يجب عليك اختيار الخطة المناسبة</div>
          ) : (
            <div>
              <p className="text-base font-semibold">{data?.subscription?.planName}</p>
              <p className="mt-1 text-xs leading-snug text-white/80">
                {data.subscription.detailsSubscription.description}
              </p>
            </div>
          )}

          <div className="rounded-md border border-white/20 bg-white/10 p-1 text-white">
            {data?.subscription?.detailsSubscription?.type === 'PENDINGROFESSIONAL' ? (
              <RiFireLine />
            ) : data?.subscription?.detailsSubscription?.type === 'NORMAL' ? (
              <BiTestTube />
            ) : (
              <Rocket size={22} />
            )}
          </div>
        </div>

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
            <span className="font-medium">{remainingDays}</span>
          </div>
        </div>

        <div className="mt-5 flex flex-col flex-wrap-reverse gap-3 sm:flex-row">
          <Button
            onClick={() => router.push('/Dashboard/plans')}
            className="w-full cursor-pointer rounded-lg bg-white text-sky-700 shadow-sm hover:bg-sky-50 hover:text-sky-800"
          >
            <IoBusinessOutline className="ml-2" />
            <span>اشترك بالباقة الاحترافية</span>
          </Button>

          <Button
            onClick={() => router.push('/Dashboard/plans')}
            variant="outline"
            className="w-full cursor-pointer rounded-lg border-sky-200 text-sky-700 hover:bg-sky-100"
          >
            <span>تجديد الاشتراك</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
