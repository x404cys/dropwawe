import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';
import { canUserAccessFeature, getFeatureAccessError } from '@/app/lib/subscription-access';
import { STORE_FEATURE_PLANS } from '@/lib/subscription/feature-access';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOperation);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const canManage = await canUserAccessFeature(session.user.id, STORE_FEATURE_PLANS.coupon);
  if (!canManage) {
    return NextResponse.json(getFeatureAccessError(STORE_FEATURE_PLANS.coupon), { status: 403 });
  }

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { id: id, userId: session.user.id },
    });

    if (!coupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }
    await prisma.coupon.update({
      where: {
        id: id,
      },
      data: {
        isActive: !coupon.isActive,
      },
    });
    return NextResponse.json({ message: 'Success' }, { status: 201 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
