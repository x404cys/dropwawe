'use client';
import { useLanguage } from '../../../context/LanguageContext';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/types/Products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
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
import {
  Tag,
  Boxes,
  DollarSign,
  Percent,
  Truck,
  RotateCcw,
  LayoutGrid,
  AlignLeft,
  ImagePlus,
  X,
  Save,
  ChevronRight,
  Trash2,
  Infinity as InfinityIcon,
  Palette,
  Ruler,
  Images,
  MessageCircle,
} from 'lucide-react';

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({
  label,
  icon: Icon,
  required,
  hint,
  children,
}: {
  label: string;
  icon: React.ElementType;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-muted-foreground flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase">
        <Icon className="h-3 w-3" />
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>
      {children}
      {hint && <p className="text-muted-foreground text-[11px]">{hint}</p>}
    </div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-border/60 bg-card overflow-hidden rounded-2xl border">
      <div className="border-border/50 bg-muted/30 border-b px-4 py-3">
        <p className="text-foreground text-sm font-bold">{title}</p>
      </div>
      <div className="space-y-4 p-4">{children}</div>
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface LocalColor {
  name: string;
  hex: string;
  stock: number;
}

interface LocalSize {
  size: string;
  stock: number;
}

interface LocalGalleryImage {
  id?: string;
  url?: string;
  file?: File;
  preview?: string;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EditProductPage() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<
    Partial<Product> & { imageFile?: File; imagePreview?: string }
  >({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [unlimited, setUnlimited] = useState(false);

  // New states for Variations & Extras
  const [colors, setColors] = useState<LocalColor[]>([]);
  const [sizes, setSizes] = useState<LocalSize[]>([]);
  const [gallery, setGallery] = useState<LocalGalleryImage[]>([]);
  const [telegramLink, setTelegramLink] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProduct({ ...data, imagePreview: data.image });
        setUnlimited(!!data.unlimited);

        // Load relations
        if (data.colors) {
          setColors(
            data.colors.map((c: any) => ({
              name: c.color,
              hex: c.hex ?? '#000000',
              stock: c.stock,
            }))
          );
        }
        if (data.sizes) {
          setSizes(data.sizes.map((s: any) => ({ size: s.size, stock: s.stock })));
        }
        if (data.images) {
          setGallery(
            data.images.map((img: any) => ({ id: img.id, url: img.url, preview: img.url }))
          );
        }
        if (data.subInfo) {
          setTelegramLink(data.subInfo.telegram || '');
        }
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
    } catch {
      toast.error('فشل في حذف المنتج');
    }
  };

  const saveEdit = async () => {
    setSaving(true);
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

      // Append new arrays
      formData.append('colors', JSON.stringify(colors));
      formData.append('sizes', JSON.stringify(sizes));
      if (telegramLink) formData.append('telegramLink', telegramLink);

      gallery.forEach(g => {
        if (g.file) {
          formData.append('gallery', g.file);
        }
      });

      const res = await fetch(`/api/products/${id}`, { method: 'PUT', body: formData });
      if (!res.ok) throw new Error();
      toast.success('تم تحديث المنتج بنجاح');
      router.back();
    } catch {
      toast.error('فشل في تحديث المنتج');
    } finally {
      setSaving(false);
    }
  };

  // Add Handlers
  const addColor = () => setColors([...colors, { name: '', hex: '#000000', stock: 0 }]);
  const updateColor = (index: number, field: keyof LocalColor, value: string | number) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setColors(newColors);
  };
  const removeColor = (index: number) => setColors(colors.filter((_, i) => i !== index));

  const addSize = () => setSizes([...sizes, { size: '', stock: 0 }]);
  const updateSize = (index: number, field: keyof LocalSize, value: string | number) => {
    const newSizes = [...sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setSizes(newSizes);
  };
  const removeSize = (index: number) => setSizes(sizes.filter((_, i) => i !== index));

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setGallery([...gallery, ...newImages]);
  };
  const removeGalleryImage = (index: number) => setGallery(gallery.filter((_, i) => i !== index));

  // Loading skeleton
  if (loading) {
    return (
      <div dir="rtl" className="mx-auto max-w-lg space-y-4 px-4 py-6">
        <Skeleton className="h-5 w-32 rounded-full" />
        <Skeleton className="h-7 w-48 rounded-xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen pb-32 md:pb-10">
      <div className="mx-auto max-w-lg space-y-4 px-4 py-6">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <button
              onClick={() => router.back()}
              className="text-muted-foreground hover:text-foreground mb-1 flex items-center gap-1 text-xs transition-colors"
            >
              <ChevronRight className="h-3.5 w-3.5" />
              {t.inventory?.title || 'المنتجات'}
            </button>
            <h1 className="text-foreground text-xl font-extrabold tracking-tight">
              {t.inventory?.editProduct || 'تعديل المنتج'}
            </h1>
          </div>

          {/* Delete */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10 flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
                {t.delete || 'حذف'}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent dir="rtl" className="max-w-sm rounded-3xl">
              <AlertDialogHeader className="text-right">
                <div className="mb-3 flex justify-center">
                  <div className="bg-destructive/10 flex h-14 w-14 items-center justify-center rounded-2xl">
                    <Trash2 className="text-destructive h-7 w-7" />
                  </div>
                </div>
                <AlertDialogTitle className="text-center text-xl font-bold">
                  تأكيد الحذف
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center leading-relaxed">
                  هل أنت متأكد أنك تريد حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-2 flex gap-2">
                <AlertDialogCancel className="h-11 flex-1 rounded-xl font-bold">
                  {t.cancel || 'إلغاء'}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive hover:bg-destructive/90 h-11 flex-1 rounded-xl font-bold"
                >
                  {t.delete || 'حذف'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>

        {/* ── Basic Info ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 }}
        >
          <Section title="المعلومات الأساسية">
            <Field label="اسم المنتج" icon={Tag} required>
              <Input
                value={product.name || ''}
                onChange={e => setProduct({ ...product, name: e.target.value })}
                placeholder="ادخل اسم المنتج"
                className="h-11 text-sm disabled:opacity-50"
                disabled={product.isFromSupplier}
              />
            </Field>

            <Field label={t.inventory?.description || 'الوصف'} icon={AlignLeft}>
              <Textarea
                value={product.description || ''}
                onChange={e => setProduct({ ...product, description: e.target.value })}
                placeholder="ادخل وصف المنتج"
                className="min-h-[80px] resize-none text-sm leading-relaxed disabled:opacity-50"
                disabled={product.isFromSupplier}
              />
            </Field>

            <Field label={t.inventory?.category || 'الفئة'} icon={LayoutGrid}>
              <Input
                value={product.category || ''}
                onChange={e => setProduct({ ...product, category: e.target.value })}
                placeholder={t.inventory?.category || 'الفئة'}
                className="h-11 text-sm disabled:opacity-50"
                disabled={product.isFromSupplier}
              />
            </Field>

            <Field label="رابط تيليجرام للمنتج" icon={MessageCircle}>
              <Input
                value={telegramLink}
                onChange={e => setTelegramLink(e.target.value)}
                placeholder="https://t.me/..."
                className="h-11 text-sm disabled:opacity-50"
                disabled={product.isFromSupplier}
              />
            </Field>
          </Section>
        </motion.div>

        {/* ── Pricing ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <Section title="السعر والمخزون المبدأي">
            <div className="grid grid-cols-2 gap-3">
              <Field label={t.inventory?.price || 'السعر'} icon={DollarSign} required>
                <Input
                  type="number"
                  value={product.price || ''}
                  onChange={e => setProduct({ ...product, price: Number(e.target.value) })}
                  placeholder="0"
                  className="h-11 text-sm disabled:opacity-50"
                  disabled={product.isFromSupplier}
                />
              </Field>

              <Field label="الخصم %" icon={Percent}>
                <Input
                  type="number"
                  value={product.discount || ''}
                  onChange={e => setProduct({ ...product, discount: Number(e.target.value) })}
                  placeholder="0"
                  className="h-11 text-sm disabled:opacity-50"
                  disabled={product.isFromSupplier}
                />
              </Field>
            </div>

            <Field
              label={t.inventory?.quantity || 'الكمية الافتراضية'}
              icon={Boxes}
              required
              hint={unlimited ? 'الكمية غير محدودة — لن تنفد المخزون' : undefined}
            >
              <Input
                type="number"
                value={unlimited ? '' : product.quantity || ''}
                onChange={e => setProduct({ ...product, quantity: Number(e.target.value) })}
                placeholder={unlimited ? '∞ غير محدود' : '0'}
                disabled={unlimited || product.isFromSupplier}
                className="h-11 text-sm disabled:opacity-50"
              />
            </Field>

            {/* Unlimited toggle */}
            <button
              type="button"
              disabled={product.isFromSupplier}
              onClick={() => {
                const next = !unlimited;
                setUnlimited(next);
                setProduct({
                  ...product,
                  unlimited: next,
                  quantity: next ? 0 : product.quantity || 0,
                });
              }}
              className={`flex w-full items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                unlimited
                  ? 'border-primary/30 bg-primary/10 text-primary'
                  : 'border-border/60 text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <InfinityIcon className="h-4 w-4" />
              جعل الكمية غير محدودة
              <span
                className={`relative mr-auto flex h-5 w-9 flex-shrink-0 rounded-full transition-colors ${
                  unlimited ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                    unlimited ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </span>
            </button>
          </Section>
        </motion.div>

        {/* ── Colors ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
        >
          <Section title="الألوان">
            <div className="space-y-3">
              <AnimatePresence>
                {colors.map((color, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-border/50 bg-muted/20 flex flex-col gap-2 rounded-xl border p-3 sm:flex-row sm:items-center"
                  >
                    <div className="flex flex-1 gap-2">
                      <Input
                        type="color"
                        value={color.hex}
                        disabled={product.isFromSupplier}
                        onChange={e => updateColor(index, 'hex', e.target.value)}
                        className={`h-10 w-14 rounded-lg p-1 ${product.isFromSupplier ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                      />
                      <Input
                        placeholder="اسم اللون (مثل: أحمر)"
                        value={color.name}
                        disabled={product.isFromSupplier}
                        onChange={e => updateColor(index, 'name', e.target.value)}
                        className="h-10 flex-1 text-sm disabled:opacity-50"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="الكمية"
                        value={color.stock}
                        disabled={product.isFromSupplier}
                        onChange={e => updateColor(index, 'stock', Number(e.target.value))}
                        className="h-10 w-24 text-sm disabled:opacity-50"
                      />
                      {!product.isFromSupplier && (
                        <Button
                          type="button"
                          variant="destructive"
                          className="h-10 shrink-0 px-3"
                          onClick={() => removeColor(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {!product.isFromSupplier && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-dashed text-sm"
                  onClick={addColor}
                >
                  <Palette className="ml-2 h-4 w-4" />
                  إضافة لون جديد
                </Button>
              )}
            </div>
          </Section>
        </motion.div>

        {/* ── Sizes ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Section title="المقاسات">
            <div className="space-y-3">
              <AnimatePresence>
                {sizes.map((size, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-border/50 bg-muted/20 flex items-center gap-2 rounded-xl border p-3"
                  >
                    <Input
                      placeholder="المقاس (مثل: XL)"
                      value={size.size}
                      disabled={product.isFromSupplier}
                      onChange={e => updateSize(index, 'size', e.target.value)}
                      className="h-10 flex-1 text-sm disabled:opacity-50"
                    />
                    <Input
                      type="number"
                      placeholder="الكمية"
                      value={size.stock}
                      disabled={product.isFromSupplier}
                      onChange={e => updateSize(index, 'stock', Number(e.target.value))}
                      className="h-10 w-24 text-sm disabled:opacity-50"
                    />
                    {!product.isFromSupplier && (
                      <Button
                        type="button"
                        variant="destructive"
                        className="h-10 shrink-0 px-3"
                        onClick={() => removeSize(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {!product.isFromSupplier && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-dashed text-sm"
                  onClick={addSize}
                >
                  <Ruler className="ml-2 h-4 w-4" />
                  إضافة مقاس جديد
                </Button>
              )}
            </div>
          </Section>
        </motion.div>

        {/* ── Shipping ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.17 }}
        >
          <Section title="الشحن والإرجاع">
            <div className="grid grid-cols-2 gap-3">
              <Field label="مدة التوصيل" icon={Truck}>
                <Input
                  value={product.shippingType || ''}
                  onChange={e => setProduct({ ...product, shippingType: e.target.value })}
                  placeholder="مثال: 3 أيام"
                  className="h-11 text-sm disabled:opacity-50"
                  disabled={product.isFromSupplier}
                />
              </Field>
              <Field label="سياسة الإرجاع" icon={RotateCcw}>
                <Input
                  value={product.hasReturnPolicy || ''}
                  onChange={e => setProduct({ ...product, hasReturnPolicy: e.target.value })}
                  placeholder="مثال: 7 أيام"
                  className="h-11 text-sm disabled:opacity-50"
                  disabled={product.isFromSupplier}
                />
              </Field>
            </div>
          </Section>
        </motion.div>

        {/* ── Image ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <Section title="صورة المنتج الرئيسية">
            <AnimatePresence mode="wait">
              {product.imagePreview ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="border-border/60 bg-muted relative overflow-hidden rounded-2xl border"
                >
                  <button
                    onClick={() =>
                      setProduct({ ...product, imageFile: undefined, imagePreview: undefined })
                    }
                    className="bg-destructive hover:bg-destructive/90 absolute top-2 left-2 z-10 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-md transition-colors"
                    disabled={product.isFromSupplier}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <img
                    src={product.imagePreview}
                    alt="معاينة الصورة"
                    className="h-56 w-full object-contain p-2"
                  />
                </motion.div>
              ) : (
                <motion.label
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  htmlFor="file-upload"
                  className={`border-border/60 bg-muted/30 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 transition-colors ${
                    product.isFromSupplier
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:border-primary/40 hover:bg-primary/5 cursor-pointer'
                  }`}
                >
                  <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-2xl">
                    <ImagePlus className="text-primary h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-foreground text-sm font-semibold">اختر صورة للمنتج</p>
                    <p className="text-muted-foreground mt-0.5 text-[11px]">
                      PNG, JPG, WEBP حتى 5MB
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={product.isFromSupplier}
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
                </motion.label>
              )}
            </AnimatePresence>
          </Section>
        </motion.div>

        {/* ── Gallery Images ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Section title="صور المعرض الإضافية">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <AnimatePresence>
                {gallery.map((img, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="border-border/50 bg-muted relative aspect-square overflow-hidden rounded-xl border"
                  >
                    {!product.isFromSupplier && (
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="bg-destructive hover:bg-destructive/90 absolute top-1 left-1 z-10 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-md transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                    <img
                      src={img.preview}
                      alt="Gallery item"
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {!product.isFromSupplier && (
                <label className="border-border/60 bg-muted/30 hover:border-primary/40 hover:bg-primary/5 flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                    <Images className="text-primary h-4 w-4" />
                  </div>
                  <span className="text-muted-foreground text-[12px] font-medium">إضافة صور</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleGalleryUpload}
                  />
                </label>
              )}
            </div>
          </Section>
        </motion.div>
      </div>

      {!product.isFromSupplier && (
        <div className="border-border/60 right-0 bottom-0 left-0 z-30 flex gap-3 border-t px-4 py-3 backdrop-blur-sm md:hidden">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="h-12 flex-1 rounded-xl font-bold"
          >
            <X className="mr-1.5 h-4 w-4" />
            {t.cancel || 'إلغاء'}
          </Button>
          <Button
            onClick={saveEdit}
            disabled={saving}
            className="h-12 flex-1 rounded-xl font-bold transition-all active:scale-[0.98]"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                جاري الحفظ...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                حفظ التعديلات
              </span>
            )}
          </Button>
        </div>
      )}

      {/* ── Desktop action buttons ── */}
      {!product.isFromSupplier && (
        <div dir="rtl" className="mx-auto hidden max-w-lg gap-3 px-4 pb-10 md:flex">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="h-12 flex-1 rounded-xl font-bold"
          >
            <X className="mr-1.5 h-4 w-4" />
            {t.cancel || 'إلغاء'}
          </Button>
          <Button
            onClick={saveEdit}
            disabled={saving}
            className="h-12 flex-1 rounded-xl font-bold transition-all active:scale-[0.98]"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                جاري الحفظ...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                حفظ التعديلات
              </span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
