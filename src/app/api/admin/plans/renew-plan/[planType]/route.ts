import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';
import { planRoleMap } from '@/app/lib/planRoleMap';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ planType: string }> }
) {
  try {
    const session = await getServerSession(authOperation);

    if (!session?.user?.id || session.user.role !== 'A') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ message: 'userId is required' }, { status: 400 });
    }

    const { planType } = await context.params;

    if (!planType) {
      return NextResponse.json({ message: 'Plan type is required' }, { status: 400 });
    }

    const role = planRoleMap[planType];

    if (role) {
      await prisma.user.update({
        where: { id: userId },
        data: { role },
      });
    }

    const plan = await prisma.subscriptionPlan.findFirst({
      where: { type: planType },
    });

    if (!plan) {
      return NextResponse.json({ message: 'Plan not found' }, { status: 404 });
    }

    const now = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    const currentSubscription = await prisma.userSubscription.findUnique({
      where: { userId },
    });

    if (currentSubscription) {
      await prisma.subscriptionHistory.create({
        data: {
          userId,
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
        userId,
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
