'use client';

import { Check, HelpCircle, Rocket, Zap } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { fbEvent } from '../../utils/pixel';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

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

function ConfirmDialog({
  open,
  planName,
  loading,
  title,
  description,
  confirmLabel,
  cancelLabel,
  processingLabel,
  dir,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  planName: string;
  loading: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  processingLabel: string;
  dir: 'rtl' | 'ltr';
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={value => !value && onCancel()}>
      <DialogContent
        className="border-border/50 rounded-3xl p-8 text-center sm:max-w-[380px]"
        dir={dir}
      >
        <div className="flex flex-col items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle2 className="h-9 w-9 text-emerald-500" />
          </div>
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
            <DialogDescription className="text-sm">
              {description.replace('{plan}', planName)}
            </DialogDescription>
          </DialogHeader>
          <div className="flex w-full gap-3">
            <Button
              variant="outline"
              className="h-11 flex-1 rounded-xl font-bold"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelLabel}
            </Button>
            <Button
              className="h-11 flex-1 rounded-xl font-bold"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? processingLabel : confirmLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PlanCard({
  plan,
  onSelect,
  popularLabel,
}: {
  plan: Plan;
  onSelect: (id: string) => void;
  popularLabel: string;
}) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-3xl border p-6 transition-all duration-300 ${
        plan.recommended
          ? 'border-primary bg-card shadow-primary/10 shadow-xl'
          : 'border-border/50 bg-card/60 hover:bg-card hover:shadow-md'
      }`}
    >
      {plan.recommended && (
        <div className="absolute -top-4 right-0 left-0 flex justify-center">
          <span className="bg-primary text-primary-foreground inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-bold shadow-md">
            <Zap className="h-3 w-3 fill-current" />
            {popularLabel}
          </span>
        </div>
      )}

      <div className="mt-3 mb-5 space-y-1">
        <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
          {plan.name}
        </p>
        <p className="text-muted-foreground text-sm leading-snug">{plan.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-foreground text-4xl font-black tracking-tight">{plan.price}</span>
          {plan.period && (
            <span className="text-muted-foreground mr-1 text-sm font-medium">{plan.period}</span>
          )}
        </div>
      </div>

      <ul className="mb-6 flex-1 space-y-3">
        {plan.features.map(feature => (
          <li key={feature} className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full ${
                plan.recommended ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
              }`}
            >
              <Check className="h-3 w-3" />
            </span>
            <span className="text-foreground/85 text-sm leading-snug">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="bg-muted/60 border-border/40 mb-5 rounded-xl border px-3 py-2.5">
        <p className="text-muted-foreground text-[11px] leading-relaxed font-semibold">
          {plan.fee}
        </p>
      </div>

      <Button
        onClick={() => onSelect(plan.id)}
        className={`h-12 w-full rounded-xl text-base font-bold transition-all active:scale-[0.98] ${
          plan.recommended ? 'shadow-md' : ''
        }`}
        variant={plan.recommended ? 'default' : 'outline'}
      >
        {plan.cta}
      </Button>
    </div>
  );
}

export default function PlansPage() {
  const { t, dir } = useLanguage();
  const pageT = t.dashboardPages.plans;
  const [activeTab, setActiveTab] = useState<'traders' | 'dropshippers'>('traders');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  const traders: Plan[] = [
    { id: 'trader-basic', recommended: false, ...pageT.catalog.traders.basic },
    { id: 'trader-pro', recommended: true, ...pageT.catalog.traders.pro },
  ];

  const dropshippers: Plan[] = [
    { id: 'drop-basics', recommended: false, ...pageT.catalog.dropshippers.basic },
    { id: 'drop-pro', recommended: true, ...pageT.catalog.dropshippers.pro },
  ];

  const handleSelect = (planId: string) => {
    const all = [
      ...traders,
      ...dropshippers,
      { id: 'ramadan-plan', name: pageT.ramadanPlanName } as Plan,
    ];
    const plan = all.find(item => item.id === planId) ?? ({ id: planId, name: planId } as Plan);
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
      toast.error(t.error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const plans = activeTab === 'traders' ? traders : dropshippers;

  return (
    <div dir={dir} className="min-h-screen pb-24 md:pb-12">
      <div className="mx-auto max-w-2xl space-y-10 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 text-center"
        >
          <span className="bg-primary/10 border-primary/20 text-primary inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold">
            <Rocket className="h-3.5 w-3.5" />
            {pageT.badge}
          </span>
          <h1 className="text-foreground text-3xl font-extrabold tracking-tight md:text-4xl">
            {pageT.headline}
          </h1>
          <p className="text-muted-foreground mx-auto max-w-md text-sm leading-relaxed md:text-base">
            {pageT.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="border-primary/20 from-card via-card to-primary/5 relative overflow-hidden rounded-3xl border bg-gradient-to-br shadow-lg"
        >
          <div className="bg-primary/10 pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full blur-3xl" />
        </motion.div>

        <div className="flex justify-center">
          <div className="bg-muted border-border inline-flex gap-1 rounded-2xl border p-1.5">
            {(['traders', 'dropshippers'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-5 py-2 text-sm font-bold transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-card text-foreground border-border/50 border shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'traders' ? pageT.tradersTab : pageT.dropshippersTab}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start"
          >
            {plans.map(plan => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onSelect={handleSelect}
                popularLabel={t.plans.mostPopular}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="border-border bg-card/50 flex flex-col gap-6 rounded-3xl border p-6 text-right md:flex-row md:items-center md:gap-10 md:p-8">
          <div className="flex-1 space-y-2">
            <div className="text-primary flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              <h3 className="text-base font-bold">{pageT.enterpriseTitle}</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {pageT.enterpriseDescription}
            </p>
          </div>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 h-11 w-full rounded-xl px-7 font-bold md:w-auto"
          >
            {pageT.contactSales}
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={!!selectedPlan}
        planName={selectedPlan?.name ?? ''}
        loading={confirmLoading}
        title={pageT.confirmTitle}
        description={pageT.confirmDescription}
        confirmLabel={pageT.confirmAction}
        cancelLabel={t.cancel}
        processingLabel={pageT.processing}
        dir={dir}
        onConfirm={handleConfirm}
        onCancel={() => setSelectedPlan(null)}
      />
    </div>
  );
}
