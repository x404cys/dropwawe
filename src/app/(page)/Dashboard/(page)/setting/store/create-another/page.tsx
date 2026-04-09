'use client';

import { Store, TrendingUp, Layers, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../../context/LanguageContext';
import SettingsPageHeader from '../../_components/settings-page-header';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import FeatureRestrictionNotice from '../_components/feature-restriction-notice';
import { useStoreFeatureAccess } from '../_lib/feature-access';

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
  const { t, dir } = useLanguage();
  const access = useStoreFeatureAccess('createAnother');

  return (
    <section dir={dir} className="min-h-screen pb-28">
      <SettingsPageHeader title={t.store?.createAnother || 'إنشاء متجر إضافي'} />

      <div className="mx-auto max-w-xl space-y-8 px-4 pt-8">
        {!access.allowed && (
          <FeatureRestrictionNotice
            title={access.lockedTitle}
            description={access.lockedDescription}
            hintLabel={access.subscriptionHint}
            ctaLabel={access.ctaLabel}
          />
        )}

        {/* Hero area */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 py-4 text-center"
        >
          <div className="bg-primary/10 border-primary/20 mb-2 inline-flex h-16 w-16 items-center justify-center rounded-2xl border">
            <Store className="text-primary h-8 w-8" />
          </div>
          <h2 className="text-foreground text-2xl font-extrabold tracking-tight">
            {t.store?.createAnotherEasy || 'أنشئ متجرًا آخر بكل سهولة'}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-sm text-sm leading-relaxed">
            {t.store?.createAnotherDesc ||
              'الآن يمكنك إدارة أكثر من متجر من حساب واحد — وسّع أعمالك وزد إنتاجيتك.'}
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="border-border bg-card flex flex-col items-center gap-3 rounded-2xl border p-5 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
                <f.icon className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="text-foreground text-sm font-bold">
                  {(t.store as any)?.[f.key] || f.defaultLabel}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
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
            disabled={!access.allowed}
            className="h-13 w-full rounded-2xl text-base font-bold shadow-md transition-all active:scale-[0.98]"
          >
            {t.store?.createNewStore || 'إنشاء متجر جديد'}
          </Button>

          <button
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t.back || 'رجوع'}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
