'use client';

import type React from 'react';
import { useState, type ChangeEvent, useEffect } from 'react';
import { SlCloudUpload } from 'react-icons/sl';
import { TbUpload } from 'react-icons/tb';
import {
  Package,
  DollarSign,
  ImageIcon,
  PlusCircle,
  Percent,
  Info,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from 'lucide-react';
import { GoPackageDependencies } from 'react-icons/go';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/app/lib/context/UserIdContect';
import CategoryDropdown from '../_components/InputForCatogery';
import { TbTruckReturn } from 'react-icons/tb';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useDashboardData } from '../../../context/useDashboardData';
import { useRouter } from 'next/navigation';
import { IoAddSharp } from 'react-icons/io5';
import { calculateDiscountedPrice } from '@/app/lib/utils/CalculateDiscountedPrice';
import { BsTelegram } from 'react-icons/bs';
import type { Product } from '@/types/Products';

export default function ProductAddPage() {
  const { data: session } = useSession();
  const { data } = useDashboardData(session?.user?.id);
  const router = useRouter();

  const [expandedSections, setExpandedSections] = useState({
    sizes: false,
    colors: false,
    socialMedia: false,
    shipping: false,
    gallery: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const [newProduct, setNewProduct] = useState<
    Partial<Product> & {
      imageFile?: File;
      imagePreview?: string;
      unlimited: boolean;
    }
  >({
    name: '',
    price: 0,
    quantity: 0,
    discount: 0,
    category: '',
    description: '',
    hasReturnPolicy: '',
    shippingType: '',
    unlimited: false,
  });

  const { id } = useUser();
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [sizes, setSizes] = useState<{ size: string; stock: number }[]>([]);
  const [colors, setColors] = useState<{ name: string; hex: string; stock: number }[]>([]);

  useEffect(() => {
    if (!id) return;

    async function fetchCategories() {
      try {
        const res = await fetch(`/api/products/categories/${id}`);
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data: string[] = await res.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCategories();
  }, [id]);

  const onNewImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewProduct({
      ...newProduct,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    });
  };
  const onGalleryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    const remaining = 3 - galleryFiles.length;
    if (remaining <= 0) {
      toast.error('يمكنك رفع 3 صور إضافية فقط');
      return;
    }

    const filesToAdd = files.slice(0, remaining);

    setGalleryFiles(prev => [...prev, ...filesToAdd]);
    setGalleryPreviews(prev => [...prev, ...filesToAdd.map(f => URL.createObjectURL(f))]);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      alert('صيغة الصورة غير مدعومة. الرجاء اختيار JPG أو PNG أو WEBP');
      e.target.value = '';
      return;
    }

    const preview = URL.createObjectURL(file);

    setNewProduct({
      ...newProduct,
      imageFile: file,
      imagePreview: preview,
    });
  };

  const updateSize = (index: number, field: 'size' | 'stock', value: string | number) => {
    const updated = [...sizes];
    if (field === 'size') {
      updated[index].size = String(value);
    } else if (field === 'stock') {
      const numeric = Number(value);
      updated[index].stock = isNaN(numeric) ? 0 : numeric;
    }
    setSizes(updated);
  };

  const addProduct = async () => {
    if (
      !newProduct.name?.trim() ||
      !newProduct.price ||
      (!newProduct.unlimited && newProduct.quantity == null) ||
      !newProduct.imageFile ||
      !newProduct.description?.trim() ||
      !newProduct.category?.trim()
    ) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append('name', newProduct.name.trim());
      formData.append('price', String(newProduct.price));
      formData.append('quantity', newProduct.unlimited ? '0' : String(newProduct.quantity));
      formData.append('description', newProduct.description.trim());
      formData.append('category', newProduct.category);
      formData.append('image', newProduct.imageFile);

      formData.append('unlimited', newProduct.unlimited ? 'true' : 'false');

      formData.append(
        'discount',
        Number.isFinite(newProduct.discount) ? String(newProduct.discount) : '0'
      );

      if (newProduct.shippingType?.trim()) {
        formData.append('shippingType', newProduct.shippingType.trim());
      }

      if (newProduct.hasReturnPolicy?.trim()) {
        formData.append('hasReturnPolicy', newProduct.hasReturnPolicy.trim());
      }

      if (sizes.length > 0) {
        formData.append('sizes', JSON.stringify(sizes));
      }

      if (colors.length > 0) {
        formData.append('colors', JSON.stringify(colors));
      }

      if (newProduct.pricingDetails) {
        const { minPrice, maxPrice, wholesalePrice } = newProduct.pricingDetails;

        if (Number.isFinite(minPrice)) {
          formData.append('minPrice', String(minPrice));
        }

        if (Number.isFinite(maxPrice)) {
          formData.append('maxPrice', String(maxPrice));
        }

        if (Number.isFinite(wholesalePrice)) {
          formData.append('wholesalePrice', String(wholesalePrice));
        }
      }

      if (newProduct.subInfo?.telegram?.trim()) {
        formData.append('telegramLink', newProduct.subInfo.telegram.trim());
      }

      if (newProduct.subInfo?.facebookLink?.trim()) {
        formData.append('facebookLink', newProduct.subInfo.facebookLink.trim());
      }

      if (newProduct.subInfo?.instaLink?.trim()) {
        formData.append('instaLink', newProduct.subInfo.instaLink.trim());
      }

      if (newProduct.subInfo?.whasapp?.trim()) {
        formData.append('whasapp', newProduct.subInfo.whasapp.trim());
      }

      if (newProduct.subInfo?.videoLink?.trim()) {
        formData.append('videoLink', newProduct.subInfo.videoLink.trim());
      }

      galleryFiles.forEach(file => {
        formData.append('gallery', file);
      });

      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('FAILED');
      }

      toast.success('تم إضافة المنتج بنجاح');
      router.push('/Dashboard/ProductManagment');
      setNewProduct({
        name: '',
        price: 0,
        quantity: 0,
        discount: 0,
        category: '',
        description: '',
        imageFile: undefined,
        imagePreview: undefined,
        shippingType: '',
        hasReturnPolicy: '',
        unlimited: false,
      });

      setGalleryFiles([]);
      setGalleryPreviews([]);
      setSizes([]);
      setColors([]);
    } catch (error) {
      console.error(error);
      toast.error('فشل في إضافة المنتج');
    } finally {
      setLoading(false);
    }
  };

  const addSize = () => {
    setSizes([...sizes, { size: '', stock: 0 }]);
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, idx) => idx !== index));
  };
  const updateColor = (index: number, field: 'name' | 'hex' | 'stock', value: string | number) => {
    const updated = [...colors];
    if (field === 'name') updated[index].name = String(value);
    else if (field === 'hex') updated[index].hex = String(value);
    else if (field === 'stock') updated[index].stock = Number(value);
    setColors(updated);
  };

  const addColor = () => setColors([...colors, { name: '', hex: '#000000', stock: 0 }]);

  const removeColor = (index: number) => setColors(colors.filter((_, i) => i !== index));

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="mx-auto max-w-7xl py-4">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white">
              <div className="border-b border-gray-200 bg-gray-50 p-4">
                <h3 className="flex items-center gap-2 text-base font-semibold text-black">
                  <Package className="h-5 w-5 text-sky-500" />
                  <span>المعلومات الأساسية</span>
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-5">
                  <ModernInputGroup
                    label="اسم المنتج"
                    icon={<Package className="h-4 w-4 text-gray-400" />}
                    value={newProduct.name}
                    onChange={value => setNewProduct({ ...newProduct, name: value })}
                    placeholder="أدخل اسم المنتج (مثال: تيشرت قطن)"
                    disabled={loading}
                    required
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <ModernInputGroup
                      label="السعر"
                      icon={<DollarSign className="h-4 w-4 text-gray-400" />}
                      type="number"
                      value={newProduct.price ?? ''}
                      onChange={value => {
                        setNewProduct({ ...newProduct, price: Number.parseFloat(value) });
                      }}
                      onBlur={() => {
                        let numericValue = newProduct.price ?? 0;
                        if (numericValue > 0 && numericValue < 100) {
                          numericValue *= 1000;
                        }
                        if (numericValue < 240) numericValue = 240;
                        setNewProduct({ ...newProduct, price: numericValue });
                      }}
                      placeholder="0"
                      disabled={loading}
                      required
                    />

                    <ModernInputGroup
                      label="الخصم (%)"
                      icon={<Percent className="h-4 w-4 text-gray-400" />}
                      type="number"
                      value={newProduct.discount === 0 ? '' : newProduct.discount}
                      onChange={value => {
                        let discountValue = Number.parseFloat(value) || 0;
                        if (discountValue < 0) discountValue = 0;
                        if (discountValue > 100) discountValue = 100;
                        setNewProduct({ ...newProduct, discount: discountValue });
                      }}
                      placeholder="10"
                      disabled={loading}
                    />
                  </div>

                  {newProduct.discount! > 0 && (
                    <div className="border border-sky-500 bg-sky-50 p-3">
                      <span className="text-sm font-medium text-black">
                        السعر بعد الخصم:{' '}
                        {calculateDiscountedPrice(newProduct.price ?? 0, newProduct.discount ?? 0)}{' '}
                        د.ع
                      </span>
                    </div>
                  )}

                  {data.supplier && (
                    <div className="space-y-4 border border-gray-200 bg-gray-50 p-4">
                      <h3 className="text-sm font-semibold text-black">أسعار الموردين</h3>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <ModernInputGroup
                          label="سعر الجملة"
                          type="number"
                          value={newProduct.pricingDetails?.wholesalePrice ?? ''}
                          onChange={value => {
                            setNewProduct({
                              ...newProduct,
                              pricingDetails: {
                                ...newProduct.pricingDetails!,
                                wholesalePrice: Number.parseFloat(value) || 0,
                              },
                            });
                          }}
                          placeholder="0"
                          disabled={loading}
                        />
                        <ModernInputGroup
                          label="الحد الأدنى"
                          type="number"
                          value={newProduct.pricingDetails?.minPrice ?? ''}
                          onChange={value => {
                            setNewProduct({
                              ...newProduct,
                              pricingDetails: {
                                ...newProduct.pricingDetails!,
                                minPrice: Number.parseFloat(value) || 0,
                              },
                            });
                          }}
                          placeholder="0"
                          disabled={loading}
                        />
                        <ModernInputGroup
                          label="الحد الأقصى"
                          type="number"
                          value={newProduct.pricingDetails?.maxPrice ?? ''}
                          onChange={value => {
                            setNewProduct({
                              ...newProduct,
                              pricingDetails: {
                                ...newProduct.pricingDetails!,
                                maxPrice: Number.parseFloat(value) || 0,
                              },
                            });
                          }}
                          placeholder="0"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-white">
              <div className="border-b border-gray-200 bg-gray-50 p-4">
                <h3 className="flex items-center gap-2 text-base font-semibold text-black">
                  <GoPackageDependencies className="h-5 w-5 text-sky-500" />
                  <span>المخزون والكمية</span>
                </h3>
              </div>
              <div className="space-y-4 p-6">
                <ModernInputGroup
                  label="الكمية المتوفرة"
                  icon={<Package className="h-4 w-4 text-gray-400" />}
                  type="number"
                  value={newProduct.unlimited ? '' : newProduct.quantity}
                  onChange={value => {
                    const parsed = Number.parseInt(value);
                    if (!isNaN(parsed) && parsed >= 0) {
                      setNewProduct({ ...newProduct, quantity: parsed, unlimited: false });
                    } else {
                      setNewProduct({ ...newProduct, quantity: 0, unlimited: false });
                    }
                  }}
                  placeholder="أدخل الكمية"
                  disabled={loading || newProduct.unlimited}
                  required
                />

                <label className="flex cursor-pointer items-center gap-3 border border-gray-200 bg-gray-50 p-4 transition hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={newProduct.unlimited}
                    onChange={e => setNewProduct({ ...newProduct, unlimited: e.target.checked })}
                    className="h-4 w-4 border-gray-300 text-sky-500 focus:ring-sky-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-black">كمية غير محدودة</span>
                    <p className="text-xs text-gray-600">مفيد للمنتجات المتجددة باستمرار</p>
                  </div>
                </label>

                <CategoryDropdown
                  categories={categories}
                  value={newProduct.category as string}
                  onChange={val => setNewProduct({ ...newProduct, category: val })}
                  loading={loading}
                />
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white">
              <div className="border-b border-gray-200 bg-gray-50 p-4">
                <h3 className="flex items-center gap-2 text-base font-semibold text-black">
                  <Info className="h-5 w-5 text-sky-500" />
                  <span>وصف المنتج</span>
                </h3>
              </div>
              <div className="p-6">
                <textarea
                  className="min-h-[150px] w-full border border-gray-300 bg-white p-4 text-sm text-black transition placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="اكتب وصفاً تفصيلياً للمنتج... (مثال: قميص صيفي مصنوع من القطن الطبيعي 100%، مريح وخفيف)"
                  value={newProduct.description}
                  onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            <CollapsibleSection
              title="الأحجام والأنواع"
              subtitle="أضف خيارات متعددة للمنتج"
              isExpanded={expandedSections.sizes}
              onToggle={() => toggleSection('sizes')}
            >
              <div className="space-y-3">
                {sizes.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 border border-gray-200 bg-white p-3"
                  >
                    <Input
                      placeholder="المقاس أو النوع"
                      value={s.size}
                      onChange={e => updateSize(i, 'size', e.target.value)}
                      className="flex-1 border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    />
                    <Input
                      type="number"
                      placeholder="الكمية"
                      value={s.stock === 0 ? '' : s.stock}
                      onChange={e => {
                        const val = e.target.value;
                        updateSize(i, 'stock', val === '' ? 0 : Number(val));
                      }}
                      className="w-28 border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSize(i)}
                    >
                      حذف
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2 border-dashed border-gray-400 bg-transparent hover:border-sky-500 hover:bg-sky-50 hover:text-sky-500"
                  onClick={addSize}
                >
                  <IoAddSharp className="h-4 w-4" />
                  <span>إضافة حجم جديد</span>
                </Button>
              </div>
            </CollapsibleSection>

            <CollapsibleSection
              title="الألوان المتاحة"
              subtitle="حدد الألوان والكميات"
              isExpanded={expandedSections.colors}
              onToggle={() => toggleSection('colors')}
            >
              <div className="space-y-3">
                {colors.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 border border-gray-200 bg-white p-3"
                  >
                    <Input
                      placeholder="اسم اللون"
                      value={c.name}
                      onChange={e => updateColor(i, 'name', e.target.value)}
                      className="flex-1 border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    />
                    <div className="relative">
                      <Input
                        type="color"
                        value={c.hex}
                        onChange={e => updateColor(i, 'hex', e.target.value)}
                        className="h-10 w-16 cursor-pointer border-gray-300"
                      />
                    </div>
                    <Input
                      type="number"
                      placeholder="الكمية"
                      value={c.stock === 0 ? '' : c.stock}
                      onChange={e => {
                        const val = e.target.value;
                        updateColor(i, 'stock', val === '' ? 0 : Number(val));
                      }}
                      className="w-28 border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeColor(i)}
                    >
                      حذف
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2 border-dashed border-gray-400 bg-transparent hover:border-sky-500 hover:bg-sky-50 hover:text-sky-500"
                  onClick={addColor}
                >
                  <IoAddSharp className="h-4 w-4" />
                  <span>إضافة لون جديد</span>
                </Button>
              </div>
            </CollapsibleSection>

            <CollapsibleSection
              title="معلومات الشحن والإرجاع"
              subtitle="اختياري - أضف تفاصيل التوصيل"
              isExpanded={expandedSections.shipping}
              onToggle={() => toggleSection('shipping')}
            >
              <div className="space-y-4">
                <ModernInputGroup
                  label="مدة التوصيل أو تفاصيله"
                  icon={<LiaShippingFastSolid className="h-4 w-4 text-gray-400" />}
                  type="text"
                  value={newProduct.shippingType}
                  onChange={value => setNewProduct({ ...newProduct, shippingType: value })}
                  placeholder="مثال: التوصيل خلال 3-5 أيام"
                  disabled={loading}
                />

                <ModernInputGroup
                  label="سياسة الاسترجاع"
                  icon={<TbTruckReturn className="h-4 w-4 text-gray-400" />}
                  type="text"
                  value={newProduct.hasReturnPolicy}
                  onChange={value => setNewProduct({ ...newProduct, hasReturnPolicy: value })}
                  placeholder="مثال: إرجاع مجاني خلال 14 يوم"
                  disabled={loading}
                />
              </div>
            </CollapsibleSection>

            {data.supplier && (
              <CollapsibleSection
                title="روابط التواصل الاجتماعي"
                subtitle="اختياري - أضف روابط للمنتج"
                isExpanded={expandedSections.socialMedia}
                onToggle={() => toggleSection('socialMedia')}
              >
                <div className="space-y-4">
                  <ModernInputGroup
                    label="رابط تيليجرام"
                    icon={<BsTelegram className="h-4 w-4 text-sky-500" />}
                    value={newProduct.subInfo?.telegram || ''}
                    onChange={value =>
                      setNewProduct({
                        ...newProduct,
                        subInfo: { ...newProduct.subInfo, telegram: value },
                      })
                    }
                    placeholder="https://t.me/..."
                    disabled={loading}
                  />

                  <ModernInputGroup
                    label="رابط الفيديو"
                    icon={<ImageIcon className="h-4 w-4 text-gray-400" />}
                    value={newProduct.subInfo?.videoLink || ''}
                    onChange={value =>
                      setNewProduct({
                        ...newProduct,
                        subInfo: { ...newProduct.subInfo, videoLink: value },
                      })
                    }
                    placeholder="https://youtube.com/..."
                    disabled={loading}
                  />
                </div>
              </CollapsibleSection>
            )}
          </div>

          <div className="space-y-6 rounded-lg">
            <div className="sticky top-24 rounded-lg border border-gray-200 bg-white">
              <div className="border-b border-gray-200 bg-gray-50 p-4">
                <h3 className="flex items-center gap-2 text-base font-semibold text-black">
                  <ImageIcon className="h-5 w-5 text-sky-500" />
                  <span>الصورة الرئيسية</span>
                </h3>
              </div>
              <div className="p-6">
                {newProduct.imagePreview ? (
                  <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-50">
                    <img
                      src={newProduct.imagePreview || '/placeholder.svg'}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setNewProduct({
                          ...newProduct,
                          imageFile: undefined,
                          imagePreview: undefined,
                        })
                      }
                      className="absolute top-3 right-3 bg-black p-2 text-white transition hover:bg-gray-800"
                      disabled={loading}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-600 transition hover:border-sky-500 hover:bg-sky-50">
                    <div className="rounded-lg bg-sky-100 p-4">
                      <SlCloudUpload size={32} className="text-sky-500" />
                    </div>
                    <div className="text-center">
                      <span className="block text-sm font-semibold text-black">
                        اضغط لرفع الصورة
                      </span>
                      <span className="mt-1 block text-xs text-gray-600">JPG, PNG, أو WEBP</span>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={loading}
                    />
                  </label>
                )}
              </div>
            </div>

            <CollapsibleSection
              title="صور إضافية"
              subtitle={`${galleryFiles.length}/3 صور`}
              isExpanded={expandedSections.gallery}
              onToggle={() => toggleSection('gallery')}
            >
              <div className="grid grid-cols-3 gap-3">
                {galleryPreviews.map((preview, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square overflow-hidden border border-gray-300"
                  >
                    <img
                      src={preview || '/placeholder.svg'}
                      alt={`Gallery ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-1 right-1 bg-black p-1 text-white transition hover:bg-gray-800"
                      disabled={loading}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}

                {galleryFiles.length < 3 && (
                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 bg-gray-50 text-gray-600 transition hover:border-sky-500 hover:bg-sky-50">
                    <TbUpload size={24} className="text-sky-500" />
                    <span className="text-xs font-medium">رفع صورة</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={onGalleryChange}
                      className="hidden"
                      disabled={loading}
                    />
                  </label>
                )}
              </div>
            </CollapsibleSection>

            <Button
              onClick={addProduct}
              disabled={loading}
              className="w-full gap-2 bg-sky-500 py-6 text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span className="font-semibold">جاري الإضافة...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="h-5 w-5" />
                  <span className="font-semibold">إضافة المنتج</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ModernInputGroupProps {
  label: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  value?: string | number;
  onChange: (value: string) => void;
  disabled?: boolean;
  onBlur?: () => void;
}

function ModernInputGroup({
  label,
  required,
  placeholder,
  type = 'text',
  icon,
  value,
  onChange,
  disabled,
  onBlur,
}: ModernInputGroupProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label className="text-sm font-medium text-black">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <Input
          type={type}
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder || label}
          className="border-gray-300 bg-white pr-3 pl-10 transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
        />
        {icon && <span className="absolute top-1/2 left-3 -translate-y-1/2">{icon}</span>}
      </div>
    </div>
  );
}

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  subtitle,
  isExpanded,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between border-b border-gray-200 bg-gray-50 p-4 text-right transition hover:bg-gray-100"
      >
        <div>
          <h3 className="text-sm font-semibold text-black">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-gray-600">{subtitle}</p>}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="animate-in slide-in-from-top-2 p-6 duration-200">{children}</div>
      )}
    </div>
  );
}
