'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { FaTrash, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useCart } from '@/app/lib/context/CartContext';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { User, Phone, MapPin, Wallet } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { useParams, useRouter } from 'next/navigation';
import { FiShoppingBag } from 'react-icons/fi';
import { LiaShoppingBagSolid } from 'react-icons/lia';
import { calculateDiscountedPrice, formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { MdOutlinePayments } from 'react-icons/md';
import { toast } from 'sonner';
import { randomUUID } from 'crypto';
import { useProducts } from '@/app/(page)/store/Data/context/products/ProductsContext';
import OrderSubmitButtonTheme2 from '@/app/(page)/store/_utils/OrderSubmitButton';
import OrderSubmitButtonPaymentTheme2 from '@/app/(page)/store/_utils/OrderSubmitButtonPayment';
import { PiContactlessPaymentLight } from 'react-icons/pi';

export default function OrderSubmiTheme2() {
  const {
    getCartByKey,
    addToCartByKey,
    removeFromCartByKey,
    getAllShippingPricesByKey,
    decreaseQuantityByKey,
    clearCartByKey,
    getTotalPriceByKey,
    getTotalQuantityByKey,
    getTotalPriceAfterDiscountByKey,
    saveCartId,
    getCartIdByKey,
  } = useCart();
  const { store } = useProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [locationInput, setLocationInput] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const cartKey = `cart/${store?.id}`;
  const cartItems = getCartByKey(cartKey);
  const ShippingPriceTotal = getAllShippingPricesByKey(cartKey);
  const totalPrice = getTotalPriceByKey(cartKey);
  const totalAfterDiscount = getTotalPriceAfterDiscountByKey(cartKey);
  const total = totalPrice + ShippingPriceTotal;
  const totalAfter = totalAfterDiscount + ShippingPriceTotal;
  const checkQua = getTotalQuantityByKey(cartKey);
  if (checkQua == 0 || checkQua == null) {
    return (
      <div
        dir="rtl"
        id="checkout-section"
        className="flex flex-col items-center justify-center space-y-5 py-30 font-light text-gray-400 select-none"
      >
        <h2 className="mb-3 text-4xl font-extrabold tracking-wide"> السلة فارغة</h2>
        <p className="max-w-sm text-center text-lg">
          لم تضف أي منتج إلى السلة بعد. تصفح المنتجات وأضف ما يعجبك!
        </p>
        <div>
          <LiaShoppingBagSolid size={100} className="text-4xl" />
        </div>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="transitio cursor-pointer bg-gray-950 text-sm text-white"
        >
          متابعة التسوق <FiShoppingBag />
        </Button>
      </div>
    );
  }
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
          address: locationInput,
          amount: totalAfter,
          cart_id: `${cart_id}`,
          description: `طلب جديد من ${name}`,
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
    <section id="checkout-section" dir="rtl">
      <div className="container mx-auto py-8">
        <div className="flex flex-col">
          <div>
            <Card className="space-y-4 rounded-none border border-gray-200 bg-white p-5 font-light">
              <h2 className="text-center text-lg font-semibold text-gray-700">أدخل التفاصيل</h2>

              <div className="space-y-3">
                <div className="relative">
                  <FaUser className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="الاسم الكامل"
                    className="focus:ring-primary rounded-none pl-10 focus:ring-2"
                    onChange={e => setFullName(e.target.value)}
                    value={fullName}
                  />
                </div>

                <div dir="rtl" className="relative flex justify-between">
                  <FaPhone className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                  <Input
                    dir="ltr"
                    inputMode="numeric"
                    placeholder="07 *** ****"
                    className="focus:ring-primary rounded-none pl-12 text-left focus:ring-2"
                    value={phone}
                    maxLength={13}
                    onChange={e => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length > 11) value = value.slice(0, 11);

                      let formatted = value;
                      if (value.length > 4 && value.length <= 7) {
                        formatted = `${value.slice(0, 4)} ${value.slice(4)}`;
                      } else if (value.length > 7) {
                        formatted = `${value.slice(0, 4)} ${value.slice(4, 7)} ${value.slice(7)}`;
                      }

                      setPhone(formatted);
                    }}
                  />
                </div>

                <div className="flex-col space-y-2">
                  <Input
                    placeholder="مثلاً: بغداد - المنصور - 14 رمضان"
                    value={locationInput}
                    onChange={e => setLocationInput(e.target.value)}
                    className="rounded-none"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center space-y-2">
                <OrderSubmitButtonTheme2
                  selectedColor={cartItems.find(item => item.selectedColor)?.selectedColor ?? ''}
                  selectedSize={cartItems.find(item => item.selectedSize)?.selectedSize ?? ''}
                  userId={store?.userId as string}
                  storeId={store?.id as string}
                  fullName={fullName as string}
                  phone={phone}
                  email={email}
                  location={locationInput as string}
                  items={cartItems}
                  total={totalAfter}
                />

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger dir="rtl" asChild>
                    <Button
                      variant="outline"
                      className="flex w-72 cursor-pointer items-center justify-center gap-2 rounded-none border-2 border-gray-950 py-4 text-black duration-300"
                    >
                      <span>الدفع الإلكتروني</span>
                      <MdOutlinePayments className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-md" dir="rtl">
                    <div className="flex justify-center text-neutral-700">
                      <PiContactlessPaymentLight className="h-15 w-15" />
                    </div>
                    <DialogHeader>
                      <div className="space-y-3 text-center">
                        {' '}
                        <div>تأكيد عملية الدفع</div>
                        <div className="text-xs">
                          يرجى التأكد من تفاصيل الطلب قبل المتابعة إلى صفحة الدفع الإلكتروني، سيتم
                          تحويلك إلى صفحة الدفع المقدمة من{' '}
                          <span className="font-semibold text-gray-800">أموال</span>.
                        </div>
                      </div>
                    </DialogHeader>

                    <div className="space-y-3 text-sm text-gray-800">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-600" />
                          <span className="font-medium">الاسم</span>
                        </div>
                        <span className="text-gray-900">{fullName}</span>
                      </div>

                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-600" />
                          <span className="font-medium">الهاتف</span>
                        </div>
                        <span className="text-gray-900">{phone}</span>
                      </div>

                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-600" />
                          <span className="font-medium">العنوان</span>
                        </div>
                        <span className="text-gray-900">{locationInput}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4" />
                          <span className="font-semibold">الإجمالي</span>
                        </div>
                        <span className="font-bold text-red-400">{formatIQD(totalAfter)} د.ع</span>
                      </div>
                    </div>

                    <DialogFooter className="mt-6 flex flex-col flex-wrap-reverse space-y-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        className="w-full rounded-none border-gray-400 text-gray-700 hover:bg-gray-100"
                      >
                        إلغاء
                      </Button>
                      <OrderSubmitButtonPaymentTheme2
                        selectedColor={
                          cartItems.find(item => item.selectedColor)?.selectedColor ?? ''
                        }
                        selectedSize={cartItems.find(item => item.selectedSize)?.selectedSize ?? ''}
                        userId={store?.userId as string}
                        storeId={store?.id as string}
                        fullName={fullName as string}
                        phone={phone}
                        email={email}
                        location={locationInput as string}
                        items={cartItems}
                        total={totalAfter}
                      />
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-72 rounded-none hover:bg-gray-100">
                  متابعة التسوق
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <br />
      <br />
    </section>
  );
}
