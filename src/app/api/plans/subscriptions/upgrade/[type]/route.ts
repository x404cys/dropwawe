import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/app/lib/db';
import { authOperation } from '@/app/lib/authOperation';

export async function POST(
  req: Request,
  context: { params: Promise<{ type: 'NORMAL' | 'MODREN' | 'PENDINGROFESSIONAL' }> }
) {
  const session = await getServerSession(authOperation);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  const typeOfPlanRaw = (await context.params).type;
  let typeOfPlan: 'NORMAL' | 'MODERN' | 'PENDINGROFESSIONAL';
  if (typeOfPlanRaw === 'MODREN') {
    typeOfPlan = 'MODERN';
  } else {
    typeOfPlan = typeOfPlanRaw;
  }

  const plan = await prisma.subscriptionPlan.findFirst({
    where: { type: typeOfPlan },
  });

  if (!plan) {
    return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
  }

  const existingSubscription = await prisma.userSubscription.findFirst({
    where: { userId, planId: plan.id, isActive: true },
  });

  if (existingSubscription) {
    return NextResponse.json({
      message: `You are already subscribed to the ${plan.name} plan.`,
      subscription: existingSubscription,
    });
  }

  await prisma.userSubscription.updateMany({
    where: { userId, isActive: true },
    data: { isActive: false, canceledAt: new Date() },
  });

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + plan.durationDays);

  const subscription = await prisma.userSubscription.create({
    data: {
      userId,
      planId: plan.id,
      startDate,
      endDate,
      isActive: true,
      limitProducts: plan.maxProducts ?? null,
    },
  });

  return NextResponse.json({
    message: 'Subscription created successfully',
    subscription,
  });
}
