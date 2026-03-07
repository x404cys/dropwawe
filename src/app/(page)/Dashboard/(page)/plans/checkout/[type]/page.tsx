'use client';
import { useLanguage } from '../../../../context/LanguageContext';
import { useParams, useRouter } from 'next/navigation';
import { plans } from '../../_data/plans';
import { useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Lock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { fbEvent } from '@/app/(page)/Dashboard/utils/pixel';
import { subscribePlan } from '@/app/(page)/Dashboard/services/subscribePlan';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function PlanCheckout() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const type = params?.type as string;

  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const plan = plans[type as keyof typeof plans];

  const handleSubscribe = async () => {
    if (!type) return;
    setLoading(true);
    fbEvent('InitiateCheckout', { content_name: type });
    try {
      const result = await subscribePlan(type);
      if (result.redirect_url) {
        window.location.href = result.redirect_url;
        return;
      }
      fbEvent('Purchase', {
        content_name: type,
        currency: 'IQD',
        value: plan.price,
      });
      toast.success(`تم الاشتراك في ${plan.name}`);
      setConfirming(false);
    } catch {
      toast.error('حدث خطأ أثناء الاشتراك');
    } finally {
      setLoading(false);
    }
  };

  if (!plan) {
    return (
      <div className="flex h-screen items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <p className="text-4xl">🔍</p>
          <p className="text-base font-semibold text-foreground">الخطة غير موجودة</p>
          <button
            onClick={() => router.push('/Dashboard/plans')}
            className="text-sm text-primary underline"
          >
            العودة للخطط
          </button>
        </div>
      </div>
    );
  }

  const visibleFeatures = showMore ? plan.features : plan.features.slice(0, 4);
  const hasMore = plan.features.length > 4;

  return (
    <div dir="rtl" className="min-h-screen pb-28 md:pb-12">
      <div className="mx-auto max-w-lg px-4 py-8 md:max-w-5xl md:py-12 space-y-6">

        {/* ── Back link ── */}
        <button
          onClick={() => router.push('/Dashboard/plans')}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
          العودة للخطط
        </button>

        {/* ── Main layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6">

          {/* ── Left: Plan Details ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-border bg-card shadow-sm p-6 md:p-8 space-y-6"
          >
            {/* Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold px-3 py-1 rounded-full">
                <Sparkles className="w-3 h-3" />
                تفاصيل الخطة
              </div>
              <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
                {plan.name}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {plan.description}
              </p>
            </div>

            {/* Price highlight */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 border border-border/50">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground mb-1">السعر الشهري</p>
                <div className="flex items-baseline gap-2">
                  {'oldPrice' in plan && (plan as any).oldPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {(plan as any).oldPrice.toLocaleString()} د.ع
                    </span>
                  )}
                  <span className="text-3xl font-black text-foreground">
                    {plan.price.toLocaleString()}
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">د.ع / شهر</span>
                </div>
              </div>
              {'oldPrice' in plan && (plan as any).oldPrice && (
                <div className="flex-shrink-0 bg-emerald-500/10 text-emerald-600 text-xs font-black px-3 py-1.5 rounded-xl border border-emerald-500/20">
                  خصم{' '}
                  {Math.round(
                    (1 - plan.price / (plan as any).oldPrice) * 100
                  )}
                  %
                </div>
              )}
            </div>

            {/* Features */}
            <div className="space-y-3 border-t border-border/50 pt-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                ما يشمله الاشتراك
              </p>

              <AnimatePresence>
                <ul className="space-y-3">
                  {visibleFeatures.map((feature, i) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                      <span className="text-sm text-foreground/90 leading-snug">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </AnimatePresence>

              {hasMore && (
                <button
                  onClick={() => setShowMore(v => !v)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:opacity-80 transition-opacity mt-2"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${showMore ? 'rotate-180' : ''}`}
                  />
                  {showMore ? 'إخفاء التفاصيل' : `عرض ${plan.features.length - 4} مميزات إضافية`}
                </button>
              )}
            </div>

            {/* Trust note */}
            <div className="flex items-center gap-3 p-4 bg-muted/40 rounded-2xl border border-border/40">
              <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                يتم تفعيل اشتراكك فوراً بعد إتمام الدفع بنجاح
              </p>
            </div>
          </motion.div>

          {/* ── Right: Payment Summary ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="h-fit rounded-3xl border border-border bg-card shadow-sm p-6 space-y-6"
          >
            {/* Summary header */}
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">ملخص الدفع</h2>
            </div>

            {/* Price box */}
            <div className="text-center py-6 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent border border-primary/10 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">المبلغ الإجمالي</p>
              <p className="text-4xl font-black text-foreground tracking-tight">
                {plan.price.toLocaleString()}
                <span className="text-base font-semibold text-muted-foreground mr-1">د.ع</span>
              </p>
              {'oldPrice' in plan && (plan as any).oldPrice && (
                <p className="text-xs text-muted-foreground line-through">
                  بدلاً من {(plan as any).oldPrice.toLocaleString()} د.ع
                </p>
              )}
            </div>

            {/* Plan summary row */}
            <div className="flex items-center justify-between text-sm py-3 border-t border-b border-border/50">
              <span className="text-muted-foreground">الخطة</span>
              <span className="font-bold text-foreground">{plan.name}</span>
            </div>

            {/* CTA */}
            <Button
              onClick={() => setConfirming(true)}
              className="w-full h-13 text-base font-bold rounded-2xl active:scale-[0.98] transition-all"
              size="lg"
            >
              تأكيد الدفع
              <ArrowRight className="w-4 h-4 mr-2" />
            </Button>

            <Button
              variant="ghost"
              onClick={() => router.push('/Dashboard/plans')}
              className="w-full h-11 font-semibold text-muted-foreground hover:text-foreground"
            >
              العودة للخطط
            </Button>

            {/* Secure badge */}
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <Lock className="w-3.5 h-3.5" />
              <p className="text-xs font-medium">دفع آمن ومشفر بالكامل</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Confirmation Modal ── */}
      <AnimatePresence>
        {confirming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-4 pb-4 sm:pb-0"
            onClick={e => e.target === e.currentTarget && setConfirming(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              dir="rtl"
              className="w-full max-w-md rounded-3xl bg-card border border-border p-7 shadow-2xl space-y-5"
            >
              {/* Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-9 h-9 text-primary" />
                </div>
              </div>

              {/* Text */}
              <div className="text-center space-y-1.5">
                <h3 className="text-xl font-bold text-foreground">تأكيد الاشتراك</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  ستُخصم{' '}
                  <span className="font-bold text-foreground">
                    {plan.price.toLocaleString()} د.ع
                  </span>{' '}
                  شهرياً مقابل خطة{' '}
                  <span className="font-bold text-foreground">{plan.name}</span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-2xl font-bold"
                  onClick={() => setConfirming(false)}
                  disabled={loading}
                >
                  {t.cancel}
                </Button>
                <Button
                  className="flex-1 h-12 rounded-2xl font-bold"
                  onClick={handleSubscribe}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      جاري المعالجة...
                    </span>
                  ) : (
                    'تأكيد الاشتراك'
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
