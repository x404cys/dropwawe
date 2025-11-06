'use client';
import { useCart } from '@/app/lib/context/CartContext';
import { Product } from '@/types/Products';
import { FiShoppingBag } from 'react-icons/fi';
import { toast } from 'sonner';

type Props = {
  product: Product;
  qty: number;
  userId: string;
};

export default function AddToCartButton({ product, qty, userId }: Props) {
  const { addToCartWithQtyByKey } = useCart();

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category || '',
      discount: product.discount || 0,
      images: product.images || '',
      hasReturnPolicy: product.hasReturnPolicy,
      shippingType: product.shippingType,
      user: {
        id: product.user?.id,
        shippingPrice: product.user?.shippingPrice,
        storeName: product.user?.storeName,
        storeSlug: product.user?.storeSlug,
      },
    };

    // addToCartWithQtyByKey(cartItem, qty, `cart/${userId}`);
    toast.success(`تمت إضافة ${qty} قطع إلى السلة 🛒`);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black py-3 text-base font-semibold text-white transition hover:bg-gray-900"
    >
      <FiShoppingBag size={20} /> إضافة إلى السلة
    </button>
  );
}
