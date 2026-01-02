'use client';

import { useState } from 'react';
import { Product } from '@/types/Products';
import { toast } from 'sonner';
import { useCart } from '@/app/lib/context/CartContext';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface OrderSubmitButtonPaymentProps {
  storeId: string;
  fullName: string;
  phone: string;
  email?: string;
  location: string;
  items: Product[];
  userId: string;
  total: number;
  buttonText?: string;
  selectedColor?: string;
  selectedSize?: string;
  onSuccess?: () => void;
}

export default function OrderSubmitButtonPaymentTheme2({
  storeId,
  fullName,
  phone,
  selectedColor,
  selectedSize,
  email,
  location,
  userId,
  items,
  total,
  buttonText = 'تأكيد الدفع',
  onSuccess,
}: OrderSubmitButtonPaymentProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { clearCartByKey, saveCartId } = useCart();
  const cartKey = `cart/${storeId}`;

  const handlePay = async () => {
    try {
      setLoading(true);
      toast.loading('جاري إنشاء عملية الدفع...');
      const cart_id = uuidv4();
      saveCartId(cart_id, cartKey);
      const res = await fetch('/api/storev2/payment/paytabs/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          phone: phone,
          address: location,
          amount: total,
          cart_id: `${cart_id}`,
          description: `طلب جديد من ${name}`,
          storeId,
          userId,
          fullName,
          selectedColor,
          selectedSize,
          email,
          location,
          total,
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            size: selectedSize,
            color: selectedColor,
          })),
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
  const handleSubmit = async () => {
    if (!fullName || !phone || !location) {
      setMessage('الرجاء ملء جميع الحقول المطلوبة.');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId,
          userId,
          fullName,
          phone,
          selectedColor,
          selectedSize,
          email,
          location,
          total,
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            size: selectedSize,
            color: selectedColor,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`فشل: ${data.error || 'حدث خطأ غير معروف'}`);
        console.error('تفاصيل الخطأ:', data.details);
      } else {
        setMessage('تم إرسال الطلب بنجاح!');
        clearCartByKey(`cart/${storeId}`);
        toast.success('تم إرسال الطلب بنجاح');
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('خطأ في الاتصال بالسيرفر:', error);
      setMessage('فشل الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <motion.button
        whileTap={{ scale: 0.97 }}
        disabled={loading}
        onClick={handlePay}
        className={`w-full rounded-none border-2 px-4 py-2 text-sm font-semibold transition-all duration-500 ${
          loading
            ? 'cursor-not-allowed border-gray-300 bg-gray-100 text-gray-500'
            : 'cursor-pointer bg-black text-white'
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-gray-700" />
            <span>جاري إرسال الطلب</span>
          </div>
        ) : (
          <motion.div
            className="flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {buttonText} <IoCheckmarkCircleOutline className="text-lg" />
          </motion.div>
        )}
      </motion.button>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-3 text-center text-sm ${
            message.includes('فشل') ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {message}
        </motion.div>
      )}
    </div>
  );
}
