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
  const isLifetimePlan = type === 'trader-basic';

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
      router.push('/Dashboard');
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
        <div className="space-y-4 text-center">
          <p className="text-4xl"></p>
          <p className="text-foreground text-base font-semibold">الخطة غير موجودة</p>
          <button
            onClick={() => router.push('/Dashboard/plans')}
            className="text-primary text-sm underline"
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
      <div className="mx-auto max-w-lg space-y-6 px-4 py-8 md:max-w-5xl md:py-12">
        <button
          onClick={() => router.push('/Dashboard/plans')}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
          العودة للخطط
        </button>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_380px]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-border bg-card space-y-6 rounded-3xl border p-6 shadow-sm md:p-8"
          >
            <div className="space-y-2">
              <div className="bg-primary/10 border-primary/20 text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold">
                <Sparkles className="h-3 w-3" />
                تفاصيل الخطة
              </div>
              <h1 className="text-foreground text-2xl font-extrabold tracking-tight">
                {plan.name}
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">{plan.description}</p>
            </div>

            <div className="bg-muted/50 border-border/50 flex items-center gap-4 rounded-2xl border p-4">
              <div className="flex-1">
                <p className="text-muted-foreground mb-1 text-xs font-medium">
                  {isLifetimePlan ? 'سعر الخطة' : 'السعر الشهري'}
                </p>
                <div className="flex items-baseline gap-2">
                  {'oldPrice' in plan && (plan as any).oldPrice && (
                    <span className="text-muted-foreground text-sm line-through">
                      {(plan as any).oldPrice.toLocaleString()} د.ع
                    </span>
                  )}
                  <span className="text-foreground text-3xl font-black">
                    {plan.price.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground text-sm font-semibold">
                    {isLifetimePlan ? 'د.ع / مدى الحياة' : 'د.ع / شهر'}
                  </span>
                </div>
              </div>

              {'oldPrice' in plan && (plan as any).oldPrice && (
                <div className="flex-shrink-0 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-black text-emerald-600">
                  خصم {Math.round((1 - plan.price / (plan as any).oldPrice) * 100)}%
                </div>
              )}
            </div>

            <div className="border-border/50 space-y-3 border-t pt-6">
              <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
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
                      <span className="bg-primary/10 text-primary mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full">
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="text-foreground/90 text-sm leading-snug">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </AnimatePresence>

              {hasMore && (
                <button
                  onClick={() => setShowMore(v => !v)}
                  className="text-primary mt-2 flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-80"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${showMore ? 'rotate-180' : ''}`}
                  />
                  {showMore ? 'إخفاء التفاصيل' : `عرض ${plan.features.length - 4} مميزات إضافية`}
                </button>
              )}
            </div>

            <div className="bg-muted/40 border-border/40 flex items-center gap-3 rounded-2xl border p-4">
              <ShieldCheck className="h-5 w-5 flex-shrink-0 text-emerald-500" />
              <p className="text-muted-foreground text-xs leading-relaxed">
                {isLifetimePlan
                  ? 'سيتم تفعيل الخطة مباشرة لحسابك بدون رسوم إضافية.'
                  : 'يتم تفعيل اشتراكك فوراً بعد إتمام الدفع بنجاح'}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border-border bg-card h-fit space-y-6 rounded-3xl border p-6 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <CreditCard className="text-primary h-5 w-5" />
              <h2 className="text-foreground text-base font-bold">
                {isLifetimePlan ? 'ملخص التفعيل' : 'ملخص الدفع'}
              </h2>
            </div>

            <div className="from-primary/5 border-primary/10 space-y-1 rounded-2xl border bg-gradient-to-b to-transparent py-6 text-center">
              <p className="text-muted-foreground text-xs font-medium">
                {isLifetimePlan ? 'رسوم الاشتراك' : 'المبلغ الإجمالي'}
              </p>
              <p className="text-foreground text-4xl font-black tracking-tight">
                {plan.price.toLocaleString()}
                <span className="text-muted-foreground mr-1 text-base font-semibold">د.ع</span>
              </p>
              {'oldPrice' in plan && (plan as any).oldPrice && (
                <p className="text-muted-foreground text-xs line-through">
                  بدلاً من {(plan as any).oldPrice.toLocaleString()} د.ع
                </p>
              )}
            </div>

            <div className="border-border/50 flex items-center justify-between border-t border-b py-3 text-sm">
              <span className="text-muted-foreground">الخطة</span>
              <span className="text-foreground font-bold">{plan.name}</span>
            </div>

            <Button
              onClick={() => setConfirming(true)}
              className="h-13 w-full cursor-pointer rounded-2xl text-base font-bold transition-all active:scale-[0.98]"
              size="lg"
            >
              {isLifetimePlan ? 'تأكيد التفعيل' : 'تأكيد الدفع'}
              <ArrowRight className="mr-2 h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              onClick={() => router.push('/Dashboard/plans')}
              className="text-primary bg-foreground h-11 w-full cursor-pointer font-semibold"
            >
              العودة للخطط
            </Button>

            <div className="text-muted-foreground flex items-center justify-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              <p className="text-xs font-medium">
                {isLifetimePlan ? 'تفعيل مباشر وآمن للحساب' : 'دفع آمن ومشفر بالكامل'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {confirming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-4 pb-4 backdrop-blur-sm sm:items-center sm:pb-0"
            onClick={e => e.target === e.currentTarget && setConfirming(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              dir="rtl"
              className="bg-card border-border w-full max-w-md space-y-5 rounded-3xl border p-7 shadow-2xl"
            >
              <div className="flex justify-center">
                <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                  <ShieldCheck className="text-primary h-9 w-9" />
                </div>
              </div>

              <div className="space-y-1.5 text-center">
                <h3 className="text-foreground text-xl font-bold">تأكيد الاشتراك</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {isLifetimePlan ? (
                    <>
                      سيتم تفعيل خطة <span className="text-foreground font-bold">{plan.name}</span>{' '}
                      مجانًا بشكل دائم لحسابك
                    </>
                  ) : (
                    <>
                      ستُخصم{' '}
                      <span className="text-foreground font-bold">
                        {plan.price.toLocaleString()} د.ع
                      </span>{' '}
                      شهرياً مقابل خطة <span className="text-foreground font-bold">{plan.name}</span>
                    </>
                  )}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="outline"
                  className="h-12 flex-1 rounded-2xl font-bold"
                  onClick={() => setConfirming(false)}
                  disabled={loading}
                >
                  {t.cancel}
                </Button>
                <Button
                  className="h-12 flex-1 rounded-2xl font-bold"
                  onClick={handleSubscribe}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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
