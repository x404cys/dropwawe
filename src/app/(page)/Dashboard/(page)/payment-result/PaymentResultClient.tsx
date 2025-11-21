'use client';

import useSWR from 'swr';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LuCopy } from 'react-icons/lu';
import { CiShare1 } from 'react-icons/ci';
import { toast } from 'sonner';

export default function PaymentResultClient() {
  const params = useSearchParams();
  const tranRef = params.get('tranRef') ?? '';
  const respStatus = params.get('respStatus') ?? '';
  const respMessage = params.get('respMessage') ?? '';
  const cartId = params.get('cartId') ?? '';
  const [copied, setCopied] = useState(false);

  const isSuccess = respStatus === 'A' || respStatus === 'success';

  async function updateSubscription() {
    await fetch('/api/payment/paytabs/plans/subscriptions/update-status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tranRef,
        respCode: respStatus,
        respMessage,
        cartId,
      }),
    });
  }

  useEffect(() => {
    if (isSuccess && cartId) {
      updateSubscription();
    }
  }, [isSuccess, cartId]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: 'تفاصيل الطلب',
        text: `تفاصيل الطلب`,
        url,
      });
    } else {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('تم نسخ الرابط');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div dir="rtl" className="min-h-screen py-5">
      <div className="mx-auto max-w-3xl space-y-6">
        <div
          className={`rounded-lg p-8 text-center shadow-sm ${
            isSuccess
              ? 'border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50'
              : 'border border-red-200 bg-gradient-to-br from-red-50 to-rose-50'
          }`}
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
            {isSuccess ? (
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            ) : (
              <XCircle className="h-8 w-8 text-red-600" />
            )}
          </div>

          <h1 className={`mb-2 text-xl font-bold ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
            {isSuccess ? 'تمت عملية الدفع بنجاح' : 'فشلت عملية الدفع'}
          </h1>

          <p className={`text-lg ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
            {respMessage || 'تمت معالجة عملية الدفع'}
          </p>

          <div className="flex flex-col items-center justify-center gap-3 pt-6 sm:flex-row sm:gap-5">
            <Button
              onClick={handleShare}
              variant={'outline'}
              className="w-full px-6 py-2 font-semibold sm:w-auto"
            >
              <span> شارك الطلب</span> <CiShare1 />
            </Button>

            <Button
              onClick={handleCopy}
              variant={'default'}
              className="w-full px-6 py-2 font-semibold sm:w-auto"
            >
              <span>نسخ</span> <LuCopy />
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800">
            <CreditCard className="h-5 w-5" />
            تفاصيل المعاملة
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">رقم المعاملة</span>
              <span className="font-mono text-sm font-medium text-gray-900">
                {tranRef || 'غير متوفر'}
              </span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">الحالة</span>
              <span className={`font-semibold ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                {isSuccess ? 'نجحت' : 'فشلت'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">معرف السلة</span>
              <span className="font-mono text-sm font-medium text-gray-900">
                {cartId || 'غير متوفر'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
