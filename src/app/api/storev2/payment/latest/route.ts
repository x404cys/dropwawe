import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

export async function GET() {
  const session = await getServerSession(authOperation);
  //   if (!session || session.user.role !== 'A') {
  //     return;
  //   }

  const payment = await prisma.payment.findMany();
  const paymentOrder = await prisma.paymentOrder.findMany({
    include: {
      order: {
        include: {
          user: true,
        },
      },
    },
  });
  return NextResponse.json({ payment, paymentOrder });
}
