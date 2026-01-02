'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { IoCloseOutline } from 'react-icons/io5';
import { useCart } from '@/app/lib/context/CartContext';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/Products';
import { PiBagLight } from 'react-icons/pi';

interface Props {
  open: boolean;
  onClose: () => void;
  cartKey: string;
}

export default function CartPreviewDialog({ open, onClose, cartKey }: Props) {
  const { getCartByKey, removeFromCartByKey, getTotalPriceAfterDiscountByKey } = useCart();

  const router = useRouter();
  const items = getCartByKey(cartKey);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            dir="rtl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            onClick={e => e.stopPropagation()}
            className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold">سلة التسوق ({items.length})</h2>
                <PiBagLight />
              </div>{' '}
              <button onClick={onClose}>
                <IoCloseOutline size={22} />
              </button>
            </div>

            <div className="max-h-[calc(100vh-140px)] overflow-y-auto">
              {items.length > 0 ? (
                <ul className="divide-y">
                  {items.map((item: Product) => (
                    <li key={item.id} className="flex gap-3 px-4 py-3">
                      <Image
                        src={item.image || '/placeholder.png'}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded object-cover"
                      />

                      <div className="flex flex-1 flex-col">
                        <span className="text-sm font-semibold">{item.name}</span>

                        <span className="text-xs text-gray-500">الكمية: {item.quantity}</span>

                        <span className="text-xs font-medium">{formatIQD(item.price)} د.ع</span>
                      </div>

                      <button
                        onClick={() => removeFromCartByKey(item.id, cartKey)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <IoCloseOutline size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-10 text-center text-sm text-gray-500">السلة فارغة</div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t p-4">
                <div className="mb-3 flex items-center justify-between text-sm font-semibold">
                  <span>المجموع</span>
                  <span>{formatIQD(getTotalPriceAfterDiscountByKey(cartKey))} د.ع</span>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    router.push(`/storev2/cart-2/checkout`);
                  }}
                  className="w-full bg-black py-2 text-sm font-medium text-white hover:bg-gray-900"
                >
                  الذهاب إلى السلة
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
