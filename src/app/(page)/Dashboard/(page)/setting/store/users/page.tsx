'use client';

import CreateInviteButton from '../../../../_components/features/CreateInviteButton';
import { useLanguage } from '../../../../context/LanguageContext';
import SettingsPageHeader from '../../_components/settings-page-header';

export default function UsersSettingsPage() {
  const { t } = useLanguage();

  return (
    <section dir="rtl" className="min-h-screen pb-28">
      <SettingsPageHeader title={t.store?.team || 'أعضاء الفريق'} />
      <div className="mx-auto max-w-xl px-4 pt-6">
        <CreateInviteButton />
      </div>
    </section>
  );
}
