'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Ticket,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  CloudSnow,
} from 'lucide-react';
import { MdCancel } from 'react-icons/md';
import { toast } from 'sonner';
import { useStoreProvider } from '../context/StoreContext';
export type CouponScope = 'GLOBAL' | 'STORE' | 'PRODUCT';
export type CouponType = 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING';

export interface Coupon {
  id: string;

  code: string;

  scope: CouponScope;

  type: CouponType;

  value: number;

  storeId: string | null;
  productId: string | null;

  minOrder: number | null;
  maxDiscount: number | null;

  maxUsage: number | null;
  perUser: number | null;

  startsAt: string;
  expiresAt: string;

  isActive: boolean;

  usedCount: number;

  createdAt: string;
}
type CouponForm = {
  code: string;
  type: string;
  scope: string;

  storeId: string;
  productId: string;

  value: string;
  minOrder: string;
  maxDiscount: string;
  usageLimit: string;
  expiresAt: string;
};
const initialForm: CouponForm = {
  code: '',
  type: 'PERCENTAGE',
  scope: 'GLOBAL',

  storeId: '',
  productId: '',

  value: '',
  minOrder: '',
  maxDiscount: '',
  usageLimit: '',
  expiresAt: '',
};

export default function CouponCreatePage() {
  const [showForm, setShowForm] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState<{ id: string; name: string }[]>([]);
  const [products, setProducts] = useState<
    { id: string; name: string; image: string; price: string }[]
  >([]);
  const { currentStore } = useStoreProvider();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [scope, setScop] = useState('');
  const [form, setForm] = useState<CouponForm>(initialForm);
  const [openDailog, setOpenDailog] = useState(false);
  const isShipping = form.type === 'FREE_SHIPPING';

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const res = await fetch(`/api/coupons/${currentStore?.id}`);
    const data = await res.json();

    if (Array.isArray(data)) {
      setCoupons(data);
    } else if (Array.isArray(data.coupons)) {
      setCoupons(data.coupons);
    } else if (Array.isArray(data.data)) {
      setCoupons(data.data);
    } else {
      setCoupons([]);
    }
  };

  const handleChange = (key: string, val: string) => {
    setForm(s => ({ ...s, [key]: val }));
  };
  useEffect(() => {
    fetchCoupons();
    fetchStores();
    fetchProducts();
  }, []);

  const fetchStores = async () => {
    const res = await fetch('/api/stores');
    const data = await res.json();
    setStores(data);
  };
  const deleteCoupon = async (id: string) => {
    try {
      const res = await fetch(`/api/coupons/delete-coupon/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('تم حذف الكوبون');
        setCoupons(prev => prev.filter(c => c.id !== id));
      } else {
        const data = await res.json();
        toast.error(data.error || 'حدث خطأ اثناء الحذف');
      }
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ في الشبكة');
    }
  };

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };
  const validateForm = () => {
    if (!form.code.trim()) return 'أدخل كود الكوبون';
    if (!form.value || Number(form.value) <= 0) return 'أدخل قيمة صحيحة';

    if (form.scope === 'STORE' && !form.storeId) return 'يجب اختيار متجر';

    if (form.scope === 'PRODUCT' && !form.productId) return 'يجب اختيار منتج';

    if (!form.expiresAt) return 'حدد تاريخ الانتهاء';

    return null;
  };

  const submit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/coupons/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'حدث خطأ');
        return;
      }

      await fetchCoupons();
      setSuccess('تم إنشاء الكوبون بنجاح ✓');
      setShowForm(false);

      setForm(initialForm);
    } catch {
      setError('حدث خطأ عند إنشاء الكوبون');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen border p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl"
      >
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <Card className="mb-6 border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Ticket className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">الكوبونات</CardTitle>
                  <p className="text-xs text-slate-500">{coupons.length} كوبون مضاف</p>
                </div>
              </div>
              <Button
                onClick={() => setShowForm(!showForm)}
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                {showForm ? (
                  <div className="flex items-center gap-1">
                    <MdCancel className="h-4 w-4" />
                    الغاء الاضافة{' '}
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    {' '}
                    <Plus className="h-4 w-4" />
                    إضافة كوبون
                  </div>
                )}
              </Button>
            </div>
          </CardHeader>

          {!showForm && (
            <CardContent>
              {coupons.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-slate-200 py-8 text-center">
                  <Ticket className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                  <p className="text-sm text-slate-500">لا توجد كوبونات مضافة بعد</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {coupons.map(c => {
                    const isExpired = new Date(c.expiresAt) < new Date();
                    const daysLeft = Math.ceil(
                      (new Date(c.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                    );

                    return (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-lg border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-slate-900">{c.code}</p>

                              {!c.isActive && (
                                <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">
                                  غير مفعّل
                                </span>
                              )}

                              {isExpired && (
                                <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] text-red-600">
                                  منتهي
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-500">
                              {c.type === 'PERCENTAGE'
                                ? `${c.value}% خصم`
                                : `${c.value.toLocaleString()} IQD خصم`}
                            </p>

                            <p
                              className={`text-[11px] ${
                                daysLeft <= 3 ? 'text-red-600' : 'text-slate-500'
                              }`}
                            >
                              ينتهي: {new Date(c.expiresAt).toLocaleDateString('ar')}
                              {!isExpired && ` (${daysLeft} يوم)`}
                            </p>
                          </div>

                          <button
                            onClick={() => deleteCoupon(c.id)}
                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                            title="حذف الكوبون"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          )}
        </Card>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">كوبون جديد</CardTitle>
                  <p className="mt-1 text-xs text-slate-500">أضف كوبون خصم جديد بسهولة</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-xs font-semibold text-slate-700">كود الكوبون</Label>
                      <Input
                        placeholder="مثل: SUMMER50"
                        value={form.code}
                        onChange={e => handleChange('code', e.target.value.toUpperCase())}
                        className="mt-1"
                      />
                    </div>

                    <div className="w-full">
                      <Label className="w-full text-xs font-semibold text-slate-700">
                        نوع الخصم
                      </Label>
                      <Select value={form.type} onValueChange={v => handleChange('type', v)}>
                        <SelectTrigger className="mt-1 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent dir="rtl">
                          <SelectItem value="PERCENTAGE">نسبة مئوية %</SelectItem>
                          <SelectItem value="FIXED">مبلغ ثابت</SelectItem>
                          <SelectItem value="FREE_SHIPPING">خصم على التوصيل</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2">
                      <Label>نطاق الكوبون</Label>

                      <Select
                        value={form.scope}
                        onValueChange={v => {
                          handleChange('scope', v);
                          handleChange('storeId', '');
                          handleChange('productId', '');
                        }}
                      >
                        <SelectTrigger className="mt-1 w-full">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent dir="rtl">
                          <SelectItem value="GLOBAL"> عام</SelectItem>
                          <SelectItem value="STORE"> متجر</SelectItem>
                          <SelectItem value="PRODUCT"> منتج</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {form.scope === 'STORE' && (
                      <div className="md:col-span-2">
                        <Label>اختر المتجر</Label>

                        <Select
                          value={form.storeId}
                          onValueChange={v => handleChange('storeId', v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المتجر" />
                          </SelectTrigger>

                          <SelectContent dir="rtl">
                            {stores.map(s => (
                              <SelectItem key={s.id} value={s.id}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {form.scope === 'PRODUCT' && (
                      <div className="md:col-span-2">
                        <Label>اختر المنتج</Label>

                        <Dialog open={openDailog} onOpenChange={setOpenDailog}>
                          <DialogTrigger asChild>
                            <Button variant={'outline'} className="mt-1 w-full">
                              {form.productId
                                ? products.find(p => p.id === form.productId)?.name
                                : 'اختر المنتج'}
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="max-w-2xl">
                            <DialogHeader className="flex items-center justify-between">
                              <DialogTitle>اختر المنتج</DialogTitle>
                            </DialogHeader>

                            <div className="mt-4 grid max-h-96 grid-cols-2 gap-4 overflow-y-auto md:grid-cols-3">
                              {products.map(p => (
                                <div
                                  key={p.id}
                                  onClick={() => {
                                    handleChange('productId', p.id);
                                    setOpenDailog(false);
                                  }}
                                  className={`flex cursor-pointer flex-col items-center rounded-lg border p-3 text-center transition hover:shadow-md ${
                                    form.productId === p.id
                                      ? 'border-blue-500 bg-blue-50'
                                      : 'border-gray-200'
                                  }`}
                                >
                                  {p.image && (
                                    <img
                                      src={p.image}
                                      alt={p.name}
                                      className="mb-2 h-24 w-24 rounded object-cover"
                                    />
                                  )}
                                  <p className="mb-1 text-sm font-medium">{p.name}</p>
                                  {p.price && (
                                    <p className="text-xs text-gray-500">
                                      {p.price.toLocaleString()} IQD
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                            <DialogClose asChild>
                              <Button
                                variant="outline"
                                className="cursor-pointer text-red-400 hover:text-gray-600"
                              >
                                إغلاق ✖
                              </Button>
                            </DialogClose>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}

                    <div>
                      <Label className="text-xs font-semibold text-slate-700">قيمة الخصم</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={form.value}
                        onChange={e => handleChange('value', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-semibold text-slate-700">
                        الحد الأدنى للطلب
                      </Label>
                      <Input
                        type="number"
                        placeholder="اختياري"
                        value={form.minOrder}
                        onChange={e => handleChange('minOrder', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-semibold text-slate-700">أقصى خصم</Label>
                      <Input
                        type="number"
                        placeholder="اختياري"
                        value={form.maxDiscount}
                        onChange={e => handleChange('maxDiscount', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-semibold text-slate-700">
                        عدد مرات الاستخدام
                      </Label>
                      <Input
                        type="number"
                        placeholder="اختياري"
                        value={form.usageLimit}
                        onChange={e => handleChange('usageLimit', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label className="text-xs font-semibold text-slate-700">تاريخ الانتهاء</Label>
                      <Input
                        type="date"
                        value={form.expiresAt}
                        onChange={e => handleChange('expiresAt', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={submit}
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? 'جاري الحفظ...' : 'حفظ الكوبون'}
                    </Button>
                    <Button onClick={() => setShowForm(false)} variant="outline" className="px-6">
                      إلغاء
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
