'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { FaTrash, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useCart } from '@/app/lib/context/CartContext';
import { useState } from 'react';

import { useParams, useRouter } from 'next/navigation';
import { FiShoppingBag } from 'react-icons/fi';
import { LiaShoppingBagSolid } from 'react-icons/lia';
import { calculateDiscountedPrice } from '@/app/lib/utils/CalculateDiscountedPrice';
import { useProducts } from '../../../Data/context/products/ProductsContext';
import CheckoutButton from '../(page)/pay/page';
import { MdOutlinePayments } from 'react-icons/md';
import OrderSubmitButton from '../../../lib/Checkout/OrderSubmitButton';

export default function CartPage() {
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
  } = useCart();
  const { storeId } = useParams();
  const { store } = useProducts();
  const [locationInput, setLocationInput] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  if (!storeId) {
    return <p>User ID not found in URL</p>;
  }

  const cartKey = `cart/${storeId}`;
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
        className="flex flex-col items-center justify-center space-y-5 py-30 text-gray-400 select-none"
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
  return (
    <section dir="rtl">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-2 md:col-span-2">
            {cartItems.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-lg border bg-white p-4 transition-all"
              >
                <div className="flex flex-col items-center md:items-start">
                  <Image
                    src={item.image as string}
                    alt={item.name as string}
                    width={70}
                    height={70}
                    className="border"
                  />
                </div>

                <div className="flex min-w-[120px] flex-col">
                  <p className="text-sm font-medium text-gray-800">{item.name}</p>
                  <button
                    className="mt-1 flex items-center gap-1 text-xs text-red-500 hover:underline"
                    onClick={() => removeFromCartByKey(item.id, cartKey)}
                  >
                    <FaTrash className="text-[10px]" />
                    <span>إزالة</span>
                  </button>
                </div>

                <div className="flex flex-2 flex-col items-center gap-1">
                  <div className="gap-2 space-y-2 md:flex">
                    <div className="flex items-center gap-2">
                      {item.colors?.map((color, idx) => (
                        <span
                          key={idx}
                          className="h-6 w-6 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      {item.sizes?.map((size, idx) => (
                        <span
                          key={idx}
                          className="rounded border border-gray-300 px-2 py-1 text-xs font-medium"
                        >
                          {size.size}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1 text-xs">
                  <div className="flex items-center overflow-hidden rounded border border-gray-300">
                    <button
                      onClick={() => decreaseQuantityByKey(item.id, cartKey)}
                      className="bg-gray-900 px-1 py-0.5 text-white hover:bg-gray-200 md:px-2 md:py-1"
                    >
                      -
                    </button>
                    <span className="px-3 text-gray-800">{item.quantity}</span>
                    <button
                      onClick={() => addToCartByKey(item, cartKey)}
                      className="bg-gray-900 px-1 py-0.5 text-white hover:bg-gray-200 md:px-2 md:py-1"
                    >
                      +
                    </button>
                  </div>
                  <div>
                    {item.discount && item.discount > 0 ? (
                      <span className="text-base font-semibold text-red-600">
                        د.ع {calculateDiscountedPrice(item.price, item.discount)}
                      </span>
                    ) : (
                      <span className="text-base font-semibold text-gray-800">
                        د.ع {item.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <Card className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-lg">
              <h2 className="text-center text-lg font-semibold text-gray-700">أدخل التفاصيل</h2>

              <div className="space-y-3">
                <div className="relative">
                  <FaUser className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="الاسم الكامل"
                    className="focus:ring-primary rounded-md pl-10 focus:ring-2"
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
                    className="focus:ring-primary rounded-md pl-12 text-left focus:ring-2"
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

                <div className="my-2 border-b border-dashed" />

                <div className="flex-col space-y-2">
                  <h2 className="text-center text-sm font-medium text-gray-600">عنوان التوصيل</h2>
                  <Input
                    placeholder="مثلاً: بغداد - المنصور - 14 رمضان"
                    value={locationInput}
                    onChange={e => setLocationInput(e.target.value)}
                    className="rounded-md"
                  />
                </div>
              </div>

              <div className="space-y-2 border-t pt-4 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>المجموع الفرعي</span>
                  <span>د.ع {totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>التوصيل</span>
                  <span>د.ع {ShippingPriceTotal}</span>
                </div>

                <div className="flex justify-between border-t pt-2 font-bold text-gray-800">
                  <span>الإجمالي</span>
                  <span>د.ع {total}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold text-gray-800">
                  <span>الإجمالي بعد الخصم</span>
                  <span>د.ع {totalAfter}</span>
                </div>
              </div>

              <div className="flex-col space-y-2">
                <OrderSubmitButton
                  selectedColor={cartItems.find(item => item.selectedColor)?.selectedColor ?? ''}
                  selectedSize={cartItems.find(item => item.selectedSize)?.selectedSize ?? ''}
                  userId={store?.userId as string}
                  storeId={storeId as string}
                  fullName={fullName as string}
                  phone={phone}
                  email={email}
                  location={locationInput as string}
                  items={cartItems}
                  total={totalAfter}
                />
                <Button
                  onClick={() =>
                    router.push(
                      `/storev2/cart/pay?name=${encodeURIComponent(fullName)}&phone=${encodeURIComponent(
                        phone
                      )}&address=${encodeURIComponent(locationInput)}`
                    )
                  }
                  variant="outline"
                  className="flex w-full cursor-pointer items-center gap-2 border-2 border-gray-950 bg-gray-950 py-4 text-white duration-300 hover:bg-gray-800 hover:text-white"
                >
                  <span> الدفع الالكتروني</span> <MdOutlinePayments />
                </Button>

                <Button variant="outline" className="w-full hover:bg-gray-100">
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
