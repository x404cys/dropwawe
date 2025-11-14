'use client';

import { useSearchParams } from 'next/navigation';

export default function PaymentResult() {
  const params = useSearchParams();

  const status = params.get('respStatus');
  const message = params.get('respMessage');
  const tranRef = params.get('tranRef');

  return (
    <div className="p-10">
      <h1>Payment Result</h1>
      <p>Status: {status}</p>
      <p>Message: {message}</p>
      <p>Reference: {tranRef}</p>
    </div>
  );
}
