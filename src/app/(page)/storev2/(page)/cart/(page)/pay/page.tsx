'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/app/lib/context/CartContext';
import { useProducts } from '@/app/(page)/storev2/Data/context/products/ProductsContext';

type PaylibResponse = {
  payment_token?: string;
  error?: boolean;
  message?: string;
};

type Paylib = {
  inlineForm: (options: {
    key: string;
    form: HTMLFormElement;
    autoSubmit: boolean;
    callback: (response: PaylibResponse) => void;
  }) => void;
  handleError: (element: HTMLElement, response: PaylibResponse) => void;
};

declare global {
  interface Window {
    paylib?: Paylib;
  }
}

export default function CheckoutPage() {
  const { store } = useProducts();
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string | null>('false');
  const [paylibLoaded, setPaylibLoaded] = useState(false);

  const name = searchParams.get('name');
  const phone = searchParams.get('phone');
  const address = searchParams.get('address');

  const { getAllShippingPricesByKey, getTotalPriceByKey, getTotalPriceAfterDiscountByKey } =
    useCart();
  const cartKey = `cart/${store?.id}`;
  const subtotal = getTotalPriceByKey(cartKey);
  const shippingTotal = getAllShippingPricesByKey(cartKey);
  const discountTotal = getTotalPriceAfterDiscountByKey(cartKey);
  const totalAfter = discountTotal + shippingTotal;

  // تحميل مكتبة paylib.js
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://secure-iraq.paytabs.com/payment/js/paylib.js';
    script.async = true;
    script.onload = () => setPaylibLoaded(true);
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!paylibLoaded) {
      setErrors('مكتبة الدفع غير محمّلة بعد.');
      return;
    }

    const paylib = window.paylib;
    const form = formRef.current;
    if (!paylib || !form) return;

    setLoading(true);
    setErrors(null);

    paylib.inlineForm({
      key: 'C6K2B9-V9GB6N-2RNVHV-M6P2TT',
      form,
      autoSubmit: true,
      callback: async (response: PaylibResponse) => {
        const errorContainer = document.getElementById('paymentErrors');
        if (!errorContainer) return;

        errorContainer.innerHTML = '';

        if (response.error) {
          paylib.handleError(errorContainer, response);
          setLoading(false);
          return;
        }

        const token = response.payment_token;
        if (!token) {
          setErrors('لم يتم إنشاء التوكن.');
          setLoading(false);
          return;
        }

        try {
          const res = await fetch('/api/storev2/payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              payment_token: token,
              amount: totalAfter,
              cart_id: `order_${Date.now()}`,
              description: 'طلب من التطبيق',
            }),
          });

          const data: { success?: boolean; message?: string } = await res.json();

          if (res.ok && data.success) {
            alert('تمت العملية بنجاح');
            router.push('/success');
          } else {
            setErrors('فشل الدفع: ' + (data.message || JSON.stringify(data)));
          }
        } catch (err) {
          if (err instanceof Error) setErrors('خطأ عند الاتصال بالخادم: ' + err.message);
          else setErrors('خطأ غير معروف عند الاتصال بالخادم');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-3">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-4 shadow-sm" dir="rtl">
        <div className="mb-8 flex items-center justify-between gap-2 border-b pb-4">
          <h1 className="font-semibold text-gray-800">إتمام الدفع</h1>
          <ShoppingBag className="h-5 w-5 text-gray-800" />
        </div>

        <div className="space-y-2 rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>الزبون</span>
            <span>{name}</span>
          </div>
          <div className="flex justify-between">
            <span>رقم الهاتف</span>
            <span>{phone}</span>
          </div>
          <div className="flex justify-between">
            <span>الموقع</span>
            <span>{address}</span>
          </div>
          <div className="flex justify-between">
            <span>المجموع الفرعي</span>
            <span>د.ع {subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>التوصيل</span>
            <span>د.ع {shippingTotal}</span>
          </div>
          <div className="flex justify-between border-t pt-2 font-semibold text-green-700">
            <span>الإجمالي بعد الخصم</span>
            <span>د.ع {totalAfter}</span>
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} id="payform" className="mt-8 space-y-3">
          <h2 className="text-center text-lg font-semibold text-gray-800">بيانات البطاقة</h2>
          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm text-gray-700">اسم صاحب البطاقة</label>
              <input
                type="text"
                name="cardHolder"
                placeholder="الاسم الكامل"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-700">رقم البطاقة</label>
              <input
                data-paylib="number"
                type="text"
                size={20}
                placeholder="1234 5678 9012 3456"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-sm text-gray-700">الشهر</label>
                <input
                  data-paylib="expmonth"
                  type="text"
                  size={2}
                  placeholder="MM"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-700">السنة</label>
                <input
                  data-paylib="expyear"
                  type="text"
                  size={4}
                  placeholder="YYYY"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-700">CVV</label>
                <input
                  data-paylib="cvv"
                  type="text"
                  size={4}
                  placeholder="123"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
            </div>
          </div>

          <span id="paymentErrors" className="mt-2 text-sm text-red-600"></span>
          {errors && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{errors}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-5 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'جاري المعالجة...' : 'تأكيد الدفع'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            className="w-full rounded-lg border px-5 py-3 font-semibold hover:opacity-90 disabled:opacity-50"
          >
            الرجوع الى السلة
          </button>
        </form>
      </div>
    </div>
  );
}
