import type { PlanType } from '@/types/plans/Plans';

export const ACCESS_MAP: Record<PlanType, PlanType[]> = {
  'trader-basic': ['trader-basic'],
  'trader-pro': ['trader-basic', 'trader-pro'],
  'drop-basics': ['drop-basics'],
  'drop-pro': ['drop-basics', 'drop-pro'],
  'multi-basics': ['drop-basics', 'trader-basic'],
  'multi-pro': ['drop-pro', 'trader-pro', 'drop-basics', 'trader-basic'],
  'multi-trader': ['trader-basic', 'trader-pro'],
  'multi-drop': ['drop-basics', 'drop-pro'],
  'free-trial': [
    'multi-basics',
    'multi-drop',
    'multi-trader',
    'drop-basics',
    'trader-basic',
    'trader-pro',
  ],
};

export const STORE_FEATURE_PLANS = {
  template: [
    'drop-basics',
    'trader-basic',
    'trader-pro',
    'drop-pro',
    'free-trial',
  ],
  users: ['drop-pro', 'trader-pro'],
  paymentLinks: ['drop-pro', 'trader-pro', 'trader-basic'],
  coupon: ['drop-basics', 'trader-pro', 'drop-pro', 'free-trial'],
  createAnother: ['drop-pro'],
  pixel: ['trader-pro', 'drop-pro', 'free-trial'],
  cShipping: ['drop-basics', 'trader-pro', 'drop-pro'],
} as const satisfies Record<string, PlanType[]>;

export type StoreFeatureKey = keyof typeof STORE_FEATURE_PLANS;

export function canAccessRequiredPlans(
  userPlanType: PlanType | null,
  requiredPlans: readonly PlanType[]
) {
  if (!userPlanType) return false;

  return requiredPlans.some(requiredPlan => ACCESS_MAP[userPlanType]?.includes(requiredPlan));
}
