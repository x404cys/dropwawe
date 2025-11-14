'use client';
import { useSearchParams } from 'next/navigation';

export default function PaymentResultClient() {
  const params = useSearchParams();
  const tranRef = params.get('tranRef');
  const respStatus = params.get('respStatus');
  const respMessage = params.get('respMessage');
  const cartId = params.get('cartId');

  return (
    <div>
      <h1>Payment Result</h1>
      <p>Transaction: {tranRef}</p>
      <p>Status: {respStatus}</p>
      <p>Message: {respMessage}</p>
      <p>Cart ID: {cartId}</p>
    </div>
  );
}
