'use client';
import { useRef, useState } from 'react';
import Script from 'next/script';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/app/lib/context/CartContext';
import { useProducts } from '@/app/(page)/storev2/Data/context/products/ProductsContext';
import { toast } from 'sonner';

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
  const [errors, setErrors] = useState<string | null>(null);

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

  const handlePayment = () => {
    const paylib = window.paylib;
    const form = formRef.current;
    if (!paylib || !form) {
      setErrors('مكتبة الدفع غير جاهزة أو الفورم غير موجود');
      return;
    }

    setErrors(null); // إعادة تعيين أي خطأ سابق

    paylib.inlineForm({
      key: 'C7K2B9-V9276N-M2VQP2-NN6BKM', // Client Key
      form,
      autoSubmit: false, // مهم جداً، لن يرسل الفورم مباشرة
      callback: (response: PaylibResponse) => {
        const errorContainer = document.getElementById('paymentErrors');
        if (!errorContainer) return;
        errorContainer.innerHTML = '';

        if (response.error) {
          paylib.handleError(errorContainer, response);
          return;
        }

        if (!response.payment_token) {
          setErrors('لم يتم إنشاء رمز الدفع (token)');
          return;
        }

        // إدراج التوكن في الحقل المخفي
        const tokenInput = form.querySelector<HTMLInputElement>('input[name="payment_token"]');
        if (tokenInput) tokenInput.value = response.payment_token;

        // إرسال الفورم بعد توليد التوكن
        form.submit();
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-3">
      <Script
        src="https://secure-iraq.paytabs.com/payment/js/paylib.js"
        strategy="afterInteractive"
        onError={() => toast.error('فشل تحميل مكتبة Paylib')}
      />

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
            <span>الهاتف</span>
            <span>{phone}</span>
          </div>
          <div className="flex justify-between">
            <span>العنوان</span>
            <span>{address}</span>
          </div>
          <div className="flex justify-between">
            <span>المجموع الفرعي</span>
            <span>{subtotal} د.ع</span>
          </div>
          <div className="flex justify-between">
            <span>التوصيل</span>
            <span>{shippingTotal} د.ع</span>
          </div>
          <div className="flex justify-between border-t pt-2 font-semibold text-green-700">
            <span>الإجمالي بعد الخصم</span>
            <span>{totalAfter} د.ع</span>
          </div>
        </div>

        <form ref={formRef} id="payform" method="post" action="/api/storev2/payment">
          <h2 className="text-center text-lg font-semibold text-gray-800">بيانات البطاقة</h2>

          <div className="grid gap-4">
            <input type="hidden" name="payment_token" />

            <div>
              <label className="mb-1 block text-sm text-gray-700">رقم البطاقة</label>
              <input
                data-paylib="number"
                type="text"
                size={20}
                required
                className="w-full rounded-lg border px-4 py-2.5 text-sm"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-sm text-gray-700">الشهر</label>
                <input
                  data-paylib="expmonth"
                  type="text"
                  size={2}
                  required
                  className="w-full rounded-lg border px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-700">السنة</label>
                <input
                  data-paylib="expyear"
                  type="text"
                  size={4}
                  required
                  className="w-full rounded-lg border px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-700">CVV</label>
                <input
                  data-paylib="cvv"
                  type="text"
                  size={4}
                  required
                  className="w-full rounded-lg border px-4 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>

          <span id="paymentErrors" className="mt-2 text-sm text-red-600"></span>
          {errors && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{errors}</div>}

          <button
            type="button"
            onClick={handlePayment}
            className="w-full rounded-lg bg-black px-5 py-3 font-semibold text-white hover:opacity-90"
          >
            تأكيد الدفع
          </button>
        </form>
      </div>
    </div>
  );
}
