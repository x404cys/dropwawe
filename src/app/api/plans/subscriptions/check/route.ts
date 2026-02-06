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

    // 1️⃣ منع الـ SubUser
    const isSubUser = await prisma.storeUser.findFirst({
      where: { userId, isOwner: false },
    });

    if (isSubUser) {
      return NextResponse.json({
        isSubUser: true,
        status: 'SUB_USER',
      });
    }

    const now = new Date();

    // 2️⃣ فحص الاشتراك الفعّال
    let subscription = await prisma.userSubscription.findFirst({
      where: { userId, isActive: true },
      include: { plan: true },
    });

    // 3️⃣ إذا موجود لكن منتهي
    if (subscription && now > subscription.endDate) {
      await prisma.userSubscription.update({
        where: { id: subscription.id },
        data: { isActive: false },
      });

      subscription = null;
    }

    // 4️⃣ إذا ما عنده اشتراك → نحاول نفعل Free Trial
    if (!subscription) {
      const freePlan = await prisma.subscriptionPlan.findFirst({
        where: { type: 'free-trial' },
      });

      if (!freePlan) {
        return NextResponse.json({
          status: 'NO_PLAN',
          message: 'Free plan not configured',
        });
      }

      // هل استخدم التجربة سابقاً؟
      const usedTrialBefore = await prisma.userSubscription.findFirst({
        where: {
          userId,
          planId: freePlan.id,
        },
      });

      if (usedTrialBefore) {
        return NextResponse.json({
          status: 'NEED_SUBSCRIPTION',
          message: 'Free trial expired',
        });
      }

      // 5️⃣ تفعيل التجربة المجانية
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + freePlan.durationDays);

      const trialSubscription = await prisma.userSubscription.create({
        data: {
          userId,
          planId: freePlan.id,
          startDate,
          endDate,
          isActive: true,
        },
        include: { plan: true },
      });

      return NextResponse.json({
        status: 'TRIAL_ACTIVE',
        subscription: {
          id: trialSubscription.id,
          planName: trialSubscription.plan.name,
          type: trialSubscription.plan.type,
          description: trialSubscription.plan.description,
          startDate,
          endDate,
          remainingDays: Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
          detailsSubscription: trialSubscription.plan,
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
        remainingDays: Math.ceil(
          (subscription.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        ),
        detailsSubscription: subscription.plan,
      },
    });
  } catch (error) {
    console.error('Subscription check error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
