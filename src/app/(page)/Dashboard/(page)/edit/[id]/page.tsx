'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/types/Products';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';
import { motion } from 'framer-motion';
import { MdSave, MdClose } from 'react-icons/md';
import {
  FaTag,
  FaBox,
  FaPercent,
  FaTruck,
  FaUndo,
  FaList,
  FaAlignLeft,
  FaImage,
} from 'react-icons/fa';
import { toast } from 'sonner';
import { CiEdit } from 'react-icons/ci';
import CustomInput from '../../../_components/InputStyle';
import { TbPackageOff } from 'react-icons/tb';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<
    Partial<Product> & { imageFile?: File; imagePreview?: string }
  >({});
  const [loading, setLoading] = useState(true);
  const [unlimited, setUnlimited] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProduct({ ...data, imagePreview: data.image });
      } catch {
        toast.error('فشل في جلب بيانات المنتج');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });

      if (!res.ok) throw new Error();

      toast.success('تم حذف المنتج بنجاح');
      router.push('/Dashboard');
    } catch (error) {
      toast.error('فشل في حذف المنتج');
    }
  };

  const saveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', product.name ?? '');
      formData.append('price', product.price?.toString() ?? '');
      formData.append('quantity', product.quantity?.toString() ?? '');
      if (product.discount !== undefined) formData.append('discount', product.discount.toString());
      if (product.shippingType) formData.append('shippingType', product.shippingType);
      if (product.hasReturnPolicy) formData.append('hasReturnPolicy', product.hasReturnPolicy);
      if (product.category) formData.append('category', product.category);
      if (product.description) formData.append('description', product.description);
      if (product.imageFile) formData.append('image', product.imageFile);
      formData.append('unlimited', String(product.unlimited));
      const res = await fetch(`/api/products/${id}`, { method: 'PUT', body: formData });
      if (!res.ok) throw new Error();
      toast.success('تم تحديث المنتج بنجاح');
      router.back();
    } catch {
      toast.error('فشل في تحديث المنتج');
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <div
        dir="rtl"
        className="mx-auto max-w-3xl bg-white py-4 text-black md:rounded-lg md:border md:px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-2 flex items-center justify-between border-b py-2">
            <h2 className="text-gray-900">تعديل المنتج</h2>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="flex cursor-pointer items-center gap-2 rounded-md border-2 px-2 py-0.5 text-red-500 hover:bg-gray-200">
                  <TbPackageOff />
                  <span>حذف</span>
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent dir="rtl">
                <AlertDialogHeader>
                  <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                  <AlertDialogDescription className="text-right leading-relaxed">
                    هل أنت متأكد أنك تريد حذف هذا المنتج؟ هذا الإجراء لا يمكن التراجع عنه.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex-row-reverse gap-2">
                  <AlertDialogAction
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={handleDelete}
                  >
                    حذف
                  </AlertDialogAction>
                  <AlertDialogCancel className="border">إلغاء</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="space-y-8">
            <CustomInput
              label="اسم المنتج"
              required
              icon={<FaTag />}
              value={product.name || ''}
              onChange={e => setProduct({ ...product, name: e.target.value })}
              placeholder="ادخل اسم المنتج"
            />

            <div className="space-y-2">
              <CustomInput
                label="الكمية"
                required
                type="number"
                disabled={unlimited}
                icon={<FaBox />}
                value={unlimited ? 'غير محدود' : product.quantity || ''}
                onChange={e =>
                  setProduct({
                    ...product,
                    quantity: Number(e.target.value),
                  })
                }
                placeholder="الكمية غير محدودة"
              />

              <label className="flex cursor-pointer items-center gap-2 text-sm select-none">
                <input
                  type="checkbox"
                  checked={unlimited}
                  onChange={e => {
                    setUnlimited(e.target.checked);
                    setProduct({
                      ...product,
                      unlimited: e.target.checked,
                      quantity: e.target.checked ? 0 : product.quantity || 0,
                    });
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>جعل الكمية غير محدودة</span>
              </label>
            </div>

            <hr />
            <CustomInput
              label="الخصم"
              type="number"
              icon={<FaPercent />}
              value={product.discount || ''}
              onChange={e => setProduct({ ...product, discount: Number(e.target.value) })}
              placeholder="الخصم"
            />

            <div className="grid grid-cols-1 gap-6 pt-4 sm:grid-cols-2">
              <CustomInput
                label="مدة التوصيل"
                icon={<FaTruck />}
                value={product.shippingType || ''}
                onChange={e => setProduct({ ...product, shippingType: e.target.value })}
                placeholder="مثال: 3 أيام"
              />
              <CustomInput
                label="سياسة الاسترجاع"
                icon={<FaUndo />}
                value={product.hasReturnPolicy || ''}
                onChange={e => setProduct({ ...product, hasReturnPolicy: e.target.value })}
                placeholder="مثال: 7 أيام"
              />
            </div>

            <CustomInput
              label="الصنف"
              icon={<FaList />}
              value={product.category || ''}
              onChange={e => setProduct({ ...product, category: e.target.value })}
              placeholder="الصنف"
            />

            <CustomInput
              label="الوصف"
              icon={<FaAlignLeft />}
              value={product.description || ''}
              onChange={e => setProduct({ ...product, description: e.target.value })}
              placeholder="ادخل وصف المنتج"
            />

            <div className="space-y-3 pt-4">
              <label className="flex items-center gap-2 text-lg font-semibold">
                <FaImage /> الصورة
              </label>
              <label
                htmlFor="file-upload"
                className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-black bg-gray-50 p-6 text-black transition hover:bg-gray-100"
              >
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setProduct({
                      ...product,
                      imageFile: file,
                      imagePreview: URL.createObjectURL(file),
                    });
                  }}
                />
                <span className="text-sm font-medium">اختر صورة للمنتج</span>
              </label>

              {product.imagePreview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="relative mt-3 overflow-hidden rounded-lg border border-black bg-white shadow-sm"
                >
                  <button
                    onClick={() =>
                      setProduct({ ...product, imageFile: undefined, imagePreview: undefined })
                    }
                    className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
                  >
                    <MdClose size={18} />
                  </button>
                  <motion.img
                    src={product.imagePreview}
                    alt="Preview"
                    className="h-56 w-full object-contain p-2"
                  />
                </motion.div>
              )}
            </div>
          </div>

          <div className="mt-10 flex flex-col-reverse gap-4 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex w-full items-center justify-center gap-2 border-black text-black hover:bg-gray-100 sm:w-1/2"
            >
              <MdClose size={22} /> إلغاء
            </Button>
            <Button
              onClick={saveEdit}
              className="flex w-full items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 sm:w-1/2"
            >
              <MdSave size={22} /> حفظ التعديلات
            </Button>
          </div>
        </motion.div>
        <div className="mb-20"></div>
      </div>
    </>
  );
}
