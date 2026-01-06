import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: Request, context: { params: Promise<{ cartId: string }> }) {
  const { cartId } = await context.params;

  const order = await prisma.order.findFirst({
    where: {
      paymentOrder: {
        cartId: cartId,
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      paymentOrder: true,
      
    },
  });

  return NextResponse.json(order);
}