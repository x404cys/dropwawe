'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiShoppingBag } from 'react-icons/fi';
import { CiBookmark } from 'react-icons/ci';
import { BsBookmarksFill } from 'react-icons/bs';
import { useCart } from '@/app/lib/context/CartContext';
import { useFavorite } from '@/app/lib/context/FavContext';
import { toast } from 'sonner';
import { Product } from '@/types/Products';
import { TbTruckReturn } from 'react-icons/tb';
import { LiaShippingFastSolid } from 'react-icons/lia';
import AddToCartButton from '../../ProductManagment/_components/Button/AddToCard';

export default function ProductPage() {
  const path = usePathname();
  const id = path?.split('/').pop() || '';
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [shippingPrice, setshippingPrice] = useState();

  const { addToCartWithQtyByKey, addToCartByKey } = useCart();
  const { addToFavoriteByKey, removeFromFavoriteByKey, isInFavoriteByKey } = useFavorite();
  const [qty, setQty] = useState(1);
  const [userId, setUserId] = useState();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('err get products');
        const data = await res.json();
        setshippingPrice(data.user?.shippingPrice);
        const mainImage = data.image;
        setProduct({
          ...data,
          gallery: data.gallery || [mainImage],
        });
        setSelectedImage(mainImage);
        setUserId(data.user.id);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <section dir="rtl" className="min-h-screen pb-20">
        <div className="min-h-screen bg-white p-8">
          <div className="flex flex-col md:flex-row md:gap-10 md:p-8">
            <div className="relative aspect-[4/5] w-full animate-pulse rounded-lg bg-gray-200 md:w-1/2" />

            <div className="mt-5 flex w-full flex-col gap-4 md:w-1/2">
              <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-6 w-1/2 animate-pulse rounded bg-gray-200" />
              <div className="mt-4 h-24 animate-pulse rounded bg-gray-200" />
              <div className="mt-4 flex gap-4">
                <div className="h-10 w-24 animate-pulse rounded bg-gray-200" />
                <div className="h-10 w-24 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  if (!product) return <div className="p-8 text-center text-red-600">المنتج غير موجود</div>;

  const favoriteActive = isInFavoriteByKey(product.id, `fav/${userId}`);

  return (
    <section dir="rtl" className="mt-2 min-h-screen pb-20">
      <div className="min-h-screen bg-white">
        <div className="flex flex-col md:flex-row md:gap-10 md:p-8">
          <div className="relative aspect-[4/5] w-full md:w-1/2">
            <Image
              src={`${selectedImage}`}
              alt={product.name}
              fill
              className="rounded-lg object-cover"
              priority
            />
            <span className="absolute top-2 left-1 w-fit items-center rounded-lg bg-green-400 px-2 py-1 text-xs font-semibold text-white">
              خصم {product.discount}%
            </span>
          </div>

          <div className="mt-5 flex w-full flex-col gap-2 md:w-1/2">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold">{product.name}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="flex items-center gap-2 rounded-lg">
                {product.discount && product.discount > 0 ? (
                  <>
                    <span className="text-lg font-bold text-green-600">
                      {(product.price - (product.price * product.discount) / 100).toLocaleString()}{' '}
                      د.ع
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {product.price.toLocaleString()} د.ع
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-green-600">
                    {product.price.toLocaleString()} د.ع
                  </span>
                )}
              </div>

              {product.category && (
                <div className="flex items-center gap-2 rounded-lg py-2 text-sm font-semibold">
                  <span className="rounded-full bg-gray-200 px-2 py-1">{product.category}</span>
                </div>
              )}

              <div className="col-span-1 rounded-lg p-4 md:col-span-2">
                <h3 className="mb-2 text-sm text-gray-500 uppercase">الوصف</h3>
                <p className="text-sm leading-relaxed text-gray-700">
                  {product.description || 'لا يوجد وصف متوفر لهذا المنتج.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold">
                  <LiaShippingFastSolid className="text-green-600" size={20} />
                  <div className="flex flex-col">
                    <span>التوصيل</span>
                    <span className="text-xs whitespace-normal text-gray-500">
                      {product.shippingType || 'لا توجد معلومات'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold">
                  <TbTruckReturn className="text-red-500" size={20} />
                  <div className="flex flex-col">
                    <span>سياسة الاسترجاع</span>
                    <span className="text-xs whitespace-normal text-gray-500">
                      {product.hasReturnPolicy || 'لا توجد معلومات'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <button
                  onClick={() => setQty(prev => Math.max(prev - 1, 1))}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-gray-950 text-white hover:bg-red-600"
                >
                  -
                </button>

                <span className="min-w-[30px] text-center text-lg font-semibold">{qty}</span>

                <button
                  onClick={() => setQty(prev => prev + 1)}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-gray-950 text-white hover:bg-green-600"
                >
                  +
                </button>
              </div>

              <div className="mt-6 hidden w-full items-center gap-3 px-4 md:flex">
                {/* <button
                  onClick={() => {
                    addToCartWithQtyByKey(
                      {
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
                      },
                      qty,
                      `cart/${userId}`
                    );

                    toast.success(`تمت إضافة ${qty} قطع إلى السلة 🛒`);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black py-3 text-base font-semibold text-white transition hover:bg-gray-900"
                >
                  <FiShoppingBag size={20} /> إضافة إلى السلة
                </button> */}

                <AddToCartButton product={product} qty={qty} userId={`${userId}`} />

                <button
                  onClick={() =>
                    favoriteActive
                      ? removeFromFavoriteByKey(product.id, `fav/${userId}`)
                      : addToFavoriteByKey(
                          {
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            quantity: product.quantity,
                            category: product.category,
                            discount: product.discount,
                          },
                          `fav/${userId}`
                        )
                  }
                  className="flex h-[49px] w-[52px] items-center justify-center rounded-2xl border border-gray-300 text-gray-950 transition"
                >
                  {favoriteActive ? <BsBookmarksFill size={30} /> : <CiBookmark size={30} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex w-full items-center gap-2 px-4 md:hidden">
          {/* <button
            onClick={() => {
              addToCartWithQtyByKey(
                {
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
                },
                qty,
                `cart/${userId}`
              );

              toast.success(`تمت إضافة ${qty} قطع إلى السلة 🛒`);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black py-3 text-base font-semibold text-white transition hover:bg-gray-900"
          >
            <FiShoppingBag size={20} /> إضافة إلى السلة
          </button> */}
          <AddToCartButton product={product} qty={qty} userId={`${userId}`} />

          <button
            onClick={() =>
              favoriteActive
                ? removeFromFavoriteByKey(product.id, `fav/${userId}`)
                : addToFavoriteByKey(
                    {
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                      quantity: product.quantity,
                      category: product.category,
                      discount: product.discount,
                    },
                    `fav/${userId}`
                  )
            }
            className="flex h-[49px] w-[52px] items-center justify-center rounded-2xl border border-gray-300 text-gray-950 transition"
          >
            {favoriteActive ? <BsBookmarksFill size={30} /> : <CiBookmark size={30} />}
          </button>
        </div>
      </div>
      {/* <StoreBottomNav userI/> */}
    </section>
  );
}
