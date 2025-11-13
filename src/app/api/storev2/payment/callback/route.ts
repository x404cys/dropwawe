import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function POST(req: Request) {
  try {
    let data: Record<string, string>;

    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await req.json();
    } else {
      const formData = await req.formData();
      data = Object.fromEntries(formData.entries()) as Record<string, string>;
    }

    const { tranRef, cartId, respStatus, respCode, respMessage, customerEmail, signature } = data;

    if (!cartId) {
      return NextResponse.json({ success: false, message: 'Missing cartId' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: cartId } });
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }
//
    const payment = await prisma.paymentOrder.create({
      data: {
        orderId: order.id,
        cartId,
        tranRef,
        amount: parseFloat(data.cart_amount || '0'),
        status: respStatus || 'F',
        respCode,
        respMessage,
        customerEmail,
        signature,
      },
    });

    return NextResponse.json({ success: true, payment }, { status: 200 });
  } catch (err) {
    console.error('IPN Error:', err);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
