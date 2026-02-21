'use client';

import { useParams, useRouter } from 'next/navigation';
import { plans } from '../../_data/plans';
import { useState } from 'react';
import { CheckCircle, ChevronDown, ChevronUp, Wallet } from 'lucide-react';
import { MdPayment } from 'react-icons/md';
import { fbEvent } from '@/app/(page)/Dashboard/_utils/pixel';
import { subscribePlan } from '@/app/(page)/Dashboard/_utils/subscribePlan';
import { toast } from 'sonner';
import Image from 'next/image';
export default function PlanCheckout() {
  const params = useParams();
  const router = useRouter();
  const type = params?.type as string;

  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const plan = plans[type as keyof typeof plans];

  const handleSubscribe = async () => {
    if (!type) return;

    setLoading(true);

    fbEvent('InitiateCheckout', { content_name: type });

    try {
      const result = await subscribePlan(type);

      if (result.redirect_url) {
        window.location.href = result.redirect_url;
        return;
      }

      fbEvent('Purchase', {
        content_name: type,
        currency: 'IQD',
        value: plan.price,
      });

      toast.success(`تم الاشتراك في ${plan.name}`);
      setOpenDialog(false);
    } catch {
      toast.error('حدث خطأ أثناء الاشتراك');
    } finally {
      setLoading(false);
    }
  };

  if (!plan) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <p className="text-sm text-neutral-500">الخطة غير موجودة</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-neutral-50 px-4 py-14">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1.4fr_.6fr]">
        <div className="relative rounded-xl bg-white p-10 ring-1 ring-neutral-200">
          <p className="text-xs text-neutral-400">تفاصيل الاشتراك</p>
          <div className="absolute top-0 -left-3 z-50 flex text-3xl">
            <Image
              src={'/img-theme/IMG_8473-removebg-preview.png'}
              alt="al"
              width={100}
              height={200}
            />
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{plan.name}</h1>

          <p className="mt-3 text-sm leading-relaxed text-neutral-500">{plan.description}</p>

          <div className="mt-8 space-y-4 border-t pt-6">
            {(showMore ? plan.features : plan.features.slice(0, 3)).map(feature => (
              <div key={feature} className="flex items-start gap-3 text-sm text-neutral-700">
                <CheckCircle size={18} className="mt-[2px] shrink-0 text-emerald-500" />
                {feature}
              </div>
            ))}

            <button
              onClick={() => setShowMore(!showMore)}
              className="flex items-center gap-2 text-sm text-sky-600 transition hover:opacity-80"
            >
              {showMore ? 'إخفاء التفاصيل' : 'عرض كل المميزات'}
              {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          <div className="mt-8 rounded-xl bg-neutral-50 p-4 text-xs text-neutral-500">
            يتم تفعيل الاشتراك مباشرة بعد نجاح عملية الدفع.
          </div>
        </div>

        <div className="h-fit rounded-xl bg-white p-6 ring-1 ring-neutral-200">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">الدفع</h2>
            <Wallet size={20} className="mt-1" />
          </div>

          <div className="mt-6 rounded-xl bg-sky-50 py-8 text-center">
            <p className="text-xs text-neutral-500">السعر النهائي</p>
            <p className="mt-1 text-4xl font-bold tracking-tight">
              {plan.price.toLocaleString()} د.ع
            </p>
          </div>

          <button
            onClick={() => setOpenDialog(true)}
            className="mt-8 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-sky-500 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 active:scale-[0.99]"
          >
            تأكيد الدفع
            <MdPayment size={20} />
          </button>

          <button
            onClick={() => router.push('/Dashboard')}
            className="mt-3 w-full cursor-pointer rounded-lg border border-neutral-300 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            العودة للباقات
          </button>
        </div>
      </div>

      {openDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-7 shadow-xl">
            <h3 className="text-lg font-semibold">تأكيد الاشتراك</h3>

            <p className="mt-3 text-sm leading-relaxed text-neutral-500">
              هل تريد الاشتراك في خطة
              <b> {plan.name} </b>
              بسعر
              <b> {plan.price.toLocaleString()} د.ع </b>؟
            </p>

            <div className="mt-7 flex gap-3">
              <button
                disabled={loading}
                onClick={() => setOpenDialog(false)}
                className="w-full rounded-lg border py-2.5 text-sm hover:bg-neutral-50"
              >
                إلغاء
              </button>

              <button
                disabled={loading}
                onClick={handleSubscribe}
                className="w-full rounded-lg bg-sky-500 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {loading ? 'جاري المعالجة...' : 'تأكيد الاشتراك'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
