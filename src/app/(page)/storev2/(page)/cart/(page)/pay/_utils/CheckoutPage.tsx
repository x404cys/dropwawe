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

  const name = searchParams.get('name') || '';
  const phone = searchParams.get('phone') || '';
  const address = searchParams.get('address') || '';

  const { getAllShippingPricesByKey, getTotalPriceByKey, getTotalPriceAfterDiscountByKey } =
    useCart();

  const cartKey = `cart/${store?.id}`;
  const subtotal = getTotalPriceByKey(cartKey);
  const shippingTotal = getAllShippingPricesByKey(cartKey);
  const discountTotal = getTotalPriceAfterDiscountByKey(cartKey);
  const totalAfter = discountTotal + shippingTotal;

  const handlePayment = async () => {
    try {
      const paylib = window.paylib;
      const form = formRef.current;

      if (!paylib) {
        setErrors('Paylib library not loaded yet, please wait or reload the page.');
        return;
      }
      if (!form) {
        setErrors('Payment form not found.');
        return;
      }

      setErrors(null);

      paylib.inlineForm({
        key: 'C7K2B9-V9276N-M2VQP2-NN6BKM',
        form,
        autoSubmit: false,
        callback: async (response: PaylibResponse) => {
          try {
            const errorContainer = document.getElementById('paymentErrors');
            if (errorContainer) errorContainer.innerHTML = '';

            if (response.error) {
              if (errorContainer) errorContainer.innerText = response.message || 'Payment failed';
              setErrors(response.message || 'Failed to generate payment token');
              return;
            }

            if (!response.payment_token) {
              setErrors('Payment token not generated');
              return;
            }

            const tokenInput = form.querySelector<HTMLInputElement>('input[name="payment_token"]');
            if (tokenInput) tokenInput.value = response.payment_token;

            toast.loading('Processing payment...');

            const res = await fetch('/api/storev2/payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                payment_token: response.payment_token,
                amount: totalAfter,
                cart_id: cartKey,
                description: `New order from ${name} (${phone})`,
              }),
            });

            const data = await res.json();
            toast.dismiss();

            if (!res.ok || !data.success) {
              toast.error(data.message || 'Payment processing failed');
              return;
            }

            toast.success('Payment processed successfully');
            router.push('/storev2/success');
          } catch (err) {
            console.error('Callback error:', err);
            toast.dismiss();
            toast.error('Error while processing payment');
          }
        },
      });
    } catch (err) {
      console.error('Payment error:', err);
      setErrors('Unexpected error during payment');
      toast.error('Unexpected error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-3">
      <Script
        src="https://secure-iraq.paytabs.com/payment/js/paylib.js"
        strategy="afterInteractive"
        onError={() => toast.error('Failed to load Paylib library')}
        onLoad={() => console.log('Paylib loaded successfully')}
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

        <form ref={formRef} id="payform" method="POST" className="mt-6 space-y-4">
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

          <span id="paymentErrors" className="mt-2 text-sm text-red-600"></span>
          {errors && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{errors}</div>}

          <button
            type="submit"
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
