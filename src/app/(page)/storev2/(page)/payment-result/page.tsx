'use client';
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import PaymentResultContent from './_subPage/subPaymentResult';

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">loading</div>}>
      <PaymentResultContent />
    </Suspense>
  );
}
