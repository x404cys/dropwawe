import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { cart_id, tran_ref, payment_result } = body;

    if (!cart_id) {
      return NextResponse.json({ error: 'missing cart_id' }, { status: 400 });
    }

    const isSuccess =
      payment_result?.response_status === 'A' || payment_result?.response_status === 'H';

    await prisma.paymentLinkSubmission.update({
      where: { cartId: cart_id },
      data: {
        tranRef: tran_ref,
        respCode: payment_result?.response_status,
        respMessage: payment_result?.response_message,
        status: isSuccess ? 'PAID' : 'FAILED',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PayTabs callback error:', error);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
