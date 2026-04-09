'use client';

import CreateInviteButton from '../../../../_components/features/CreateInviteButton';
import { useLanguage } from '../../../../context/LanguageContext';
import SettingsPageHeader from '../../_components/settings-page-header';
import FeatureRestrictionNotice from '../_components/feature-restriction-notice';
import { useStoreFeatureAccess } from '../_lib/feature-access';

export default function UsersSettingsPage() {
  const { t } = useLanguage();
  const access = useStoreFeatureAccess('users');

  return (
    <section dir="rtl" className="min-h-screen pb-28">
      <SettingsPageHeader title={t.store?.team || 'أعضاء الفريق'} />
      <div className="mx-auto max-w-xl px-4 pt-6">
        {!access.allowed && (
          <div className="mb-4">
            <FeatureRestrictionNotice
              title={access.lockedTitle}
              description={access.lockedDescription}
              hintLabel={access.subscriptionHint}
              ctaLabel={access.ctaLabel}
            />
          </div>
        )}
        <CreateInviteButton readOnly={!access.allowed} />
      </div>
    </section>
  );
}
