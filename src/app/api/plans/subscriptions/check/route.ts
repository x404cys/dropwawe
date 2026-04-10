import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/app/lib/db';
import { authOperation } from '@/app/lib/authOperation';
import {
  buildSubscriptionEndDate,
  isLifetimeSubscription,
} from '@/lib/subscription/subscription-period';

function getRemainingDays(planType: string, durationDays: number, endDate: Date, now: Date) {
  if (isLifetimeSubscription(planType, durationDays)) {
    return null;
  }

  return Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export async function GET() {
  try {
    const session = await getServerSession(authOperation);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();

    const isSubUser = await prisma.storeUser.findFirst({
      where: { userId, isOwner: false },
    });

    if (isSubUser) {
      const store = await prisma.storeUser.findFirst({
        where: { userId },
        include: {
          store: {
            include: {
              users: {
                where: { isOwner: true },
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

      const ownerUser = store?.store?.users[0]?.user;

      const ownerSubscription = await prisma.userSubscription.findFirst({
        where: {
          userId: ownerUser?.id,
          isActive: true,
        },
        include: { plan: true },
      });

      return NextResponse.json({
        status: 'SUB_USER',
        owner: {
          name: ownerUser?.name,
          email: ownerUser?.email,
        },
        subscription: ownerSubscription
          ? {
              planName: ownerSubscription.plan.name,
              type: ownerSubscription.plan.type,
              description: ownerSubscription.plan.description,
              startDate: ownerSubscription.startDate,
              endDate: ownerSubscription.endDate,
              remainingDays: getRemainingDays(
                ownerSubscription.plan.type,
                ownerSubscription.plan.durationDays,
                ownerSubscription.endDate,
                now
              ),
              detailsSubscription: ownerSubscription.plan,
            }
          : null,
      });
    }

    let subscription = await prisma.userSubscription.findFirst({
      where: { userId, isActive: true },
      include: { plan: true },
    });

    if (
      subscription &&
      !isLifetimeSubscription(subscription.plan.type, subscription.plan.durationDays) &&
      now > subscription.endDate
    ) {
      await prisma.userSubscription.update({
        where: { id: subscription.id },
        data: { isActive: false },
      });

      subscription = null;
    }

    if (!subscription) {
      const defaultPlan = await prisma.subscriptionPlan.findFirst({
        where: { type: 'trader-basic' },
      });

      if (!defaultPlan) {
        return NextResponse.json({
          status: 'NO_PLAN',
          message: 'Default plan not configured',
        });
      }

      const startDate = new Date();
      const endDate = buildSubscriptionEndDate(
        startDate,
        defaultPlan.durationDays,
        defaultPlan.type
      );

      const defaultSubscription = await prisma.userSubscription.upsert({
        where: { userId },
        create: {
          userId,
          planId: defaultPlan.id,
          startDate,
          endDate,
          isActive: true,
        },
        update: {
          planId: defaultPlan.id,
          startDate,
          endDate,
          isActive: true,
        },
        include: { plan: true },
      });

      return NextResponse.json({
        status: 'ACTIVE',
        subscription: {
          id: defaultSubscription.id,
          planName: defaultSubscription.plan.name,
          type: defaultSubscription.plan.type,
          description: defaultSubscription.plan.description,
          startDate,
          endDate,
          remainingDays: getRemainingDays(
            defaultSubscription.plan.type,
            defaultSubscription.plan.durationDays,
            endDate,
            now
          ),
          detailsSubscription: defaultSubscription.plan,
        },
      });
    }

    return NextResponse.json({
      status: 'ACTIVE',
      subscription: {
        id: subscription.id,
        planName: subscription.plan.name,
        type: subscription.plan.type,
        description: subscription.plan.description,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        remainingDays: getRemainingDays(
          subscription.plan.type,
          subscription.plan.durationDays,
          subscription.endDate,
          now
        ),
        detailsSubscription: subscription.plan,
      },
    });
  } catch (error) {
    console.error('Subscription check error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
