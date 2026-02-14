import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOperation } from '@/app/lib/authOperation';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOperation);

  const coupons = await prisma.coupon.findMany({
    where: {
      userId: session?.user.id,
    },
  });

  return NextResponse.json(coupons);
}
