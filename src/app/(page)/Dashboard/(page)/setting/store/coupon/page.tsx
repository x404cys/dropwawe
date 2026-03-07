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

  const filtered = coupons.filter(c => !search || c.code.toLowerCase().includes(search.toLowerCase()));

  // We don't have an update API, so the toggle modifies local state only for the visual mockup effect
  const toggleCoupon = (id: string) => {
    setCoupons(prev => prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
    toast.success('تم تحديث حالة الكوبون');
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
      setNewCoupon({ code: '', type: 'PERCENTAGE', value: '', minOrder: '', maxUsage: '100', expiresAt: '' });
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message || 'حدث خطأ عند إنشاء الكوبون');
    } finally {
      setLoading(false);
    }
  };

  const headerActions = (
    <Button onClick={() => setShowForm(!showForm)} size="sm" className="gap-1.5 h-8 text-xs bg-primary hover:bg-primary/90">
      <Plus className="h-3.5 w-3.5" />
      إنشاء كود
    </Button>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-background pb-28">
      <SettingsPageHeader
        title="أكواد الخصم"
        subtitle={isFetching ? 'جاري التحميل...' : `${coupons.length} كود مضاف`}
        action={headerActions}
      />

      <main className="max-w-xl mx-auto px-4 pt-4 space-y-4">
        {showForm && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-4 shadow-sm animate-in slide-in-from-top-2">
            <h3 className="text-sm font-semibold text-foreground">كود خصم جديد</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-muted-foreground mb-1 block">الكود</label>
                <Input
                  value={newCoupon.code}
                  onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="مثال: WELCOME10"
                  className="uppercase h-10 text-sm"
                  dir="ltr"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-xs text-muted-foreground mb-1 block">النوع</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewCoupon({ ...newCoupon, type: 'PERCENTAGE' })}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium border transition-colors ${
                      newCoupon.type === 'PERCENTAGE'
                        ? 'bg-primary/10 text-primary border-primary ring-1 ring-primary/20'
                        : 'bg-card text-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    <Percent className="h-3.5 w-3.5" /> نسبة
                  </button>
                  <button
                    onClick={() => setNewCoupon({ ...newCoupon, type: 'FIXED' })}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium border transition-colors ${
                      newCoupon.type === 'FIXED'
                        ? 'bg-primary/10 text-primary border-primary ring-1 ring-primary/20'
                        : 'bg-card text-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    <Hash className="h-3.5 w-3.5" /> مبلغ ثابت
                  </button>
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-xs text-muted-foreground mb-1 block">
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
                <label className="text-xs text-muted-foreground mb-1 block">حد أدنى للطلب (د.ع)</label>
                <Input
                  type="number"
                  value={newCoupon.minOrder}
                  onChange={e => setNewCoupon({ ...newCoupon, minOrder: e.target.value })}
                  placeholder="إختياري"
                  className="h-10 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">عدد الاستخدامات</label>
                <Input
                  type="number"
                  value={newCoupon.maxUsage}
                  onChange={e => setNewCoupon({ ...newCoupon, maxUsage: e.target.value })}
                  placeholder="إختياري"
                  className="h-10 text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-muted-foreground mb-1 block">تاريخ الانتهاء</label>
                <Input
                  type="date"
                  value={newCoupon.expiresAt}
                  onChange={e => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
                  className="h-10 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={addCoupon} disabled={loading} size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                {loading ? 'جاري الإنشاء...' : 'إنشاء'}
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline" size="sm">
                إلغاء
              </Button>
            </div>
          </div>
        )}

        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث عن كود..."
            className="pr-10 h-10 text-sm bg-card border-border"
          />
        </div>

        <div className="space-y-3">
          {isFetching ? (
             <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
             <Ticket className="h-10 w-10 mb-3 opacity-20 animate-pulse" />
             <p className="text-sm font-medium animate-pulse">جاري التحميل...</p>
           </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Ticket className="h-10 w-10 mb-3 opacity-20" />
              <p className="text-sm font-medium">لا توجد أكواد</p>
            </div>
          ) : (
            filtered.map(coupon => {
              const maxUses = coupon.maxUsage || 1000;
              const used = coupon.usedCount || 0;
              const percentageUsed = Math.min((used / maxUses) * 100, 100);

              return (
                <div key={coupon.id} className="bg-card border border-border rounded-xl p-4 shadow-sm hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border border-border/50 flex-shrink-0 ${
                          coupon.isActive ? 'bg-primary/10' : 'bg-muted'
                        }`}
                      >
                        <Ticket className={`h-4 w-4 ${coupon.isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground font-mono" dir="ltr">{coupon.code}</span>
                          <button
                            onClick={() => copyCode(coupon.code)}
                            className="text-muted-foreground hover:text-primary transition-colors p-1"
                            title="نسخ الكود"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-[11px] text-muted-foreground mt-0.5 block">
                          {coupon.type === 'PERCENTAGE'
                            ? `${coupon.value}% خصم`
                            : `${Number(coupon.value).toLocaleString('ar-IQ')} د.ع خصم`}
                          {coupon.minOrder ? ` • حد أدنى ${Number(coupon.minOrder).toLocaleString('ar-IQ')}` : ''}
                        </span>
                      </div>
                    </div>
                    <Switch checked={coupon.isActive} onCheckedChange={() => toggleCoupon(coupon.id)} />
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span>استخدام {used}/{coupon.maxUsage ? maxUses : '∞'}</span>
                      <span>ينتهي {new Date(coupon.expiresAt).toLocaleDateString()}</span>
                    </div>
                    <button
                      onClick={() => deleteCoupon(coupon.id)}
                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors p-2 rounded-lg"
                      title="حذف الكوبون"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
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
