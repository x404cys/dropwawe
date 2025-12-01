'use client';
import { useState, useEffect } from 'react';
import {
  Heart,
  ShoppingCart,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Share,
  ArrowDownUp,
  DollarSign,
  PackageSearch,
  BadgePercent,
  Ban,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Product } from '@/types/Products';
import { useParams } from 'next/navigation';
import { calculateDiscountedPrice, formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { useCart } from '@/app/lib/context/CartContext';
import { toast } from 'sonner';
import { useFavorite } from '@/app/lib/context/FavContext';
import { RxShare2 } from 'react-icons/rx';
import axios from 'axios';

export default function ProductPage() {
  const params = useParams();

  const id = params?.productId as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const { addToCartWithQtyByKey } = useCart();
  const { addToFavoriteByKey } = useFavorite();
  const [newPrice, setNewPrice] = useState<number | string>('');
  const [error, setError] = useState<string | null>(null);

  const [openDaiolg, setOpenDailog] = useState(false);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/supplier/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          setSelectedImage(data.image);
          setSelectedSize(data.sizes?.[0]?.size || '');
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="bg-muted aspect-square animate-pulse rounded-2xl" />
            <div className="space-y-6">
              <div className="bg-muted h-8 w-3/4 animate-pulse rounded" />
              <div className="bg-muted h-6 w-1/2 animate-pulse rounded" />
              <div className="bg-muted h-24 animate-pulse rounded" />
              <div className="flex gap-4">
                <div className="bg-muted h-12 w-32 animate-pulse rounded" />
                <div className="bg-muted h-12 w-16 animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold">Product not found</h2>
          <p className="text-muted-foreground">The requested product could not be loaded.</p>
        </div>
      </div>
    );
  }

  const allImages = [product.image, ...(product.images?.map(img => img.url) || [])].filter(
    (url, index, self) => self.indexOf(url) === index
  );
  const handleSubmit = async () => {
    try {
      await axios.post('/api/supplier/product-transfer', {
        productId: product.id,
        newPrice: newPrice,
      });

      toast.success('تم اضافة المنتج الى موقعك الالكتروني ');
      setOpenDailog(false);
    } catch (err) {
      toast.error('حدث خطأ');
    }
  };

  return (
    <div dir="rtl" className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="animate-fade-in">
            <div className="bg-card shadow-elegant relative overflow-hidden rounded-2xl">
              <img
                src={selectedImage}
                alt={product.name}
                className="h-auto w-full object-contain transition-transform duration-500 hover:scale-105"
                onError={e => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop';
                }}
              />
              {product.discount > 0 && (
                <Badge className="bg-destructive text-destructive-foreground absolute top-4 left-4">
                  -{product.discount}%
                </Badge>
              )}
            </div>

            {allImages.length > 0 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {allImages.map((imageUrl, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageSelect(imageUrl!)}
                    className={`flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                      selectedImage === imageUrl
                        ? 'border-primary shadow-glow'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={`${product.name} view ${index + 1}`}
                      className="h-20 w-20 object-cover"
                      onError={e => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="animate-slide-up space-y-6">
            <div>
              <span className="text-2xl">{product.name}</span>
            </div>
            <div className="flex items-baseline gap-3">
              {product.discount && product.discount > 0 ? (
                <>
                  <span className="text-success text-3xl font-bold">
                    {formatIQD(calculateDiscountedPrice(product.price, product.discount))} د.ع
                  </span>
                  <span className="text-muted-foreground text-xl line-through">
                    {formatIQD(product.price)} د.ع
                  </span>
                </>
              ) : (
                <span className="text-success text-3xl font-bold">
                  {formatIQD(product.price)} د.ع
                </span>
              )}
            </div>
            <div>
              {product.unlimited ? (
                <span className="text-muted-foreground flex items-center gap-1">
                  <span>كمية وفيرة</span>
                  <span>📦</span>
                </span>
              ) : (
                <span className="text-muted-foreground flex items-center gap-1 text-sm">
                  <span>{product.quantity}</span>
                  <span>📦</span>
                </span>
              )}
            </div>
            {product.pricingDetails && (
              <div className="text-muted-foreground grid grid-cols-3 gap-2 text-sm">
                <div className="bg-muted/20 flex flex-col items-center rounded-lg p-2">
                  <BadgePercent className="mb-1 h-5 w-5 text-blue-500" />
                  <span className="text-xs">سعر الجملة</span>
                  <span className="text-foreground font-semibold">
                    {product.pricingDetails.wholesalePrice}
                  </span>
                </div>
                <div className="bg-muted/20 flex flex-col items-center rounded-lg p-2">
                  <ArrowDownUp className="mb-1 h-5 w-5 text-green-500" />
                  <span className="text-xs">الحد الأدنى</span>
                  <span className="text-foreground font-semibold">
                    {product.pricingDetails.minPrice}
                  </span>
                </div>
                <div className="bg-muted/20 flex flex-col items-center rounded-lg p-2">
                  <DollarSign className="mb-1 h-5 w-5 text-red-500" />
                  <span className="text-xs">الحد الأقصى</span>
                  <span className="text-foreground font-semibold">
                    {product.pricingDetails.maxPrice}
                  </span>
                </div>
              </div>
            )}

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setOpenDailog(true);
                }}
                className="hover-scale h-14 flex-1 cursor-pointer rounded-xl"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                اضف الى السلة
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setOpenDailog(true);
                }}
                className={`h-14 w-14 rounded-xl transition-all duration-300 ${
                  isFavorite
                    ? 'border-destructive bg-destructive text-destructive-foreground'
                    : 'hover:border-destructive hover:text-destructive'
                }`}
              >
                <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
              <Button
                className="h-14 w-14 rounded-xl transition-all duration-300"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('تم نسخ رابط المنتج الان يمكنك مشاركته مع من حولك ✨');
                }}
              >
                <RxShare2 />
              </Button>
            </div>
            {openDaiolg && product.pricingDetails && (
              <div className="bg-opacity-40 fixed inset-0 z-50 flex items-center justify-center">
                <div className="animate-fadeIn w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-7 w-7 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M0 0h24v24H0V0z" fill="none" />
                      <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    </svg>
                    <h2 className="text-lg font-semibold text-gray-800">تحديد السعر</h2>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    أدخل السعر بين الحد الأدنى والحد الأقصى للمنتج.
                  </p>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={e => {
                      const value = e.target.value;
                      const numValue = parseFloat(value);
                      const min = product.pricingDetails?.minPrice;
                      const max = product.pricingDetails?.maxPrice;

                      setNewPrice(value);

                      if (value === '' || isNaN(numValue)) return;

                      if (min !== undefined && numValue < min) {
                        toast.error(`السعر أقل من الحد الأدنى (${min})`);
                        setError(`السعر أقل من الحد الأدنى (${min})`);
                      } else if (max !== undefined && numValue > max) {
                        toast.error(`السعر أكبر من الحد الأقصى (${max})`);
                        setError(`السعر أكبر من الحد الأقصى (${max})`);
                      } else {
                        setError(null);
                      }
                    }}
                    placeholder={`الحد الأدنى: ${product.pricingDetails?.minPrice ?? '-'}, الحد الأقصى: ${product.pricingDetails?.maxPrice ?? '-'}`}
                    className="mt-4 w-full rounded-md border px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <div>
                    <span className="text-sm text-red-500">{error}</span>
                    {/* <Ban /> */}
                  </div>
                  <div className="mt-5 flex justify-end gap-2">
                    <button
                      onClick={() => setOpenDailog(false)}
                      className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="cursor-pointer rounded-md bg-gray-950 px-4 py-2 text-sm font-medium text-white"
                    >
                      تأكيد
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {product.shippingType && (
                <Card className="animate-scale-in p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-success/10 rounded-full p-2">
                      <Truck className="text-success h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">التوصيل</h4>
                      <p className="text-muted-foreground text-sm">
                        {product.shippingType}
                        {product.user?.shippingPrice && (
                          <span className="block">
                            {formatIQD(product.user.shippingPrice)} سعر التوصيل
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {product.hasReturnPolicy && (
                <Card className="animate-scale-in p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-info/10 rounded-full p-2">
                      <RotateCcw className="text-info h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">سياسة الاسترجاع</h4>
                      <p className="text-muted-foreground text-sm">{product.hasReturnPolicy}</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
