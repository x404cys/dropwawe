'use client';
import { Order } from '@/types/Products';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PaymentResultClient() {
  const params = useSearchParams();
  const tranRef = params.get('tranRef');
  const respStatus = params.get('respStatus');
  const respMessage = params.get('respMessage');
  const cartId = params.get('cartId');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cartId) return;

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/storev2/payment/order/get-payment/${cartId}`);
        if (!res.ok) throw new Error('Failed to fetch order');
        const data: Order = await res.json();
        setOrder(data);
      } catch (err) {
        setError(`${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [cartId]);

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Payment Result</h1>

      <div className="space-y-2">
        <p>
          <span className="font-semibold">Transaction:</span> {tranRef}
        </p>
        <p>
          <span className="font-semibold">Status:</span> {respStatus}
        </p>
        <p>
          <span className="font-semibold">Message:</span> {respMessage}
        </p>
        <p>
          <span className="font-semibold">Cart ID:</span> {cartId}
        </p>
      </div>

      <div className="mt-6">
        {loading && <p>Loading order details...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {order && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Order Details</h2>
            <p>Full Name: {order.fullName}</p>
            <p>Phone: {order.phone}</p>
            <p>Location: {order.location}</p>
            <p>Total: {order.total}</p>
            <div>
              <h3 className="font-semibold">Items:</h3>
              <ul className="ml-5 list-disc">
                {order?.items && Array.isArray(order.items) ? (
                  order.items.map(item => (
                    <div key={item.id}>
                      {item.productId} - Qty: {item.quantity} - Price: {item.price} - Size:{' '}
                      {item.size} - Color: {item.color}
                    </div>
                  ))
                ) : (
                  <p>No items found.</p>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
