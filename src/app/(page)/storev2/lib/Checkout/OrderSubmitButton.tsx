'use client';

import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { Product } from '@/types/Products';
import { toast } from 'sonner';
import { useCart } from '@/app/lib/context/CartContext';
import { TbTruckDelivery } from 'react-icons/tb';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface OrderSubmitButtonProps {
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

export default function OrderSubmitButton({
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
  buttonText = 'الدفع عند الاستلام',
  onSuccess,
}: OrderSubmitButtonProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { clearCartByKey } = useCart();

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
        onClick={handleSubmit}
        className={`w-full rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all duration-500 ${
          loading
            ? 'cursor-not-allowed border-gray-300 bg-gray-100 text-gray-500'
            : 'cursor-pointer border-gray-800 bg-white text-gray-900 hover:bg-gray-800 hover:text-white'
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
            {buttonText} <TbTruckDelivery className="text-lg" />
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
