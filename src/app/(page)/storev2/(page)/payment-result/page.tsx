'use client';

import { useCart } from '@/app/lib/context/CartContext';
import { useEffect, useState } from 'react';
import { useProducts } from '../../Data/context/products/ProductsContext';

type PaymentOrder = {
  id: string;
  orderId: string;
  cartId: string;
  tranRef?: string;
  amount: number;
  currency: string;
  status: string;
  respCode?: string;
  respMessage?: string;
  customerEmail?: string;
  createdAt: string;
};

export default function PaymentDetailsPage() {
  const [payment, setPayment] = useState<PaymentOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const {
    getCartByKey,
    addToCartByKey,
    removeFromCartByKey,
    getAllShippingPricesByKey,
    decreaseQuantityByKey,
    clearCartByKey,
    getTotalPriceByKey,
    getTotalQuantityByKey,
    getTotalPriceAfterDiscountByKey,
    saveCartId,
    getCartIdByKey,
  } = useCart();
  const { store } = useProducts();

  const cartKey = `cartId_cart/${store?.id}`;

  useEffect(() => {
    const cartId = getCartIdByKey(`${cartKey}`);
    if (!cartId) {
      setError('رقم الطلب غير موجود');
      setLoading(false);
      return;
    }

    fetch(`/api/storev2/payment/get-payment?cartId=${cartId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error(data.message);
        setPayment(data.payment);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="mt-10 text-center">جاري تحميل بيانات الدفع...</p>;
  if (error) return <p className="mt-10 text-center text-red-600">{error}</p>;

  return (
    <div className="mx-auto mt-10 max-w-3xl rounded bg-gray-50 p-6 shadow">
      <h1 className="mb-4 text-2xl font-bold">تفاصيل عملية الدفع</h1>

      <div className="mb-2">
        <strong>رقم الطلب:</strong> {payment?.orderId}
      </div>
      <div className="mb-2">
        <strong>Cart ID:</strong> {payment?.cartId}
      </div>
      <div className="mb-2">
        <strong>المبلغ:</strong> {payment?.amount} {payment?.currency}
      </div>
      <div className="mb-2">
        <strong>حالة الدفع:</strong> {payment?.status}
      </div>
      {payment?.tranRef && (
        <div className="mb-2">
          <strong>Transaction Ref:</strong> {payment.tranRef}
        </div>
      )}
      {payment?.respMessage && (
        <div className="mb-2">
          <strong>رسالة الاستجابة:</strong> {payment.respMessage}
        </div>
      )}

      <div className="mt-6">
        <a
          href="/storev2"
          className="rounded bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
        >
          العودة للمتجر
        </a>
      </div>
    </div>
  );
}
