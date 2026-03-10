import { Suspense } from 'react';
import PaymentResultClient from './PaymentResultClient/PaymentResultClient';
 
export default function PaymentResultPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PaymentResultClient />
    </Suspense>
  );
}
