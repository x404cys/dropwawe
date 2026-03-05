'use client';
import { useLanguage } from '../../../../context/LanguageContext';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import DangerSection from '../(page)/danger-section/danger-section';

 

 
export default function DangerSettingsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  return (
    <section dir="rtl" className="min-h-screen bg-muted pb-28">
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center gap-2">
        <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </button>
        <h1 className="text-base font-bold text-red-600">{t.store.dangerZone}</h1>
      </div>
      <div className="px-4 pt-4 max-w-xl mx-auto">
        <DangerSection />
      </div>
    </section>
  );
}
 

