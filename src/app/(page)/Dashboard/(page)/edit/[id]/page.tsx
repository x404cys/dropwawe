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
  Infinity,
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
      <label className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wide">
        <Icon className="w-3 h-3" />
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
        <p className="text-sm font-bold text-foreground">{title}</p>
      </div>
      <div className="p-4 space-y-4">{children}</div>
    </div>
  );
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProduct({ ...data, imagePreview: data.image });
        setUnlimited(!!data.unlimited);
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

  // Loading skeleton
  if (loading) {
    return (
      <div dir="rtl" className="mx-auto max-w-lg px-4 py-6 space-y-4">
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
      <div className="mx-auto max-w-lg px-4 py-6 space-y-4">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-1"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              {t.inventory?.title || 'المنتجات'}
            </button>
            <h1 className="text-xl font-extrabold text-foreground tracking-tight">
              {t.inventory?.editProduct || 'تعديل المنتج'}
            </h1>
          </div>

          {/* Delete */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
                {t.delete || 'حذف'}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent dir="rtl" className="max-w-sm rounded-3xl">
              <AlertDialogHeader className="text-right">
                <div className="flex justify-center mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
                    <Trash2 className="w-7 h-7 text-destructive" />
                  </div>
                </div>
                <AlertDialogTitle className="text-center text-xl font-bold">تأكيد الحذف</AlertDialogTitle>
                <AlertDialogDescription className="text-center leading-relaxed">
                  هل أنت متأكد أنك تريد حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex gap-2 mt-2">
                <AlertDialogCancel className="flex-1 h-11 rounded-xl font-bold">
                  {t.cancel || 'إلغاء'}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="flex-1 h-11 rounded-xl font-bold bg-destructive hover:bg-destructive/90"
                >
                  {t.delete || 'حذف'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>

        {/* ── Basic Info ── */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}>
          <Section title="المعلومات الأساسية">
            <Field label="اسم المنتج" icon={Tag} required>
              <Input
                value={product.name || ''}
                onChange={e => setProduct({ ...product, name: e.target.value })}
                placeholder="ادخل اسم المنتج"
                className="h-11 text-sm"
              />
            </Field>

            <Field label={t.inventory?.description || 'الوصف'} icon={AlignLeft}>
              <Textarea
                value={product.description || ''}
                onChange={e => setProduct({ ...product, description: e.target.value })}
                placeholder="ادخل وصف المنتج"
                className="min-h-[80px] resize-none text-sm leading-relaxed"
              />
            </Field>

            <Field label={t.inventory?.category || 'الفئة'} icon={LayoutGrid}>
              <Input
                value={product.category || ''}
                onChange={e => setProduct({ ...product, category: e.target.value })}
                placeholder={t.inventory?.category || 'الفئة'}
                className="h-11 text-sm"
              />
            </Field>
          </Section>
        </motion.div>

        {/* ── Pricing ── */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <Section title="السعر والمخزون">
            <div className="grid grid-cols-2 gap-3">
              <Field label={t.inventory?.price || 'السعر'} icon={DollarSign} required>
                <Input
                  type="number"
                  value={product.price || ''}
                  onChange={e => setProduct({ ...product, price: Number(e.target.value) })}
                  placeholder="0"
                  className="h-11 text-sm"
                />
              </Field>

              <Field label="الخصم %" icon={Percent}>
                <Input
                  type="number"
                  value={product.discount || ''}
                  onChange={e => setProduct({ ...product, discount: Number(e.target.value) })}
                  placeholder="0"
                  className="h-11 text-sm"
                />
              </Field>
            </div>

            <Field
              label={t.inventory?.quantity || 'الكمية'}
              icon={Boxes}
              required
              hint={unlimited ? 'الكمية غير محدودة — لن تنفد المخزون' : undefined}
            >
              <Input
                type="number"
                value={unlimited ? '' : product.quantity || ''}
                onChange={e => setProduct({ ...product, quantity: Number(e.target.value) })}
                placeholder={unlimited ? '∞ غير محدود' : '0'}
                disabled={unlimited}
                className="h-11 text-sm"
              />
            </Field>

            {/* Unlimited toggle */}
            <button
              type="button"
              onClick={() => {
                const next = !unlimited;
                setUnlimited(next);
                setProduct({ ...product, unlimited: next, quantity: next ? 0 : product.quantity || 0 });
              }}
              className={`flex items-center gap-2.5 w-full rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                unlimited
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'border-border/60 text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <Infinity className="w-4 h-4" />
              جعل الكمية غير محدودة
              <span
                className={`mr-auto w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${
                  unlimited ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                    unlimited ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </span>
            </button>
          </Section>
        </motion.div>

        {/* ── Shipping ── */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}>
          <Section title="الشحن والإرجاع">
            <div className="grid grid-cols-2 gap-3">
              <Field label="مدة التوصيل" icon={Truck}>
                <Input
                  value={product.shippingType || ''}
                  onChange={e => setProduct({ ...product, shippingType: e.target.value })}
                  placeholder="مثال: 3 أيام"
                  className="h-11 text-sm"
                />
              </Field>
              <Field label="سياسة الإرجاع" icon={RotateCcw}>
                <Input
                  value={product.hasReturnPolicy || ''}
                  onChange={e => setProduct({ ...product, hasReturnPolicy: e.target.value })}
                  placeholder="مثال: 7 أيام"
                  className="h-11 text-sm"
                />
              </Field>
            </div>
          </Section>
        </motion.div>

        {/* ── Image ── */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
          <Section title="صورة المنتج">
            <AnimatePresence mode="wait">
              {product.imagePreview ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative rounded-2xl overflow-hidden border border-border/60 bg-muted"
                >
                  <button
                    onClick={() => setProduct({ ...product, imageFile: undefined, imagePreview: undefined })}
                    className="absolute top-2 left-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-white shadow-md hover:bg-destructive/90 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <img
                    src={product.imagePreview}
                    alt="معاينة الصورة"
                    className="w-full h-56 object-contain p-2"
                  />
                </motion.div>
              ) : (
                <motion.label
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/60 bg-muted/30 p-10 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <ImagePlus className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">اختر صورة للمنتج</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">PNG, JPG, WEBP حتى 5MB</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
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
                </motion.label>
              )}
            </AnimatePresence>
          </Section>
        </motion.div>

      </div>

      {/* ── Sticky action bar (mobile) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border/60 bg-card/90 backdrop-blur-sm px-4 py-3 flex gap-3 md:hidden">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex-1 h-12 rounded-xl font-bold"
        >
          <X className="w-4 h-4 mr-1.5" />
          {t.cancel || 'إلغاء'}
        </Button>
        <Button
          onClick={saveEdit}
          disabled={saving}
          className="flex-1 h-12 rounded-xl font-bold active:scale-[0.98] transition-all"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              جاري الحفظ...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              حفظ التعديلات
            </span>
          )}
        </Button>
      </div>

      {/* ── Desktop action buttons ── */}
      <div dir="rtl" className="hidden md:flex mx-auto max-w-lg px-4 pb-10 gap-3">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex-1 h-12 rounded-xl font-bold"
        >
          <X className="w-4 h-4 mr-1.5" />
          {t.cancel || 'إلغاء'}
        </Button>
        <Button
          onClick={saveEdit}
          disabled={saving}
          className="flex-1 h-12 rounded-xl font-bold active:scale-[0.98] transition-all"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              جاري الحفظ...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              حفظ التعديلات
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
