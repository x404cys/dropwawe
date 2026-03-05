'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Store, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../../../context/LanguageContext';

export default function CreateAnotherStorePage() {
  const router = useRouter();
  const { t } = useLanguage();
  return (
    <section dir="rtl" className="min-h-screen bg-muted pb-28">
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center gap-2">
        <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </button>
        <h1 className="text-base font-bold text-foreground">{t.store?.createAnother || 'إنشاء متجر إضافي'}</h1>
      </div>
      <div className="flex flex-col items-center px-4 pt-16 text-center max-w-xl mx-auto space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{t.store?.createAnotherEasy || 'أنشئ متجرًا آخر بكل سهولة'}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t.store?.createAnotherDesc || 'الآن يمكنك إدارة أكثر من متجر من حساب واحد، لتوسّع أعمالك وتزيد إنتاجيتك.'}
          </p>
        </div>
        <div className="grid w-full gap-4 sm:grid-cols-2">
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 shadow-sm">
            <Store className="h-6 w-6 text-[#04BAF6]" />
            <p className="text-sm font-medium text-foreground">{t.store?.multipleStores || 'متاجر متعددة'}</p>
            <span className="text-xs text-muted-foreground">{t.store?.multipleStoresDesc || 'أنشئ أكثر من متجر حسب نشاطك'}</span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 shadow-sm">
            <TrendingUp className="h-6 w-6 text-[#04BAF6]" />
            <p className="text-sm font-medium text-foreground">{t.store?.fasterGrowth || 'نمو أسرع'}</p>
            <span className="text-xs text-muted-foreground">{t.store?.fasterGrowthDesc || 'وسّع تجارتك وزد أرباحك'}</span>
          </div>
        </div>
        <button
          onClick={() => router.push('/Dashboard/create-store/create-another')}
          className="rounded-xl bg-gradient-to-l from-sky-600 to-blue-500 px-12 py-3.5 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition-opacity"
        >
          {t.store?.createNewStore || 'إنشاء متجر جديد'}
        </button>
      </div>
    </section>
  );
}
