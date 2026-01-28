import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/app/lib/db';
import { authOperation } from '@/app/lib/authOperation';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOperation);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const freePlan = await prisma.subscriptionPlan.findFirst({
      where: { type: 'free-trial' },
    });

    if (!freePlan) {
      return NextResponse.json({ message: 'Free plan not configured' }, { status: 404 });
    }

    const existingSubscription = await prisma.userSubscription.findFirst({
      where: {
        userId: session.user.id,
        planId: freePlan.id,
      },
    });

    if (existingSubscription) {
      return NextResponse.json({ message: 'Free trial already used' }, { status: 400 });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + freePlan.durationDays);

    const subscription = await prisma.userSubscription.create({
      data: {
        userId: session.user.id,
        planId: freePlan.id,
        startDate,
        endDate,
        isActive: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Free trial activated successfully',
        subscription,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Free Subscription Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
