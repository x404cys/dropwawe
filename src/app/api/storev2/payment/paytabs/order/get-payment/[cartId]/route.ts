import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: Request, context: { params: Promise<{ cartId: string }> }) {
  const { cartId } = await context.params;

  const order = await prisma.order.findMany({
    where: {
      paymentOrder: {
        cartId: cartId,
      },
    },
    include: {
      items: true,
      paymentOrder: true,
    },
  });

  return NextResponse.json(order);
}
