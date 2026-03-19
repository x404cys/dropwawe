'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Ticket, Copy, Trash2, Percent, Hash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useStoreProvider } from '../../../../context/StoreContext';
import SettingsPageHeader from '../../_components/settings-page-header';

interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING';
  value: number;
  minOrder: number | null;
  maxUsage: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: string;
}

export default function CouponSettingsPage() {
  const { currentStore } = useStoreProvider();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    value: '',
    minOrder: '',
    maxUsage: '100',
    expiresAt: '',
  });

  useEffect(() => {
    if (currentStore?.id) fetchCoupons();
  }, [currentStore?.id]);

  const fetchCoupons = async () => {
    try {
      const res = await fetch(`/api/coupons/${currentStore?.id}`);
      const data = await res.json();
      if (Array.isArray(data)) setCoupons(data);
      else if (Array.isArray(data.coupons)) setCoupons(data.coupons);
      else if (Array.isArray(data.data)) setCoupons(data.data);
      else setCoupons([]);
    } catch (e) {
      console.error(e);
      toast.error('حدث خطأ أثناء تحميل الكوبونات');
    } finally {
      setIsFetching(false);
    }
  };

  const filtered = coupons.filter(
    c => !search || c.code.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCoupon = async (id: string) => {
    const res = await fetch(`/api/coupons/toggle/${id}`, { method: 'POST' });
    setCoupons(prev => prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
    if (res.ok) {
      toast.success('تم تحديث حالة الكوبون');
      fetchCoupons();
    }
    if (!res.ok) toast.error('فشل في تحديث حالة الكوبون');
  };

  const deleteCoupon = async (id: string) => {
    const original = [...coupons];
    setCoupons(prev => prev.filter(c => c.id !== id));
    try {
      const res = await fetch(`/api/coupons/delete-coupon/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('تم حذف الكوبون بنجاح');
    } catch {
      toast.error('فشل في حذف الكوبون');
      setCoupons(original);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('تم نسخ الكود');
  };

  const addCoupon = async () => {
    if (!newCoupon.code || !newCoupon.value || !newCoupon.expiresAt) {
      toast.error('يرجى تعبئة الحقول المطلوبة (الكود، القيمة، تاريخ الانتهاء)');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        code: newCoupon.code,
        type: newCoupon.type,
        value: newCoupon.value,
        minOrder: newCoupon.minOrder || '0',
        usageLimit: newCoupon.maxUsage || null,
        expiresAt: newCoupon.expiresAt,
        scope: 'GLOBAL',
      };

      const res = await fetch('/api/coupons/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'حدث خطأ عند إنشاء الكوبون');

      toast.success('تم إنشاء الكوبون بنجاح');
      fetchCoupons();
      setNewCoupon({
        code: '',
        type: 'PERCENTAGE',
        value: '',
        minOrder: '',
        maxUsage: '100',
        expiresAt: '',
      });
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message || 'حدث خطأ عند إنشاء الكوبون');
    } finally {
      setLoading(false);
    }
  };

  const headerActions = (
    <Button
      onClick={() => setShowForm(!showForm)}
      size="sm"
      className="bg-primary hover:bg-primary/90 h-8 gap-1.5 text-xs"
    >
      <Plus className="h-3.5 w-3.5" />
      إنشاء كود
    </Button>
  );

  return (
    <div dir="rtl" className="bg-background min-h-screen pb-28">
      <SettingsPageHeader
        title="أكواد الخصم"
        subtitle={isFetching ? 'جاري التحميل...' : `${coupons.length} كود مضاف`}
        action={headerActions}
      />

      <main className="mx-auto max-w-xl space-y-4 px-4 pt-4">
        {showForm && (
          <div className="bg-card border-border animate-in slide-in-from-top-2 space-y-4 rounded-xl border p-4 shadow-sm">
            <h3 className="text-foreground text-sm font-semibold">كود خصم جديد</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-muted-foreground mb-1 block text-xs">الكود</label>
                <Input
                  value={newCoupon.code}
                  onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="مثال: WELCOME10"
                  className="h-10 text-sm uppercase"
                  dir="ltr"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-muted-foreground mb-1 block text-xs">النوع</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewCoupon({ ...newCoupon, type: 'PERCENTAGE' })}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2.5 text-xs font-medium transition-colors ${
                      newCoupon.type === 'PERCENTAGE'
                        ? 'bg-primary/10 text-primary border-primary ring-primary/20 ring-1'
                        : 'bg-card text-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    <Percent className="h-3.5 w-3.5" /> نسبة
                  </button>
                  <button
                    onClick={() => setNewCoupon({ ...newCoupon, type: 'FIXED' })}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2.5 text-xs font-medium transition-colors ${
                      newCoupon.type === 'FIXED'
                        ? 'bg-primary/10 text-primary border-primary ring-primary/20 ring-1'
                        : 'bg-card text-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    <Hash className="h-3.5 w-3.5" /> مبلغ ثابت
                  </button>
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-muted-foreground mb-1 block text-xs">
                  القيمة {newCoupon.type === 'PERCENTAGE' ? '(%)' : '(د.ع)'}
                </label>
                <Input
                  type="number"
                  value={newCoupon.value}
                  onChange={e => setNewCoupon({ ...newCoupon, value: e.target.value })}
                  className="h-10 text-sm"
                />
              </div>
              <div>
                <label className="text-muted-foreground mb-1 block text-xs">
                  حد أدنى للطلب (د.ع)
                </label>
                <Input
                  type="number"
                  value={newCoupon.minOrder}
                  onChange={e => setNewCoupon({ ...newCoupon, minOrder: e.target.value })}
                  placeholder="إختياري"
                  className="h-10 text-sm"
                />
              </div>
              <div>
                <label className="text-muted-foreground mb-1 block text-xs">عدد الاستخدامات</label>
                <Input
                  type="number"
                  value={newCoupon.maxUsage}
                  onChange={e => setNewCoupon({ ...newCoupon, maxUsage: e.target.value })}
                  placeholder="إختياري"
                  className="h-10 text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="text-muted-foreground mb-1 block text-xs">تاريخ الانتهاء</label>
                <Input
                  type="date"
                  value={newCoupon.expiresAt}
                  onChange={e => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
                  className="h-10 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={addCoupon}
                disabled={loading}
                size="sm"
                className="bg-primary hover:bg-primary/90 flex-1"
              >
                {loading ? 'جاري الإنشاء...' : 'إنشاء'}
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline" size="sm">
                إلغاء
              </Button>
            </div>
          </div>
        )}

        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث عن كود..."
            className="bg-card border-border h-10 pr-10 text-sm"
          />
        </div>

        <div className="space-y-3">
          {isFetching ? (
            <div className="text-muted-foreground flex flex-col items-center justify-center py-16">
              <Ticket className="mb-3 h-10 w-10 animate-pulse opacity-20" />
              <p className="animate-pulse text-sm font-medium">جاري التحميل...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-muted-foreground flex flex-col items-center justify-center py-16">
              <Ticket className="mb-3 h-10 w-10 opacity-20" />
              <p className="text-sm font-medium">لا توجد أكواد</p>
            </div>
          ) : (
            filtered.map(coupon => {
              const maxUses = coupon.maxUsage || 1000;
              const used = coupon.usedCount || 0;
              const percentageUsed = Math.min((used / maxUses) * 100, 100);

              return (
                <div
                  key={coupon.id}
                  className="bg-card border-border hover:border-primary/30 rounded-xl border p-4 shadow-sm transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`border-border/50 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border ${
                          coupon.isActive ? 'bg-primary/10' : 'bg-muted'
                        }`}
                      >
                        <Ticket
                          className={`h-4 w-4 ${coupon.isActive ? 'text-primary' : 'text-muted-foreground'}`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-foreground font-mono text-sm font-bold" dir="ltr">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => copyCode(coupon.code)}
                            className="text-muted-foreground hover:text-primary p-1 transition-colors"
                            title="نسخ الكود"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-muted-foreground mt-0.5 block text-[11px]">
                          {coupon.type === 'PERCENTAGE'
                            ? `${coupon.value}% خصم`
                            : `${Number(coupon.value).toLocaleString('ar-IQ')} د.ع خصم`}
                          {coupon.minOrder
                            ? ` • حد أدنى ${Number(coupon.minOrder).toLocaleString('ar-IQ')}`
                            : ''}
                        </span>
                      </div>
                    </div>
                    <Switch
                      checked={coupon.isActive}
                      onCheckedChange={() => toggleCoupon(coupon.id)}
                    />
                  </div>
                  <div className="border-border mt-4 flex items-center justify-between border-t pt-3">
                    <div className="text-muted-foreground flex items-center gap-3 text-[11px]">
                      <span>
                        استخدام {used}/{coupon.maxUsage ? maxUses : '∞'}
                      </span>
                      <span>ينتهي {new Date(coupon.expiresAt).toLocaleDateString()}</span>
                    </div>
                    <button
                      onClick={() => deleteCoupon(coupon.id)}
                      className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                      title="حذف الكوبون"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="bg-muted mt-3 h-1.5 overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentageUsed}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
