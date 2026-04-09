'use client';

import { useMemo } from 'react';
import type { PlanType } from '@/types/plans/Plans';
import { useSubscriptions } from '../../../../hooks';
import { useLanguage } from '../../../../context/LanguageContext';
import { STORE_FEATURE_PLANS, type StoreFeatureKey } from '@/lib/subscription/feature-access';

export { STORE_FEATURE_PLANS, type StoreFeatureKey };

export function useStoreFeatureAccess(feature: StoreFeatureKey) {
  const { t, dir, lang } = useLanguage();
  const { traderBasic, traderPro, dropBasic, dropPro, hasAccess } = useSubscriptions();

  return useMemo(() => {
    const requiredPlans = STORE_FEATURE_PLANS[feature];
    const allowed = requiredPlans.some(plan => hasAccess(plan));
    const joiner = dir === 'rtl' ? '، ' : ', ';

    const planNames: Record<PlanType, string> = {
      'free-trial': t.plans?.free || 'Free',
      'multi-basics': t.home?.basicPlan || t.plans?.basic || 'Basic',
      'multi-pro': t.plans?.pro || 'Pro',
      'multi-drop': t.storeOptions.planNames.multiDrop,
      'multi-trader': t.storeOptions.planNames.multiTrader,
      'trader-basic': traderBasic?.name || t.storeOptions.planNames.traderBasic,
      'trader-pro': traderPro?.name || t.storeOptions.planNames.traderPro,
      'drop-basics': dropBasic?.name || t.storeOptions.planNames.dropBasics,
      'drop-pro': dropPro?.name || t.storeOptions.planNames.dropPro,
    };

    const requiredPlansLabel = requiredPlans
      .map(plan => planNames[plan])
      .filter(Boolean)
      .join(joiner);

    const isEnglish = lang === 'en';

    return {
      allowed,
      requiredPlans,
      requiredPlansLabel,
      viewOnlyLabel: isEnglish ? 'View only' : 'عرض فقط',
      lockedTitle: isEnglish ? 'Restricted feature' : 'ميزة مقيدة',
      lockedDescription: isEnglish
        ? `You can open this feature in view-only mode. Subscribe to ${requiredPlansLabel || 'an eligible plan'} to make changes.`
        : `يمكنك الاطلاع على هذه الميزة فقط. للتعديل أو الاستخدام يجب الاشتراك في ${requiredPlansLabel || 'باقة مناسبة'}.`,
      ctaLabel: isEnglish ? 'Subscribe now' : 'اشترك الآن',
      subscriptionHint: isEnglish ? 'Subscription required' : 'يتطلب اشتراكًا',
    };
  }, [dir, dropBasic?.name, dropPro?.name, feature, hasAccess, lang, t, traderBasic?.name, traderPro?.name]);
}
