import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/app/lib/db';
import { authOperation } from '@/app/lib/authOperation';

export async function GET() {
  try {
    const session = await getServerSession(authOperation);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const subscription = await prisma.userSubscription.findFirst({
      where: { userId, isActive: true },
      include: { plan: true },
    });

    if (!subscription) {
      return NextResponse.json({
        isActive: false,
        message: 'No active subscription found',
      });
    }

    const now = new Date();
    const endDate = new Date(subscription.endDate);

    if (now > endDate) {
      await prisma.userSubscription.update({
        where: { id: subscription.id },
        data: { isActive: false },
      });

      return NextResponse.json({
        isActive: false,
        message: 'Subscription expired',
        expiredAt: endDate,
      });
    }

    return NextResponse.json({
      isActive: true,
      subscription: {
        id: subscription.id,
        planName: subscription.plan.name,
        type: subscription.plan.type,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        remainingDays: Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
        detailsSubscription: subscription.plan,
      },
    });
  } catch (error) {
    console.error('Subscription check error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
