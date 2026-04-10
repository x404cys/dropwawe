import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';
import { planRoleMap } from '@/app/lib/planRoleMap';
import { buildSubscriptionEndDate } from '@/lib/subscription/subscription-period';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOperation);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const role = planRoleMap['trader-basic'];

    if (role) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { role },
      });
    }

    const plan = await prisma.subscriptionPlan.findFirst({
      where: { type: 'trader-basic' },
    });

    if (!plan) {
      return NextResponse.json({ message: 'Plan not found' }, { status: 404 });
    }

    const now = new Date();
    const endDate = buildSubscriptionEndDate(now, plan.durationDays, plan.type);

    const currentSubscription = await prisma.userSubscription.findUnique({
      where: { userId },
    });

    if (currentSubscription) {
      await prisma.subscriptionHistory.create({
        data: {
          userId: userId!,
          planId: currentSubscription.planId,
          subscriptionId: currentSubscription.id,
          startDate: currentSubscription.startDate,
          endDate: currentSubscription.endDate,
          price: plan.price,
          status: 'EXPIRED',
        },
      });
    }

    const subscription = await prisma.userSubscription.upsert({
      where: { userId },
      create: {
        userId,
        planId: plan.id,
        startDate: now,
        endDate,
        isActive: true,
      },
      update: {
        planId: plan.id,
        startDate: now,
        endDate,
        isActive: true,
      },
    });

    await prisma.subscriptionHistory.create({
      data: {
        userId: userId!,
        planId: plan.id,
        subscriptionId: subscription.id,
        startDate: now,
        endDate,
        price: plan.price,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json(
      {
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Subscription Error:', error);

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
