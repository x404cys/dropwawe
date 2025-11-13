import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cartId = searchParams.get('cartId');

    if (!cartId) {
      return NextResponse.json({ success: false, message: 'Missing cartId' }, { status: 400 });
    }

    const payment = await prisma.paymentOrder.findUnique({
      where: { cartId },
      include: {
        order: true,
      },
    });

    if (!payment) {
      return NextResponse.json({ success: false, message: 'Payment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, payment }, { status: 200 });
  } catch (err) {
    console.error('Fetch Payment Error:', err);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
