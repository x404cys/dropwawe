import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { Button } from '@/components/ui/button';
import { SubscriptionResponse, UserSubscription } from '@/types/users/User';
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
  // if (!data || !data.subscription || !data.subscription.detailsSubscription)
  //   return router.replace('/Dashboard/plans');
  return (
    <div dir="rtl" className="w-full space-y-5 rounded-lg bg-white">
      <div className="rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 p-5 text-white shadow-md">
        <div className="flex items-center justify-between">
          {!data || !data.subscription || !data.subscription.detailsSubscription ? (
            <div>انت غير مشترك حاليا يجب عليك اختيار الخطة المناسبة</div>
          ) : (
            <div>
              <p className="text-base font-semibold">{data?.subscription?.planName}</p>
              <p className="mt-1 text-xs leading-snug text-gray-300">
                مناسبة للتجار المبتدئين، مع مزايا ممتازة واحترافية.
              </p>
            </div>
          )}
          <div className="rounded-md border p-1">
            {data?.subscription?.detailsSubscription?.type === 'PENDINGROFESSIONAL' ? (
              <RiFireLine />
            ) : data?.subscription?.detailsSubscription?.type === 'NORMAL' ? (
              <BiTestTube />
            ) : (
              <Rocket size={22} />
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between py-6.5 text-sm text-gray-200">
          <div className="flex flex-col items-center">
            <span className="text-gray-400">بدأ</span>
            <span className="font-medium">{formattedStartDate}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-400">الانتهاء</span>
            <span className="font-medium">{formattedEndDate}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-400">المتبقي</span>
            <span className="font-medium">{remainingDays} يوم</span>
          </div>
        </div>

        <div className="mt-5 flex flex-col flex-wrap-reverse gap-3 sm:flex-row">
          <Button
            onClick={() => router.push('/Dashboard/plans')}
            className="w-full cursor-pointer rounded-lg bg-white text-black duration-200 hover:text-white"
          >
            <IoBusinessOutline className="ml-2" />
            <span>اشترك بالباقة الاحترافية</span>
          </Button>

          <Button
            onClick={() => router.push('/Dashboard/plans')}
            variant="outline"
            className="w-full cursor-pointer rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <span>تجديد الاشتراك</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
