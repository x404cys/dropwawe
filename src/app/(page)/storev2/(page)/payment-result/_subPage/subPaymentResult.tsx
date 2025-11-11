'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PaymentResultContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('respStatus');
  const tranRef = searchParams.get('tranRef');
  const cartId = searchParams.get('cartId');
  const respMessage = searchParams.get('respMessage');
  const amount = searchParams.get('amount');

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isSuccess = status === 'A';
  if (!mounted) return null;

  return (
    //
    <div className="flex min-h-screen items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md space-y-4 rounded-xl border bg-white p-6 shadow-lg">
        <div className="flex justify-center">
          {isSuccess ? (
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          ) : (
            <XCircle className="h-16 w-16 text-red-500" />
          )}
        </div>

        <h1 className="text-center text-2xl font-bold">
          {isSuccess ? 'تم الدفع بنجاح!' : 'فشل الدفع'}
        </h1>

        <p className="text-center text-sm text-gray-600">
          {respMessage || (isSuccess ? 'تمت معالجة الدفع بنجاح' : 'حدث خطأ أثناء الدفع')}
        </p>

        <div className="space-y-2 rounded-lg bg-gray-100 p-4 text-sm">
          <div className="flex justify-between">
            <span>حالة العملية</span>
            <span
              className={isSuccess ? 'font-semibold text-green-600' : 'font-semibold text-red-600'}
            >
              {isSuccess ? 'ناجحة' : 'فاشلة'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>رقم المرجع</span>
            <span className="font-mono">{tranRef || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span>رقم السلة</span>
            <span className="font-mono">{cartId || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span>المبلغ</span>
            <span>{amount || 'N/A'} IQD</span>
          </div>
          <div className="flex justify-between">
            <span>التاريخ</span>
            <span>{new Date().toLocaleDateString('ar-EG')}</span>
          </div>
        </div>

        <div className="space-y-3">
          {isSuccess ? (
            <>
              <Button asChild className="w-full">
                <Link href="/">
                  <Home className="ml-2 h-5 w-5" />
                  العودة للصفحة الرئيسية
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/orders">
                  عرض صفحة الطلب
                  <ArrowRight className="mr-2 h-5 w-5" />
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild className="w-full">
                <Link href="/checkout">
                  إعادة المحاولة
                  <ArrowRight className="mr-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/support">
                  تواصل مع الدعم
                  <Home className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
