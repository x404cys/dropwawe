'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import { SlCloudUpload } from 'react-icons/sl';
import { TbUpload } from 'react-icons/tb';

import { Package, DollarSign, ImageIcon, PlusCircle, Percent, Info } from 'lucide-react';
import { Product } from '@/types/Products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GoPackageDependencies } from 'react-icons/go';
import { useUser } from '@/app/lib/context/UserIdContect';
import CategoryDropdown from '../_components/InputForCatogery';
import { TbTruckReturn } from 'react-icons/tb';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useDashboardData } from '../../../_utils/useDashboardData';
import { useRouter } from 'next/navigation';
import { IoAddSharp, IoChevronBackSharp } from 'react-icons/io5';
import { calculateDiscountedPrice } from '@/app/lib/utils/CalculateDiscountedPrice';

export default function ProductAddPage() {
  const { data: session } = useSession();
  const { data } = useDashboardData(session?.user?.id);
  const router = useRouter();
  const [newProduct, setNewProduct] = useState<
    Partial<Product> & { imageFile?: File; imagePreview?: string }
  >({
    name: '',
    price: 0,
    quantity: 0,
    discount: 0,
    category: '',
    description: '',
    hasReturnPolicy: '',
    shippingType: '',
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
    const requiredFields = [
      newProduct.name?.trim(),
      newProduct.price,
      newProduct.quantity,
      newProduct.imageFile,
      newProduct.description?.trim(),
      newProduct.category?.trim(),
    ];

    if (requiredFields.some(f => f === undefined || f === null || f === '')) {
      toast.error('يرجى ملء جميع الحقول المطلوبة وتحميل صورة');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', newProduct.name!);
      formData.append('price', newProduct.price!.toString());
      formData.append('quantity', newProduct.quantity!.toString());
      formData.append('image', newProduct.imageFile!);
      formData.append('description', newProduct.description!);
      formData.append('discount', (newProduct.discount ?? 0).toString());
      formData.append('category', newProduct.category!);
      formData.append('shippingType', newProduct.shippingType ?? '');
      formData.append('hasReturnPolicy', newProduct.hasReturnPolicy ?? '');
      formData.append('sizes', JSON.stringify(sizes));
      formData.append('colors', JSON.stringify(colors));
      formData.append('unlimited', String(newProduct.unlimited));
      galleryFiles.forEach(file => formData.append('gallery', file));
      formData.append('minPrice', newProduct.pricingDetails?.minPrice?.toString() ?? '');
      formData.append('maxPrice', newProduct.pricingDetails?.maxPrice?.toString() ?? '');
      formData.append(
        'wholesalePrice',
        newProduct.pricingDetails?.wholesalePrice?.toString() ?? ''
      );

      const res = await fetch('/api/products', { method: 'POST', body: formData });
      if (!res.ok) throw new Error();

      toast.success('تم إضافة المنتج بنجاح');

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
      });
      setGalleryFiles([]);
      setGalleryPreviews([]);
      setSizes([]);
    } catch {
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
    <>
      <Card dir="rtl" className="mx-auto max-w-[600px] rounded-2xl border bg-white shadow-xl">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center justify-between gap-3 text-lg text-gray-800">
            <div className="flex items-center gap-2">
              <GoPackageDependencies className="h-6 w-6 text-green-600" />
              <span>إضافة منتج جديد</span>
            </div>

            <button
              onClick={() => router.back()}
              className="flex cursor-pointer items-center gap-1 rounded-full border border-gray-300 p-1 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              <IoChevronBackSharp size={25} />
            </button>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            <InputGroup
              label="اسم المنتج"
              icon={<Package className="h-4 w-4 text-gray-500" />}
              value={newProduct.name}
              onChange={value => setNewProduct({ ...newProduct, name: value })}
              placeholder="مثلًا:  تيشترت لينون"
              disabled={loading}
              required
            />

            <InputGroup
              label="السعر"
              icon={<DollarSign className="h-4 w-4 text-gray-500" />}
              type="number"
              value={newProduct.price ?? ''}
              onChange={value => {
                setNewProduct({ ...newProduct, price: parseFloat(value) });
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
            {data.supplier && (
              <>
                <InputGroup
                  label="سعر الجملة"
                  icon={<DollarSign className="h-4 w-4 text-gray-500" />}
                  type="number"
                  value={newProduct.pricingDetails?.wholesalePrice ?? ''}
                  onChange={value => {
                    setNewProduct({
                      ...newProduct,
                      pricingDetails: {
                        ...newProduct.pricingDetails!,
                        wholesalePrice: parseFloat(value) || 0,
                      },
                    });
                  }}
                  onBlur={() => {
                    let numericValue = newProduct.pricingDetails?.wholesalePrice ?? 0;

                    if (numericValue > 0 && numericValue < 100) {
                      numericValue *= 1000;
                    }

                    if (numericValue < 240) numericValue = 240;

                    setNewProduct({
                      ...newProduct,
                      pricingDetails: {
                        ...newProduct.pricingDetails!,
                        wholesalePrice: numericValue,
                      },
                    });
                  }}
                  placeholder="0"
                  disabled={loading}
                  required
                />
                <InputGroup
                  label="الحد الادنى للسعر"
                  icon={<DollarSign className="h-4 w-4 text-gray-500" />}
                  type="number"
                  value={newProduct.pricingDetails?.minPrice ?? ''}
                  onChange={value => {
                    setNewProduct({
                      ...newProduct,
                      pricingDetails: {
                        ...newProduct.pricingDetails!,
                        minPrice: parseFloat(value) || 0,
                      },
                    });
                  }}
                  onBlur={() => {
                    let numericValue = newProduct.pricingDetails?.minPrice ?? 0;

                    if (numericValue > 0 && numericValue < 100) {
                      numericValue *= 1000;
                    }

                    if (numericValue < 240) numericValue = 240;

                    setNewProduct({
                      ...newProduct,
                      pricingDetails: {
                        ...newProduct.pricingDetails!,
                        minPrice: numericValue,
                      },
                    });
                  }}
                  placeholder="0"
                  disabled={loading}
                  required
                />
                <InputGroup
                  label="الحد الاعلى للسعر"
                  icon={<DollarSign className="h-4 w-4 text-gray-500" />}
                  type="number"
                  value={newProduct.pricingDetails?.maxPrice ?? ''}
                  onChange={value => {
                    setNewProduct({
                      ...newProduct,
                      pricingDetails: {
                        ...newProduct.pricingDetails!,
                        maxPrice: parseFloat(value) || 0,
                      },
                    });
                  }}
                  onBlur={() => {
                    let numericValue = newProduct.pricingDetails?.maxPrice ?? 0;

                    if (numericValue > 0 && numericValue < 100) {
                      numericValue *= 1000;
                    }

                    if (numericValue < 240) numericValue = 240;

                    setNewProduct({
                      ...newProduct,
                      pricingDetails: {
                        ...newProduct.pricingDetails!,
                        maxPrice: numericValue,
                      },
                    });
                  }}
                  placeholder="0"
                  disabled={loading}
                  required
                />
              </>
            )}

            <InputGroup
              label="الخصم (%)"
              icon={<Percent className="h-4 w-4 text-gray-500" />}
              type="number"
              value={newProduct.discount === 0 ? '' : newProduct.discount}
              onChange={value => {
                let discountValue = parseFloat(value) || 0;
                if (discountValue < 0) discountValue = 0;
                if (discountValue > 100) discountValue = 100;

                setNewProduct({ ...newProduct, discount: discountValue });
              }}
              placeholder="مثلاً: 10"
              disabled={loading}
            />
            <div className="text-sm text-gray-600">
              السعر بعد الخصم:
              {calculateDiscountedPrice(newProduct.price ?? 0, newProduct.discount ?? 0)} د.ع
            </div>

            <div className="space-y-2">
              <InputGroup
                label="الكمية"
                icon={<Package className="h-4 w-4 text-gray-500" />}
                type="number"
                value={newProduct.unlimited ? '' : newProduct.quantity}
                onChange={value => {
                  const parsed = parseInt(value);
                  if (!isNaN(parsed) && parsed >= 0) {
                    setNewProduct({ ...newProduct, quantity: parsed, unlimited: false });
                  } else {
                    setNewProduct({ ...newProduct, quantity: 0, unlimited: false });
                  }
                }}
                placeholder="كمية غير محدودة"
                disabled={loading || newProduct.unlimited}
                required
              />

              <label className="flex cursor-pointer items-center gap-2 select-none">
                <span className="text-sm text-gray-700">جعل الكمية غير محدودة</span>
                <input
                  type="checkbox"
                  checked={newProduct.unlimited}
                  onChange={e => setNewProduct({ ...newProduct, unlimited: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              <div className="flex items-center gap-1">
                <Info size={11} className="text-gray-600" />
                <span className="text-xs text-gray-600">
                  هذا الخيار مفيد في حالة المنتج لديك متكرر التجديد
                </span>
              </div>
            </div>
            <hr />
            <div className="flex flex-col gap-2">
              <Label className="font-medium text-gray-700">الأحجام - أو أنواع أخرى (اختياري)</Label>

              {sizes.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-3 shadow-sm"
                >
                  <Input
                    placeholder="المقاس - نوع"
                    value={s.size}
                    onChange={e => updateSize(i, 'size', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 focus:border-green-400 focus:ring-1 focus:ring-green-400"
                  />
                  <Input
                    type="number"
                    placeholder="الكمية"
                    value={s.stock === 0 ? '' : s.stock}
                    onChange={e => {
                      const val = e.target.value;
                      updateSize(i, 'stock', val === '' ? 0 : Number(val));
                    }}
                    className="w-24 rounded-md border-gray-300 focus:border-green-400 focus:ring-1 focus:ring-green-400"
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    className="rounded-md px-3 py-1 text-sm transition hover:bg-red-600 hover:text-white"
                    onClick={() => removeSize(i)}
                  >
                    حذف
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-black transition hover:border-green-400 hover:bg-green-50"
                onClick={addSize}
              >
                <p>إضافة حجم - أو نوع</p>
                <IoAddSharp />
              </Button>
            </div>
            <div className="flex flex-col gap-2 text-xs">
              <Label className="font-medium text-gray-700">الألوان - اختياري</Label>

              {colors.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-3 shadow-sm"
                >
                  <Input
                    placeholder="اسم اللون"
                    value={c.name}
                    onChange={e => updateColor(i, 'name', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 focus:border-green-400 focus:ring-1 focus:ring-green-400"
                  />
                  <Input
                    type="color"
                    value={c.hex}
                    onChange={e => updateColor(i, 'hex', e.target.value)}
                    className="w-16 rounded-md border-gray-300 p-0"
                  />
                  <Input
                    type="number"
                    placeholder="الكمية"
                    value={c.stock === 0 ? '' : c.stock}
                    onChange={e => updateColor(i, 'stock', e.target.value)}
                    className="w-24 rounded-md border-gray-300 focus:border-green-400 focus:ring-1 focus:ring-green-400"
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    className="rounded-md px-3 py-1 text-sm transition hover:bg-red-600 hover:text-white"
                    onClick={() => removeColor(i)}
                  >
                    حذف
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-black transition hover:border-green-400 hover:bg-green-50"
                onClick={addColor}
              >
                <p>إضافة لون </p>
                <IoAddSharp />{' '}
              </Button>
            </div>

            <InputGroup
              label="مدة التوصيل او تفاصيله؟"
              icon={<LiaShippingFastSolid className="h-4 w-4 text-gray-500" />}
              type="text"
              value={newProduct.shippingType}
              onChange={value => setNewProduct({ ...newProduct, shippingType: value })}
              placeholder=""
              disabled={loading}
            />

            <InputGroup
              label="سياسة الاسترجاع"
              icon={<TbTruckReturn className="h-4 w-4 text-gray-500" />}
              type="text"
              value={newProduct.hasReturnPolicy}
              onChange={value => setNewProduct({ ...newProduct, hasReturnPolicy: value })}
              placeholder="شروط الاسترجاع"
              disabled={loading}
            />

            <CategoryDropdown
              categories={categories}
              value={newProduct.category as string}
              onChange={val => setNewProduct({ ...newProduct, category: val })}
              loading={loading}
            />

            <div dir="rtl" className="flex flex-col gap-1">
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <Package className="h-5 w-5 text-gray-500" />
                وصف المنتج
              </label>
              <textarea
                placeholder="مثلًا: تيشيرت عالي الجودة يناسب جميع الأذواق"
                value={newProduct.description || ''}
                onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                disabled={loading}
                rows={4}
                className="resize-y rounded-lg border px-3 py-2 placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400 focus:outline-none"
                dir="rtl"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="flex items-center gap-1 text-sm text-gray-700">
                <ImageIcon className="h-4 w-4 text-gray-500" />
                صورة المنتج <span className="text-red-500">*</span>
              </Label>
              <div className="relative cursor-pointer rounded-lg border-2 border-dashed border-gray-400 p-8 text-center transition hover:border-green-300 hover:bg-green-50">
                <label
                  htmlFor="upload-image"
                  className="flex cursor-pointer flex-col items-center justify-center gap-3"
                >
                  {newProduct.imagePreview ? (
                    <div className="flex flex-col items-center gap-3">
                      <img
                        src={newProduct.imagePreview}
                        alt="معاينة"
                        className="max-h-40 rounded-lg border border-gray-200 object-contain shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setNewProduct({ ...newProduct, imagePreview: '', imageFile: undefined })
                        }
                        className="mt-2 rounded bg-red-500 px-3 py-1 text-sm text-white transition hover:bg-red-600"
                        disabled={loading}
                      >
                        إزالة الصورة
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <TbUpload size={40} className="text-gray-400" />
                      <p className="text-gray-500">انقر لرفع الصورة أو اسحبها هنا</p>
                    </div>
                  )}
                </label>
                <input
                  id="upload-image"
                  type="file"
                  accept="image/*"
                  onChange={onNewImageChange}
                  className="hidden"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label className="flex items-center gap-1 text-sm text-gray-700">
                <ImageIcon className="h-4 w-4 text-gray-500" />
                صور المنتج الإضافية (اختياري)
              </Label>
              <div className="relative flex gap-3">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onGalleryChange}
                  className="relative hidden"
                  id="upload-gallery"
                />
                <label
                  htmlFor="upload-gallery"
                  className="mt-2 flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-8 text-sm text-gray-500 transition hover:border-green-500 hover:bg-green-50"
                >
                  <SlCloudUpload size={40} className="text-gray-400" />
                  <p className="text-center">رفع صور إضافية</p>
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              {galleryPreviews.map((src, i) => (
                <div
                  key={i}
                  className="relative h-28 w-28 overflow-hidden rounded-xl border-2 border-dashed border-gray-300 transition hover:border-green-500"
                >
                  <img src={src} alt={`gallery-${i}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setGalleryFiles(files => files.filter((_, idx) => idx !== i));
                      setGalleryPreviews(previews => previews.filter((_, idx) => idx !== i));
                    }}
                    className="absolute top-1 right-1 rounded-full bg-red-500 px-1 text-xs text-white shadow-md transition hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <Button
              onClick={addProduct}
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-black text-white hover:bg-gray-800"
            >
              <PlusCircle className="h-5 w-5" />
              {loading ? '...جاري الإضافة' : 'إضافة'}
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="mb-20 py-5" />
    </>
  );
}
interface InputGroupProps {
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

function InputGroup({
  label,
  required,
  placeholder,
  type = 'text',
  icon,
  value,
  onChange,
  disabled,
  onBlur,
}: InputGroupProps) {
  return (
    <div className="flex w-full flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
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
          className="rounded-md border-gray-300 pr-3 pl-10 focus:border-green-400 focus:ring-green-400"
        />
        {icon && (
          <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-700">{icon}</span>
        )}
      </div>
    </div>
  );
}
