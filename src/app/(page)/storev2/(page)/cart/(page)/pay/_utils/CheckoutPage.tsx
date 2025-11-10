'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/app/lib/context/CartContext';
import { useProducts } from '@/app/(page)/storev2/Data/context/products/ProductsContext';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { store } = useProducts();
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [loading, setLoading] = useState(false);
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

  const handlePay = async () => {
    try {
      setLoading(true);
      toast.loading('جاري إنشاء عملية الدفع...');

      const res = await fetch('/api/storev2/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          phone: phone,
          address: address,
          amount: totalAfter,
          cart_id: `order-${Date.now()}`,
          description: `new Order from : ${name} - ${Date.now()}`,
        }),
      });

      const data = await res.json();
      toast.dismiss();

      if (!data.success) {
        toast.error(data.message || 'فشل إنشاء عملية الدفع');
        return;
      }

      window.location.href = data.redirect_url;
    } catch (err) {
      toast.dismiss();
      toast.error('حدث خطأ أثناء إرسال الطلب');
      console.error(err);
    } finally {
      setLoading(false);
    }
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
        <button
          disabled={loading}
          onClick={handlePay}
          className="mt-6 w-full rounded-lg bg-black py-3 text-white hover:opacity-90"
        >
          {loading ? 'جاري المعالجة...' : 'تأكيد الدفع'}
        </button>
      </div>
    </div>
  );
}
