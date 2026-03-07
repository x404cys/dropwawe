'use client';

import ThemeSection from '../(page)/theme-section/theme-section';
import { useLanguage } from '../../../../context/LanguageContext';
import SettingsPageHeader from '../../_components/settings-page-header';

export default function ThemeSettingsPage() {
  const { t } = useLanguage();
  return (
    <section dir="rtl" className="min-h-screen bg-background pb-28">
      <SettingsPageHeader
        title={t.store?.themeCustomization || 'القوالب'}
        subtitle={t.store?.chooseStoreThemeDesc || 'اختر قالب لمتجرك لتغيير الهوية البصرية'}
      />
      
      <main className="max-w-4xl mx-auto px-4 pt-4">
        <ThemeSection />
      </main>
    </section>
  );
}
