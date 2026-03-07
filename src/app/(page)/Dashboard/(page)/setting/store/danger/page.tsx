'use client';
import { useLanguage } from '../../../../context/LanguageContext';

import DangerSection from '../(page)/danger-section/danger-section';
import SettingsPageHeader from '../../_components/settings-page-header';

export default function DangerSettingsPage() {
  const { t } = useLanguage();
  return (
    <section dir="rtl" className="min-h-screen bg-background pb-28">
      <SettingsPageHeader
        title={t.store?.dangerZone || 'منطقة الخطر'}
      />
      <div className="px-4 pt-4 max-w-xl mx-auto">
        <DangerSection />
      </div>
    </section>
  );
}
