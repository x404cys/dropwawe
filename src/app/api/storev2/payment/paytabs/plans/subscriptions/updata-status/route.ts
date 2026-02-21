import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';
import { planRoleMap } from '@/app/lib/planRoleMap';

interface PatchBody {
  tranRef?: string;
  respCode?: string;
  respMessage?: string;
  cartId: string;
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOperation);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized: no session found' }, { status: 401 });
    }

    const body: PatchBody = await req.json().catch(() => ({}) as PatchBody);
    const { cartId } = body;

    if (!cartId) {
      return NextResponse.json({ error: 'cartId is required' }, { status: 400 });
    }

    const checkPayment = await prisma.payment.findUnique({ where: { cartId } });
    if (!checkPayment) {
      return NextResponse.json(
        { error: `Payment not found for cartId: ${cartId}` },
        { status: 404 }
      );
    }

    const subscription = await prisma.userSubscription.findUnique({
      where: { userId: session.user.id },
      include: {
        plan: true,
      },
    });
    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found for user' }, { status: 404 });
    }
    const updated = await prisma.userSubscription.update({
      where: { id: subscription.id },
      data: { isActive: true },
    });
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: subscription.planId },
    });
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }
    const role = planRoleMap[plan?.type];
    if (role) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { role: role },
      });
    }
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        message: `تم الاشتراك في الباقة ${subscription.plan.name + '-' + subscription.plan.price + '-' + subscription.plan.type} `,
        type: 'Sub',
      },
    });
    return NextResponse.json({ success: true, subscription: updated });
  } catch (error) {
    console.error('Unexpected PATCH error:', error);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
