'use client';

import { Suspense } from 'react';
import CheckoutPage from './_utils/CheckoutPage';

export default function PayPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-600">جاري تحميل الصفحة...</div>}>
      <CheckoutPage />
    </Suspense>
  );
}
