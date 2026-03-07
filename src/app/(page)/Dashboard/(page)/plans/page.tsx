'use client';
import { useLanguage } from '../../context/LanguageContext';
import { Check, Rocket, HelpCircle, Zap, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { fbEvent } from '../../utils/pixel';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CheckCircle2 } from 'lucide-react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  fee: string;
  cta: string;
  recommended?: boolean;
}

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
const TRADERS: Plan[] = [
  {
    id: 'trader-basic',
    name: 'الأساسية',
    price: '39,000',
    period: 'د.ع / شهر',
    description: 'ابدأ رحلتك الرقمية وأطلق متجرك الأول اليوم',
    fee: '499 د.ع / طلب  •  3.25% بوابات الدفع',
    cta: 'ابدأ الآن',
    features: [
      'منتجات وطلبات غير محدودة',
      'إدارة كاملة للطلبات والمخزون',
      'تحقق مجاني من هاتف العميل',
      'ثيم متجر واحد',
      'ربط بكسل ميتا / تيك توك / سناب',
      'مدير حساب واحد',
    ],
  },
  {
    id: 'trader-pro',
    name: 'الاحترافية',
    price: '69,000',
    period: 'د.ع / شهر',
    description: 'كل ما تحتاجه لتوسيع مبيعاتك وأتمتة عملياتك',
    fee: '399 د.ع / طلب  •  2.75% بوابات الدفع',
    cta: 'اشترك الآن',
    recommended: true,
    features: [
      'كل مميزات الأساسية',
      'دعم تسويقي مخصص',
      'كوبونات خصم متقدمة',
      'ربط آلي مع شركات التوصيل',
      'ثيمين متميزين للمتجر',
      'صلاحيات لـ 3 مدراء',
      'أولوية دعم فني 24/7',
    ],
  },
];

const DROPSHIPPERS: Plan[] = [
  {
    id: 'drop-basics',
    name: 'الأساسية',
    price: '39,000',
    period: 'د.ع / شهر',
    description: 'انطلق في عالم الدروبشيبنج بأقل تكلفة',
    fee: '199 د.ع / طلب  •  3.25% بوابات الدفع',
    cta: 'ابدأ الآن',
    features: [
      'متجر إلكتروني واحد',
      '5 منتجات دروبشيبنج جاهزة',
      'محتوى احترافي للمنتجات',
      'حتى 125 طلباً شهرياً',
      'ربط آلي مع التوصيل',
      'ثيم متجر واحد + إدارة شخص',
    ],
  },
  {
    id: 'drop-pro',
    name: 'الاحترافية',
    price: '69,000',
    period: 'د.ع / شهر',
    description: 'للمحترفين الذين يريدون دخلاً غير محدود',
    fee: '99 د.ع / طلب  •  2.75% بوابات الدفع',
    cta: 'ارتقِ الآن',
    recommended: true,
    features: [
      'متجران إلكترونيان',
      'منتجات وطلبات غير محدودة',
      'خصومات ومكافآت ذكية',
      'تتبع شامل (ميتا / تيك توك)',
      'أتمتة كاملة لشركات التوصيل',
      'ثيمان + صلاحيات لـ 3 أشخاص + أولوية دعم',
    ],
  },
];

