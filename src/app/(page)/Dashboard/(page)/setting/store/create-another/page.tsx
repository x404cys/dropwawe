'use client';

import { Store, TrendingUp, Layers, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../../context/LanguageContext';
import SettingsPageHeader from '../../_components/settings-page-header';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Store,
    key: 'multipleStores',
    defaultLabel: 'متاجر متعددة',
    defaultDesc: 'أنشئ أكثر من متجر وأدِرها من حساب واحد',
  },
  {
    icon: TrendingUp,
    key: 'fasterGrowth',
    defaultLabel: 'نمو أسرع',
    defaultDesc: 'وسّع تجارتك في أسواق متعددة وزد أرباحك',
  },
  {
    icon: Layers,
    key: 'separateInventory',
    defaultLabel: 'مخزون منفصل',
    defaultDesc: 'إدارة مستقلة لكل متجر بمنتجات وطلبات خاصة',
  },
];

export default function CreateAnotherStorePage() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <section dir="rtl" className="min-h-screen pb-28">
      <SettingsPageHeader title={t.store?.createAnother || 'إنشاء متجر إضافي'} />

      <div className="mx-auto max-w-xl px-4 pt-8 space-y-8">

        {/* Hero area */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3 py-4"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-2">
            <Store className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            {t.store?.createAnotherEasy || 'أنشئ متجرًا آخر بكل سهولة'}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            {t.store?.createAnotherDesc ||
              'الآن يمكنك إدارة أكثر من متجر من حساب واحد — وسّع أعمالك وزد إنتاجيتك.'}
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {(t.store as any)?.[f.key] || f.defaultLabel}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {(t.store as any)?.[`${f.key}Desc`] || f.defaultDesc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col items-center gap-3"
        >
          <Button
            size="lg"
            onClick={() => router.push('/create-store/create-another')}
            className="w-full h-13 text-base font-bold rounded-2xl active:scale-[0.98] transition-all shadow-md"
          >
            {t.store?.createNewStore || 'إنشاء متجر جديد'}
          </Button>

          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t.back || 'رجوع'}
          </button>
        </motion.div>

      </div>
    </section>
  );
}
