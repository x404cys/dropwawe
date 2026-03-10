'use client';
import { useLanguage } from '../../context/LanguageContext';
import useSWR from 'swr';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, CreditCard, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { PaymentResult } from '@/types/api/PaymentRes';
import { useSession } from 'next-auth/react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function PaymentResultClient() {
  const { t } = useLanguage();
  const params = useSearchParams();
  const tranRef = params.get('tranRef') ?? '';
  const respStatus = params.get('respStatus') ?? '';
  const respMessage = params.get('respMessage') ?? '';
  const cartId = params.get('cartId') ?? '';
  const [copied, setCopied] = useState(false);
  const { update } = useSession();
  const isSuccess = respStatus === 'A' || respStatus === 'success';
  const router = useRouter();

  async function updateSubscription() {
    const res = await fetch('/api/storev2/payment/paytabs/plans/subscriptions/updata-status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tranRef,
        respCode: respStatus,
        respMessage,
        cartId,
      }),
    });

    if (res.ok) {
      update();
    }
  }

  useEffect(() => {
    if (isSuccess && cartId) {
      updateSubscription();
    }
  }, [isSuccess, cartId]);

  const { data: payment, isLoading } = useSWR<PaymentResult>(
    cartId
      ? `/api/storev2/payment/paytabs/plans/subscriptions/get-payment-and-plan/${cartId}`
      : null,
    fetcher
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('تم نسخ الرابط');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f8f9fa] px-4 py-8 transition-colors duration-200 sm:px-6 lg:px-8 dark:bg-[#0a0a0a]"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* Header Status Card */}
        <div className="rounded-xl border border-[#e5e7eb] bg-white p-8 text-center shadow-sm dark:border-[#262626] dark:bg-[#121212]">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[##e5e7eb] bg-[#f9fafb] dark:border-[#262626] dark:bg-[#1a1a1a]">
            {isSuccess ? (
              <CheckCircle2
                className="h-8 w-8 text-green-600 dark:text-green-500"
                strokeWidth={2}
              />
            ) : (
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-500" strokeWidth={2} />
            )}
          </div>

          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isSuccess ? 'تمت عملية الدفع بنجاح' : 'فشلت عملية الدفع'}
          </h1>

          <p className="mb-8 text-[15px] text-gray-500 dark:text-gray-400">
            {respMessage || 'تمت معالجة عملية الدفع الخاص بك'}
          </p>

          <Button
            onClick={() => router.push('/Dashboard')}
            className="h-11 w-full max-w-xs rounded-lg bg-gray-900 px-8 font-medium text-white hover:bg-gray-800 lg:w-max dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            العودة إلى الصفحة الرئيسية
          </Button>
        </div>

        {/* Transaction Details */}
        <div className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#262626] dark:bg-[#121212]">
          <h2 className="mb-6 flex items-center gap-2 text-[17px] font-semibold text-gray-900 dark:text-gray-100">
            <CreditCard className="h-5 w-5 text-gray-500 dark:text-gray-400" strokeWidth={2} />
            تفاصيل المعاملة
          </h2>

          <div className="space-y-4">
            <div className="flex flex-col gap-2 border-b border-gray-100 pb-3 sm:flex-row sm:justify-between sm:gap-0 dark:border-[#262626]">
              <span className="text-[14px] text-gray-500 dark:text-gray-400">رقم المعاملة</span>
              <span className="font-mono text-[14px] font-medium break-all text-gray-900 dark:text-gray-200">
                {tranRef || t.inventory.unavailable}
              </span>
            </div>

            <div className="flex justify-between border-b border-gray-100 pb-3 dark:border-[#262626]">
              <span className="text-[14px] text-gray-500 dark:text-gray-400">الحالة</span>
              <span className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-gray-200">
                {isSuccess ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" strokeWidth={2.5} />
                    <span className="text-[14px]">مكتملة</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" strokeWidth={2.5} />
                    <span className="text-[14px]">مرفوضة</span>
                  </>
                )}
              </span>
            </div>

            <div className="flex flex-col gap-2 border-b border-gray-100 pb-3 sm:flex-row sm:justify-between sm:gap-0 dark:border-[#262626]">
              <span className="text-[14px] text-gray-500 dark:text-gray-400">معرف السلة</span>
              <span className="font-mono text-[14px] font-medium break-all text-gray-900 dark:text-gray-200">
                {cartId || t.inventory.unavailable}
              </span>
            </div>

            {!isLoading && payment && (
              <>
                <div className="flex flex-col gap-2 border-b border-gray-100 pb-3 sm:flex-row sm:justify-between sm:gap-0 dark:border-[#262626]">
                  <span className="text-[14px] text-gray-500 dark:text-gray-400">معرف الدفع</span>
                  <span className="font-mono text-[14px] font-medium break-all text-gray-900 dark:text-gray-200">
                    {payment?.payment?.id}
                  </span>
                </div>
                <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:justify-between sm:gap-0">
                  <span className="text-[14px] text-gray-500 dark:text-gray-400">مبلغ الدفع</span>
                  <span className="text-[15px] font-bold text-gray-900 dark:text-gray-100">
                    {payment?.payment?.amount}{' '}
                    <span className="text-[13px] font-normal text-gray-500 dark:text-gray-400">
                      IQD
                    </span>
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Subscription & Plan Details */}
        {!isLoading && payment && (
          <div className="space-y-6">
            <div className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#262626] dark:bg-[#121212]">
              <h2 className="mb-5 flex items-center gap-2 text-[17px] font-semibold text-gray-900 dark:text-gray-100">
                <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" strokeWidth={2} />
                بيانات الاشتراك
              </h2>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col">
                  <span className="mb-1 text-[13px] text-gray-500 dark:text-gray-400">
                    تاريخ البداية
                  </span>
                  <span className="font-mono text-[14px] font-medium text-gray-900 dark:text-gray-200">
                    {new Date(payment?.userSubscription?.startDate).toLocaleDateString('ar')}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="mb-1 text-[13px] text-gray-500 dark:text-gray-400">
                    {t.plans.endDate}
                  </span>
                  <span className="font-mono text-[14px] font-medium text-gray-900 dark:text-gray-200">
                    {new Date(payment?.userSubscription?.endDate).toLocaleDateString('ar')}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="mb-1 text-[13px] text-gray-500 dark:text-gray-400">الحالة</span>
                  <span
                    className={`inline-flex w-max items-center gap-1.5 rounded px-2.5 py-0.5 text-[13px] font-medium ${
                      payment?.userSubscription?.isActive
                        ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                        : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                    }`}
                  >
                    {payment?.userSubscription?.isActive ? t.plans.active : 'غير نشط'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="mb-1 text-[13px] text-gray-500 dark:text-gray-400">
                    حد المنتجات
                  </span>
                  <span className="text-[14px] font-medium text-gray-900 dark:text-gray-200">
                    {payment?.userSubscription?.limitProducts ??
                      payment?.userSubscription?.plan?.maxProducts ??
                      '∞'}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#262626] dark:bg-[#121212]">
              <div className="mb-5 flex flex-col justify-between gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center dark:border-[#262626]">
                <h2 className="text-[17px] font-semibold text-gray-900 dark:text-gray-100">
                  تفاصيل الخطة المرجعية
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold text-gray-900 dark:text-gray-100">
                    {payment?.userSubscription?.plan?.name}
                  </span>
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-[12px] font-medium text-gray-700 dark:bg-[#262626] dark:text-gray-300">
                    {payment?.userSubscription?.plan?.type}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="flex flex-col">
                  <span className="text-[13px] text-gray-500 dark:text-gray-400">المتاجر</span>
                  <span className="mt-1 text-[14px] font-medium text-gray-900 dark:text-gray-200">
                    {payment?.userSubscription?.plan?.maxStores}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] text-gray-500 dark:text-gray-400">الموردين</span>
                  <span className="mt-1 text-[14px] font-medium text-gray-900 dark:text-gray-200">
                    {payment?.userSubscription?.plan?.maxSuppliers}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] text-gray-500 dark:text-gray-400">القوالب</span>
                  <span className="mt-1 text-[14px] font-medium text-gray-900 dark:text-gray-200">
                    {payment?.userSubscription?.plan?.maxTemplates}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] text-gray-500 dark:text-gray-400">المدة</span>
                  <span className="mt-1 text-[14px] font-medium text-gray-900 dark:text-gray-200">
                    {payment?.userSubscription?.plan?.durationDays} يوم
                  </span>
                </div>
              </div>

              {payment?.userSubscription?.plan?.features?.length > 0 && (
                <div className="mt-6 border-t border-gray-100 pt-5 dark:border-[#262626]">
                  <span className="mb-3 block text-[14px] font-medium text-gray-700 dark:text-gray-300">
                    الميزات الأساسية
                  </span>
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {payment.userSubscription.plan.features.map((feature: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-[14px] text-gray-600 dark:text-gray-400"
                      >
                        <CheckCircle2 className="mt-[2px] h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-gray-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
