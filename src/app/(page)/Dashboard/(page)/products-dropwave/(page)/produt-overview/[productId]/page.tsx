'use client';
import { useState, useEffect } from 'react';
import {
  Heart,
  ShoppingCart,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Boxes,
  TrendingDown,
  TrendingUp,
  PackageSearch,
  Link,
  DollarSign,
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
import { useProducts } from '@/app/(page)/store/Data/context/products/ProductsContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import CustomInput from '@/app/(page)/Dashboard/_components/InputStyle';
import CategoryDropdown from '../../../../ProductManagment/_components/InputForCatogery';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export default function ProductPage() {
  const params = useParams();
  const session = useSession();
  const id = params?.productId as string;
  // const { store } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const { addToCartWithQtyByKey } = useCart();
  const { addToFavoriteByKey } = useFavorite();
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/dropwave/get/products/${id}`);
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
  useEffect(() => {
    if (!id) return;

    async function fetchCategories() {
      try {
        const res = await fetch(`/api/products/categories/${session.data?.user.id}`);
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data: string[] = await res.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCategories();
  }, [session.data?.user.id]);
  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };
  const addToStore = async () => {
    axios.post('/api/products/add-product-to-store', {
      productId: product?.id,
      profit: price,
      category: category,
    });
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

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="mb-3 font-semibold">اختر الفئة</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(sizeOption => (
                    <button
                      key={sizeOption.size}
                      onClick={() => setSelectedSize(sizeOption.size)}
                      disabled={sizeOption.stock === 0}
                      className={`rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all duration-300 ${
                        selectedSize === sizeOption.size
                          ? 'border-primary bg-primary text-primary-foreground shadow-glow'
                          : sizeOption.stock === 0
                            ? 'border-muted bg-muted text-muted-foreground cursor-not-allowed'
                            : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <div className="text-center">
                        <div>{sizeOption.size}</div>
                        {product.unlimited === false && (
                          <div className="text-xs opacity-75">
                            {sizeOption.stock > 0 ? `${sizeOption.stock} متوفر` : 'غير متوفر'}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {product.pricingDetails && (
              <div className="mt-4 border-t pt-4" dir="rtl">
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <span>تفاصيل السعر</span>
                </h2>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center">
                        <PackageSearch className="h-4 w-4" />
                      </span>
                      <span>سعر الجملة</span>
                    </div>
                    <span className="text-foreground font-medium">
                      {product.pricingDetails.wholesalePrice}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>الحد الأعلى</span>
                    </div>
                    <span className="text-foreground font-medium">
                      {product.pricingDetails.maxPrice}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4" />
                      <span>الحد الأدنى</span>
                    </div>
                    <span className="text-foreground font-medium">
                      {product.pricingDetails.minPrice}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Boxes className="h-4 w-4" />
                      <span>الحد الأدنى للطلب</span>
                    </div>
                    <span className="text-foreground font-medium">
                      {product.pricingDetails.minQuantity}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <hr />
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="mb-3 font-semibold">اختر اللون</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((colorOption, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(colorOption.hex)}
                      disabled={colorOption.stock === 0}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-black transition-all duration-300 ${
                        selectedColor === colorOption.hex
                          ? 'shadow-glow border'
                          : colorOption.stock === 0
                            ? 'border-muted cursor-not-allowed'
                            : 'border-border hover:border-muted-foreground'
                      }`}
                      style={{ backgroundColor: colorOption.hex }}
                    >
                      {colorOption.stock === 0 && <span className="text-xs text-white">×</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="mb-3 font-semibold">حدد الكمية المطلوبة</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-12 w-12 rounded-xl"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="min-w-[3rem] text-center text-xl font-bold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-12 w-12 rounded-xl"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col flex-wrap-reverse gap-4 md:flex">
              <Button
                onClick={() => {
                  if (product.sizes?.length && !selectedSize) {
                    toast.warning('الرجاء اختيار الفئة قبل الإضافة');
                    return;
                  }
                  if (product.colors?.length && !selectedColor) {
                    toast.warning('الرجاء اختيار اللون قبل الإضافة');
                    return;
                  }

                  const customProduct = {
                    ...product,
                    selectedColor,
                    selectedSize,
                    colors: product.colors?.filter(c => c.hex === selectedColor) || [],
                    sizes: product.sizes?.filter(s => s.size === selectedSize) || [],
                    shippingPrice: product.user?.Store?.[0]?.shippingPrice?.toString() ?? '',
                  };

                  addToCartWithQtyByKey(
                    customProduct,
                    quantity,
                    // `cart/${store?.id}`,
                    selectedColor,
                    selectedSize
                  );
                  toast.success(`تم اضافة ${quantity} الى السلة بنجاح`);
                }}
                className="hover-scale h-14 flex-1 cursor-pointer rounded-lg border"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                شراء الان
              </Button>
              <Button
                variant="outline"
                className="hover-scale h-14 flex-1 cursor-pointer rounded-lg"
                onClick={() => setOpen(true)}
              >
                <span>اضف الى متجرك</span>
                <Link className="h-4 w-4" />
              </Button>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="rounded-xl" dir="rtl">
                  <DialogHeader>
                    <DialogTitle className="text-base font-semibold">
                      هل تريد إضافة هذا المنتج إلى موقعك؟
                    </DialogTitle>
                  </DialogHeader>

                  <div className="text-muted-foreground text-sm">
                    سيتم نسخ بيانات المنتج مباشرة إلى واجهة متجرك ويمكنك تعديلها لاحقاً من لوحة
                    التحكم.
                  </div>
                  <div>
                    <CustomInput
                      type="number"
                      label={'حدد سعرك'}
                      icon={<DollarSign />}
                      placeholder="حدد السعر بحيث لا يتجاوز الحد الادنى والاعلى للسعر"
                      value={price === 0 ? '' : price}
                      onChange={e => setPrice(Number(e.target.value))}
                    />

                    <CategoryDropdown
                      categories={categories}
                      value={category}
                      onChange={value => setCategory(String(value))}
                      loading={false}
                    />
                  </div>

                  <DialogFooter className="mt-4 flex flex-col flex-wrap-reverse gap-2">
                    <Button
                      className="flex-1 cursor-pointer"
                      onClick={() => {
                        setOpen(false);
                        addToStore();
                      }}
                    >
                      أضف المنتج
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 cursor-pointer"
                      onClick={() => setOpen(false)}
                    >
                      إلغاء
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

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
