import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { tranRef, respCode, respMessage, cartId } = body;

    if (!cartId) {
      return NextResponse.json({ error: 'cartId is required' }, { status: 400 });
    }

    const updated = await prisma.payment.update({
      where: { cartId },
      data: {
        tranRef,
        respCode,
        respMessage,
        
      },
    });

    return NextResponse.json({ success: true, payment: updated });
  } catch (error) {
    return NextResponse.json(
      { error: 'failed to update payment', details: error },
      { status: 500 }
    );
  }
}
