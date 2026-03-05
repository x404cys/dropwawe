'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import ThemeSection from '../(page)/theme-section/theme-section';
import { useLanguage } from '../../../../context/LanguageContext';

export default function ThemeSettingsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  return (
    <section dir="rtl" className="min-h-screen pb-28">
      <div className="bg-card border-border sticky top-0 z-10 flex items-center gap-2 border-b px-4 py-3">
        <button
          onClick={() => router.back()}
          className="hover:bg-muted rounded-lg p-1.5 transition-colors"
        >
          <ArrowRight className="text-muted-foreground h-5 w-5" />
        </button>
        <h1 className="text-foreground text-base font-bold">
          {t.store?.themeCustomization || 'تخصيص القالب والمظهر'}
        </h1>
      </div>

      <ThemeSection />
      
    </section>
  );
}
