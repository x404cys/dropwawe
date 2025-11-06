'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function OfferCard() {
  const [visible, setVisible] = useState(true);

  /*   useEffect(() => {
    const isBannerClosed = localStorage.getItem('offerBannerClosed');
    if (isBannerClosed === 'true') {
      setVisible(false);
    }
  }, []); */

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem('offerBannerClosed', 'true');
  };

  if (!visible) return null;

  return (
    <section className="relative mx-auto rounded-xl border bg-white px-6 py-6 mt-2">
      <button
        onClick={handleClose}
        className="absolute top-3 left-3 cursor-pointer rounded-full bg-black p-2 text-white hover:bg-gray-800"
        aria-label="إغلاق العرض"
      >
        <X size={16} />
      </button>

      <div className="flex flex-col items-start gap-4 text-right">
        <h2 className="text-2xl text-gray-900">عرض خاص لفترة محدودة</h2>
        <p className="text-sm leading-relaxed text-gray-700">
          احصل على خصم يصل إلى <span className="font-semibold text-black">30%</span> على مجموعة
          مختارة من العطور الفاخرة. العرض متاح لفترة محدودة، لا تفوّت الفرصة!
        </p>
        <Button className="rounded-md bg-black px-5 py-2 text-white hover:bg-gray-800">
          تسوق الآن
        </Button>
      </div>
    </section>
  );
}
