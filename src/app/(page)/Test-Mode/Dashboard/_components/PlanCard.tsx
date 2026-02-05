import { Button } from '@/components/ui/button';

import { IoBusinessOutline } from 'react-icons/io5';

import { BiTestTube } from 'react-icons/bi';

export default function PlanCard() {
  const timestamp = new Date();

  return (
    <div dir="rtl" className="w-full space-y-5 rounded-lg bg-white">
      <div className="rounded-lg bg-gradient-to-l from-[#04BAF6] from-5% via-[#04BAF6] via-30% to-[#52d4ff] to-80% p-5 text-white shadow-md">
        <div className="flex items-center justify-between">
          <p>باقة تجريبية</p>
          <div className="rounded-md border border-white/20 bg-white/10 p-1 text-white">
            <BiTestTube />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/20 py-6 text-sm text-white/90">
          <div className="flex flex-col items-center">
            <span>بدأ</span>
            <span className="font-medium">
              {' '}
              {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(timestamp)}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span>الانتهاء</span>
            <span className="font-medium">
              {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(timestamp)}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span>المتبقي</span>
            <span className="font-medium">
              {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(timestamp)}
            </span>
          </div>
        </div>

        <div className="mt-5 flex flex-col flex-wrap-reverse gap-3 sm:flex-row">
          <Button className="w-full cursor-pointer rounded-lg bg-white text-sky-700 shadow-sm hover:bg-sky-50 hover:text-sky-900">
            <IoBusinessOutline className="ml-2" />
            <span>اشترك بالباقة الاحترافية</span>
          </Button>

          <Button
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
