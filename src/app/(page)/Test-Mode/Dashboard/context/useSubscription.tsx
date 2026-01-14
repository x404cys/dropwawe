'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { Plan, PlanType } from '@/types/plans/Plans';

interface SubscriptionContextValue {
  traderBasic: Plan | null;
  traderPro: Plan | null;
  dropBasic: Plan | null;
  dropPro: Plan | null;

  userPlanType: PlanType | null;

  isUserOnPlan: (type: PlanType) => boolean;

  hasAccess: (requiredPlan: PlanType) => boolean;

  loading: boolean;
}

const PLAN_ORDER: PlanType[] = [
  'trader-basic',
  'trader-pro',
  'drop-basics',
  'drop-pro',
  'multi-basics',
  'multi-pro',
  'multi-drop',
  'multi-trader',
];

function sortPlans(plans: Plan[]): Plan[] {
  return [...plans].sort((a, b) => PLAN_ORDER.indexOf(a.type) - PLAN_ORDER.indexOf(b.type));
}

function getPlanByType(plans: Plan[], type: PlanType): Plan | null {
  return plans.find(p => p.type === type) ?? null;
}

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);

const fetcher = (url: string) => axios.get(url, { timeout: 10000 }).then(res => res.data);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { data: plansData, isLoading: plansLoading } = useSWR<Plan[]>('/api/plans', fetcher, {
    revalidateOnFocus: false,
  });

  const { data: userSubscription } = useSWR<{
    subscription: { type: PlanType };
  }>('/api/plans/subscriptions/check', fetcher);

  const value = useMemo<SubscriptionContextValue>(() => {
    const sorted = plansData ? sortPlans(plansData) : [];

    const userPlanType: PlanType | null = userSubscription?.subscription?.type ?? null;

    const ACCESS_MAP: Record<PlanType, PlanType[]> = {
      'trader-basic': ['trader-basic'],
      'trader-pro': ['trader-basic', 'trader-pro'],
      'drop-basics': ['drop-basics', 'drop-pro'],
      'drop-pro': ['drop-basics', 'drop-pro'],
      'multi-basics': ['drop-basics', 'trader-basic'],
      'multi-pro': ['drop-pro', 'trader-pro', 'drop-basics', 'trader-basic'],
      'multi-trader': ['trader-basic', 'trader-pro'],
      'multi-drop': ['drop-basics', 'drop-pro'],
    };

    return {
      traderBasic: getPlanByType(sorted, 'trader-basic'),
      traderPro: getPlanByType(sorted, 'trader-pro'),
      dropBasic: getPlanByType(sorted, 'drop-basics'),
      dropPro: getPlanByType(sorted, 'drop-pro'),

      userPlanType,

      isUserOnPlan: (type: PlanType) => userPlanType === type,

      hasAccess: (requiredPlan: PlanType) => {
        if (!userPlanType) return false;
        return ACCESS_MAP[userPlanType]?.includes(requiredPlan) ?? false;
      },

      loading: plansLoading,
    };
  }, [plansData, plansLoading, userSubscription]);

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscriptions() {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error('useSubscriptions must be used inside SubscriptionProvider');
  return context;
}
