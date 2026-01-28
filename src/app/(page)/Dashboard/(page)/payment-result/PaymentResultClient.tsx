'use client';

import useSWR from 'swr';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LuCopy } from 'react-icons/lu';
import { CiShare1 } from 'react-icons/ci';
import { toast } from 'sonner';
import type { PaymentResult } from '@/types/api/PaymentRes';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PaymentPDF } from '../../_utils/PaymentPDFProps';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function PaymentResultClient() {
  const params = useSearchParams();
  const tranRef = params.get('tranRef') ?? '';
  const respStatus = params.get('respStatus') ?? '';
  const respMessage = params.get('respMessage') ?? '';
  const cartId = params.get('cartId') ?? '';
  const [copied, setCopied] = useState(false);

  const isSuccess = respStatus === 'A' || respStatus === 'success';

  async function updateSubscription() {
    await fetch('/api/storev2/payment/paytabs/plans/subscriptions/update-status', {
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
  const {
    data: payment,
    error,
    isLoading,
  } = useSWR<PaymentResult>(
    cartId
      ? `/api/storev2/payment/paytabs/plans/subscriptions/get-payment-and-plan/${cartId}`
      : null,
    fetcher
  );

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
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-[#f8f8f8] to-white py-4">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-[16px] border border-[#e5e5e5] bg-white p-8 text-center shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#e5e5e5] bg-white">
            {isSuccess ? (
              <CheckCircle2 className="h-9 w-9 text-[#111]" strokeWidth={2} />
            ) : (
              <XCircle className="h-9 w-9 text-[#111]" strokeWidth={2} />
            )}
          </div>

          <h1 className="mb-3 text-[22px] leading-tight font-bold text-[#111]">
            {isSuccess ? 'تمت عملية الدفع بنجاح' : 'فشلت عملية الدفع'}
          </h1>

          <p className="text-[15px] leading-relaxed text-[#444]">
            {respMessage || 'تمت معالجة عملية الدفع'}
          </p>

          <div className="flex flex-col items-center justify-center gap-3 pt-8 sm:flex-row sm:gap-4">
            <Button
              onClick={handleShare}
              variant="outline"
              className="w-full rounded-[10px] border-[#111] bg-transparent px-6 py-2.5 font-semibold text-[#111] hover:bg-[#f5f5f5] sm:w-auto"
            >
              <span>شارك الطلب</span> <CiShare1 className="mr-2" />
            </Button>

            <Button
              onClick={handleCopy}
              className="w-full rounded-[10px] bg-[#111] px-6 py-2.5 font-semibold text-white hover:bg-[#222] sm:w-auto"
            >
              <span>نسخ</span> <LuCopy className="mr-2" />
            </Button>
            {!isLoading && payment && (
              <div className="">
                <PDFDownloadLink
                  document={<PaymentPDF payment={payment!} />}
                  fileName={`payment-${payment.payment.tranRef}.pdf`}
                >
                  {({ loading }) => (
                    <Button className="cursor-pointer rounded-lg bg-sky-600 text-white hover:bg-blue-700">
                      {loading ? 'جارٍ التحضير...' : 'تحميل PDF'}
                    </Button>
                  )}
                </PDFDownloadLink>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[16px] border border-[#e5e5e5] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <h2 className="mb-6 flex items-center gap-2 text-[18px] font-semibold text-[#111]">
            <CreditCard className="h-5 w-5 text-[#333]" strokeWidth={2} />
            تفاصيل المعاملة
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between border-b border-[#e6e6e6] pb-3">
              <span className="text-[14px] text-[#555]">رقم المعاملة</span>
              <span className="font-mono text-[15px] font-medium text-[#111]">
                {tranRef || 'غير متوفر'}
              </span>
            </div>

            <div className="flex justify-between border-b border-[#e6e6e6] pb-3">
              <span className="text-[14px] text-[#555]">الحالة</span>
              <span className="flex items-center gap-2 font-semibold text-[#111]">
                {isSuccess ? (
                  <>
                    <span>نجحت</span>
                    <CheckCircle2 className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>فشلت</span>
                    <XCircle className="h-4 w-4" />
                  </>
                )}
              </span>
            </div>

            <div className="flex justify-between pt-1">
              <span className="text-[14px] text-[#555]">معرف السلة</span>
              <span className="font-mono text-[15px] font-medium text-[#111]">
                {cartId || 'غير متوفر'}
              </span>
            </div>
          </div>
        </div>

        <>
          {!isLoading && payment && (
            <div className="rounded-[16px] border border-[#e5e5e5] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
              <h2 className="mb-6 text-[18px] font-semibold text-[#111]">بيانات الدفع</h2>

              <div className="space-y-4">
                <div className="border-b border-[#e6e6e6] pb-3">
                  <span className="block text-[14px] text-[#555]">معرف الدفع</span>
                  <div className="mt-1 font-mono text-[15px] font-medium text-[#111]">
                    {payment.payment.id}
                  </div>
                </div>

                <div className="border-b border-[#e6e6e6] pb-3">
                  <span className="block text-[14px] text-[#555]">رقم العملية (tranRef)</span>
                  <div className="mt-1 font-mono text-[15px] font-medium text-[#111]">
                    {payment.payment.tranRef}
                  </div>
                </div>

                <div className="border-b border-[#e6e6e6] pb-3">
                  <span className="block text-[14px] text-[#555]">المبلغ</span>
                  <div className="mt-1 text-[16px] font-semibold text-[#111]">
                    {payment.payment.amount} IQD
                  </div>
                </div>

                <div className="border-b border-[#e6e6e6] pb-3">
                  <span className="block text-[14px] text-[#555]">رسالة النظام</span>
                  <div className="mt-1 text-[15px] leading-relaxed font-medium text-[#111]">
                    {payment.payment.respMessage}
                  </div>
                </div>
              </div>
            </div>
          )}
          {!isLoading && payment && (
            <div className="space-y-6">
              <div className="rounded-[16px] border border-[#e5e5e5] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                <h2 className="mb-4 text-[18px] font-semibold text-[#111]">بيانات الاشتراك</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col">
                    <span className="text-[14px] text-[#555]">تاريخ البداية</span>
                    <span className="mt-1 font-mono text-[15px] font-medium text-[#111]">
                      {new Date(payment.userSubscription.startDate).toLocaleDateString('ar')}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[14px] text-[#555]">تاريخ الانتهاء</span>
                    <span className="mt-1 font-mono text-[15px] font-medium text-[#111]">
                      {new Date(payment.userSubscription.endDate).toLocaleDateString('ar')}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[14px] text-[#555]">حالة الاشتراك</span>
                    <span className="mt-1 flex items-center gap-2 text-[15px] font-semibold text-[#111]">
                      {payment.userSubscription.isActive ? (
                        <>
                          <span>نشط</span>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </>
                      ) : (
                        <>
                          <span>غير نشط</span>
                          <XCircle className="h-4 w-4 text-red-500" />
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[14px] text-[#555]">حد المنتجات</span>
                    <span className="mt-1 font-semibold text-[#111]">
                      {payment.userSubscription.limitProducts}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-[16px] border border-[#e5e5e5] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                <h2 className="mb-4 text-[18px] font-semibold text-[#111]">تفاصيل الخطة</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col">
                    <span className="text-[14px] text-[#555]">اسم الخطة</span>
                    <span className="mt-1 font-medium text-[#111]">
                      {payment.userSubscription.plan.name}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[14px] text-[#555]">نوع الخطة</span>
                    <span className="mt-1 font-medium text-[#111]">
                      {payment.userSubscription.plan.type}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[14px] text-[#555]">السعر</span>
                    <span className="mt-1 font-medium text-[#111]">
                      {payment.userSubscription.plan.price} IQD
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[14px] text-[#555]">مدة الخطة (أيام)</span>
                    <span className="mt-1 font-medium text-[#111]">
                      {payment.userSubscription.plan.durationDays}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[14px] text-[#555]">عدد المتاجر</span>
                    <span className="mt-1 font-medium text-[#111]">
                      {payment.userSubscription.plan.maxStores}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[14px] text-[#555]">عدد الموردين</span>
                    <span className="mt-1 font-medium text-[#111]">
                      {payment.userSubscription.plan.maxSuppliers}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[14px] text-[#555]">عدد القوالب المسموح بها</span>
                    <span className="mt-1 font-medium text-[#111]">
                      {payment.userSubscription.plan.maxTemplates}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[14px] text-[#555]">فئة القالب</span>
                    <span className="mt-1 font-medium text-[#111]">
                      {payment.userSubscription.plan.templateCategory}
                    </span>
                  </div>

                  <div className="col-span-1 mt-2 sm:col-span-2">
                    <span className="mb-1 block text-[14px] text-[#555]">الميزات</span>
                    <ul className="list-disc space-y-1 pl-5 text-[15px] text-[#111]">
                      {payment.userSubscription.plan.features?.length ? (
                        <ul className="list-disc space-y-1 pl-5 text-[15px] text-[#111]">
                          {payment.userSubscription.plan.features.map((feature, idx) => (
                            <li key={idx}>{feature}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[14px] text-gray-500">لا توجد ميزات متاحة</p>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  );
}