// ─────────────────────────────────────────────
// Confirm Dialog
// ─────────────────────────────────────────────
function ConfirmDialog({
  open,
  planName,
  loading,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  planName: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onCancel()}>
      <DialogContent className="sm:max-w-[380px] rounded-3xl border-border/50 p-8 text-center" dir="rtl">
        <div className="flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9 text-emerald-500" />
          </div>
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-bold">تأكيد الاشتراك</DialogTitle>
            <DialogDescription className="text-sm">
              هل أنت متأكد من الاشتراك في خطة
              <span className="font-bold text-foreground block mt-1">{planName}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex w-full gap-3">
            <Button
              variant="outline"
              className="flex-1 h-11 rounded-xl font-bold"
              onClick={onCancel}
              disabled={loading}
            >
              إلغاء
            </Button>
            <Button
              className="flex-1 h-11 rounded-xl font-bold"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? 'جاري...' : 'تأكيد'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// Plan Card
// ─────────────────────────────────────────────
function PlanCard({
  plan,
  onSelect,
}: {
  plan: Plan;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-3xl border p-6 transition-all duration-300 h-full ${
        plan.recommended
          ? 'border-primary bg-card shadow-xl shadow-primary/10'
          : 'border-border/50 bg-card/60 hover:bg-card hover:shadow-md'
      }`}
    >
      {/* Recommended Badge */}
      {plan.recommended && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-[11px] font-bold px-4 py-1.5 rounded-full shadow-md">
            <Zap className="w-3 h-3 fill-current" />
            الأكثر طلباً
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-5 space-y-1 mt-3">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{plan.name}</p>
        <p className="text-sm text-muted-foreground leading-snug">{plan.description}</p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-foreground tracking-tight">{plan.price}</span>
          <span className="text-sm font-medium text-muted-foreground mr-1">{plan.period}</span>
        </div>
      </div>

      {/* Features */}
      <ul className="flex-1 space-y-3 mb-6">
        {plan.features.map(f => (
          <li key={f} className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex-shrink-0 flex items-center justify-center w-[18px] h-[18px] rounded-full ${
                plan.recommended
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <Check className="w-3 h-3" />
            </span>
            <span className="text-sm text-foreground/85 leading-snug">{f}</span>
          </li>
        ))}
      </ul>

      {/* Fee note */}
      <div className="mb-5 px-3 py-2.5 bg-muted/60 rounded-xl border border-border/40">
        <p className="text-[11px] font-semibold text-muted-foreground leading-relaxed">{plan.fee}</p>
      </div>

      {/* CTA */}
      <Button
        onClick={() => onSelect(plan.id)}
        className={`w-full h-12 rounded-xl font-bold text-base transition-all active:scale-[0.98] ${
          plan.recommended ? 'shadow-md' : ''
        }`}
        variant={plan.recommended ? 'default' : 'outline'}
      >
        {plan.cta}
      </Button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function Plans() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'traders' | 'dropshippers'>('traders');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  // Countdown
  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(() => {
    const endDate =
      Number(localStorage.getItem('ramadanEnd')) || Date.now() + 35 * 24 * 60 * 60 * 1000;
    localStorage.setItem('ramadanEnd', String(endDate));
    const id = setInterval(() => setTimeLeft(endDate - Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const d = Math.max(0, timeLeft);
  const timer = {
    days: Math.floor(d / (1000 * 60 * 60 * 24)),
    hours: Math.floor((d / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((d / (1000 * 60)) % 60),
    seconds: Math.floor((d / 1000) % 60),
  };

  const handleSelect = (planId: string) => {
    const all = [...TRADERS, ...DROPSHIPPERS, { id: 'ramadan-plan', name: 'الباقة الرمضانية' } as Plan];
    const plan = all.find(p => p.id === planId) ?? ({ id: planId, name: planId } as Plan);
    setSelectedPlan(plan);
  };

  const handleConfirm = async () => {
    if (!selectedPlan) return;
    setConfirmLoading(true);
    fbEvent('InitiateCheckout', { content_name: selectedPlan.id });
    try {
      router.push(`/Dashboard/plans/checkout/${selectedPlan.id}`);
      await update();
      setSelectedPlan(null);
    } catch {
      toast.error('حدث خطأ أثناء الاشتراك');
    } finally {
      setConfirmLoading(false);
    }
  };

  const plans = activeTab === 'traders' ? TRADERS : DROPSHIPPERS;
  const timerItems = [
    { label: t.plans.days, value: timer.days },
    { label: 'ساعة', value: timer.hours },
    { label: 'دقيقة', value: timer.minutes },
    { label: 'ثانية', value: timer.seconds, pulse: true },
  ];

  return (
    <div dir="rtl" className="min-h-screen pb-24 md:pb-12">
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-4 py-1.5 rounded-full">
            <Rocket className="w-3.5 h-3.5" />
            الخطط والأسعار
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            استثمر في نجاح&nbsp;متجرك
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
            جميع الخطط تشمل إدارة كاملة للمتجر والطلبات مع دعم فني متواصل
          </p>
        </motion.div>

        {/* ── Ramadan Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-lg"
        >
          {/* bg glow */}
          <div className="pointer-events-none absolute -right-16 -top-16 w-56 h-56 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative p-6 space-y-5">
            {/* title row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-bold px-3 py-1 rounded-full">
                عرض خاص 🌙
              </span>
              <h2 className="text-xl font-extrabold text-foreground">الباقة الرمضانية</h2>
            </div>

            {/* countdown */}
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex items-center gap-1.5">
                {timerItems.map((item, i, arr) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <div
                      className={`flex flex-col items-center min-w-[3rem] p-1.5 rounded-xl border text-center ${
                        item.pulse
                          ? 'bg-primary/5 border-primary/20 text-primary'
                          : 'bg-muted/60 border-border/50 text-foreground'
                      }`}
                    >
                      <span className="text-base font-black font-mono leading-none">
                        {item.value.toString().padStart(2, '0')}
                      </span>
                      <span className="text-[9px] opacity-70 mt-0.5">{item.label}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <span className="text-muted-foreground font-bold text-sm">:</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* desc + price row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                  مميزات استثنائية وخصم 43% لمضاعفة مبيعاتك في رمضان المبارك
                </p>
                <ul className="mt-3 space-y-1.5">
                  {['تصميم رمضاني حصري', 'دعم تسويقي مكثف', 'كل مميزات الاحترافية'].map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm font-medium">
                      <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-2">
                <p className="text-sm text-muted-foreground line-through">69,000 {t.currency}</p>
                <p className="text-3xl font-black text-foreground">39,000 <span className="text-base font-medium">{t.currency}</span></p>
                <Button
                  onClick={() => handleSelect('ramadan-plan')}
                  className="w-full sm:w-auto h-11 px-6 rounded-xl font-bold active:scale-[0.98] transition-all"
                >
                  استغل العرض
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Tab Toggle ── */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 bg-muted rounded-2xl border border-border gap-1">
            {(['traders', 'dropshippers'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 text-sm font-bold rounded-xl transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-card text-foreground shadow-sm border border-border/50'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'traders' ? 'خطط التجار' : 'خطط الدروب شيبر'}
              </button>
            ))}
          </div>
        </div>

        {/* ── Pricing Cards ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:items-start"
          >
            {plans.map(plan => (
              <PlanCard key={plan.id} plan={plan} onSelect={handleSelect} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── Enterprise ── */}
        <div className="rounded-3xl border border-border bg-card/50 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 md:gap-10 text-right">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <HelpCircle className="w-5 h-5" />
              <h3 className="font-bold text-base">للشركات الكبيرة</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              خطط مؤسسية تشمل مدير حساب خاص، سيرفرات معزولة، تكامل ERP، وتدقيق أمني مع SSO.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full md:w-auto px-7 h-11 rounded-xl font-bold border-primary text-primary hover:bg-primary/10"
          >
            تواصل مع المبيعات
          </Button>
        </div>

      </div>

      {/* ── Confirm Dialog ── */}
      <ConfirmDialog
        open={!!selectedPlan}
        planName={selectedPlan?.name ?? ''}
        loading={confirmLoading}
        onConfirm={handleConfirm}
        onCancel={() => setSelectedPlan(null)}
      />
    </div>
  );
}
