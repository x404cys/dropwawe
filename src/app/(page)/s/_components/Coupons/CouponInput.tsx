'use client';

import { useState } from 'react';
import { useCart } from '@/app/lib/context/CartContext';

type Props = {
  cartKey: string;
  storeId: string;
};

export default function CouponInput({ cartKey, storeId }: Props) {
  const { applyCoupon, coupon } = useCart();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;

    try {
      setLoading(true);
      setMessage(null);

      await applyCoupon(code.toUpperCase(), cartKey, storeId);

      setSuccess(true);
      setMessage('تم تطبيق الكوبون بنجاح 🎉');
    } catch (err: any) {
      setSuccess(false);
      setMessage(err.message || 'كود غير صالح');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-xl border bg-white p-4 shadow-sm">
      <label className="mb-2 block text-sm font-medium text-gray-700">كود الخصم</label>

      <div className="flex gap-2">
        <input
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="SAVE10"
          className="focus:ring-primary flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
        />

        <button
          onClick={handleApply}
          disabled={loading}
          className="bg-primary rounded-lg px-4 py-2 text-sm text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? '...' : 'تطبيق'}
        </button>
      </div>

      {message && (
        <p className={`mt-2 text-sm ${success ? 'text-green-600' : 'text-red-500'}`}>{message}</p>
      )}

      {coupon && <p className="mt-1 text-sm text-blue-700">خصم الكوبون: {coupon.discount} د.ع</p>}
    </div>
  );
}
