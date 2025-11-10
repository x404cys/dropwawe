'use client';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('عبد الرحمن');
  const [phone, setPhone] = useState('07700000000');
  const [address, setAddress] = useState('بغداد - المنصور');
  const [amount, setAmount] = useState(15000);

  const handlePay = async () => {
    try {
      setLoading(true);
      toast.loading('جاري إنشاء عملية الدفع...');

      const res = await fetch('/api/storev2/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          address,
          amount,
          cart_id: `order-${Date.now()}`,
          description: 'طلب جديد من المتجر',
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
    <div className="mx-auto max-w-lg rounded-lg bg-white p-10 shadow" dir="rtl">
      <h1 className="mb-4 text-xl font-bold">الدفع الآمن</h1>

      <div className="space-y-2 text-sm">
        <p>الاسم: {name}</p>
        <p>الهاتف: {phone}</p>
        <p>العنوان: {address}</p>
        <p className="font-semibold text-green-700">الإجمالي: {amount} د.ع</p>
      </div>

      <button
        disabled={loading}
        onClick={handlePay}
        className="mt-6 w-full rounded-lg bg-black py-3 text-white hover:opacity-90"
      >
        {loading ? 'جاري المعالجة...' : 'تأكيد الدفع'}
      </button>
    </div>
  );
}
