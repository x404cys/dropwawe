import { prisma } from '@/app/lib/db';
import type { PlanType } from '@/types/plans/Plans';
import { canAccessRequiredPlans } from '@/lib/subscription/feature-access';

export async function getEffectivePlanType(userId: string): Promise<PlanType | null> {
  const membership = await prisma.storeUser.findFirst({
    where: { userId },
    select: {
      isOwner: true,
      store: {
        select: {
          users: {
            where: { isOwner: true },
            select: { userId: true },
            take: 1,
          },
        },
      },
    },
  });

  const subscriptionUserId =
    membership && !membership.isOwner ? membership.store.users[0]?.userId ?? userId : userId;

  const subscription = await prisma.userSubscription.findFirst({
    where: {
      userId: subscriptionUserId,
      isActive: true,
      endDate: { gt: new Date() },
    },
    include: {
      plan: {
        select: {
          type: true,
        },
      },
    },
  });

  return (subscription?.plan.type as PlanType | undefined) ?? null;
}

export async function canUserAccessFeature(userId: string, requiredPlans: readonly PlanType[]) {
  const userPlanType = await getEffectivePlanType(userId);
  return canAccessRequiredPlans(userPlanType, requiredPlans);
}

export async function userBelongsToStore(userId: string, storeId: string) {
  const membership = await prisma.storeUser.findFirst({
    where: { userId, storeId },
    select: { id: true },
  });

  return !!membership;
}

export function getFeatureAccessError(requiredPlans: readonly PlanType[]) {
  const message = 'Subscription required to modify this feature';

  return {
    error: message,
    code: 'FEATURE_SUBSCRIPTION_REQUIRED',
    message,
    requiredPlans,
  };
}
