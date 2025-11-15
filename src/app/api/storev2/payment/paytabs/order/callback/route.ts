import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const tranRef = params.get('tranRef') ?? '';
  const respStatus = params.get('respStatus') ?? '';
  const respMessage = params.get('respMessage') ?? '';
  const cartId = params.get('cartId') ?? '';
  const customerEmail = params.get('customerEmail') ?? '';
  const signature = params.get('signature') ?? '';
  const token = params.get('token') ?? '';
  const acquirerRRN = params.get('acquirerRRN') ?? '';
  const paymentOrder = await prisma.paymentOrder.findUnique({
    where: { cartId },
    include: { order: { include: { items: true } } },
  });

  if (!paymentOrder) {
    return NextResponse.redirect(
      `${new URL(req.url).origin}/storev2/payment-result?cartId=${cartId}&status=NOT_FOUND`,
      { status: 303 }
    );
  }

  const payment = await prisma.payment.update({
    where: { cartId },
    data: {
      tranRef,
      respCode: respStatus,
      respMessage,
      customerEmail,
      signature,
      token,
      status: respStatus === 'A' ? 'Success' : 'Failed',
    },
  });

  if (respStatus === 'A') {
    const order = paymentOrder.order;
    await Promise.all(
      order.items.map(item =>
        prisma.product.update({
          where: { id: item.productId! },
          data: { quantity: { decrement: item.quantity } },
        })
      )
    );

    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'DELIVERED' },
    });
  } else {
    await prisma.payment.delete({
      where: { cartId },
    });
  }
  const returnUrl = `${new URL(req.url).origin}/storev2/payment-result?tranRef=${tranRef}&respStatus=${respStatus}&respMessage=${respMessage}&cartId=${cartId}`;

  return NextResponse.redirect(returnUrl, { status: 303 });
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const data: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    data[key] = typeof value === 'string' ? value : '';
  }
  const paymentOrder = await prisma.paymentOrder.findUnique({
    where: { cartId: data.cartId },
    include: { order: { include: { items: true } } },
  });

  if (!paymentOrder) {
    return NextResponse.redirect(
      `${new URL(req.url).origin}/storev2/payment-result?cartId=${data.cartId}&status=NOT_FOUND`,
      { status: 303 }
    );
  }

  const payment = await prisma.payment.update({
    where: { cartId: data.cartId },
    data: {
      tranRef: data.tranRef,
      respCode: data.respStatus,
      respMessage: data.respMessage,
      customerEmail: data.customerEmail,
      signature: data.signature,
      token: data.token,
      status: data.respStatus === 'A' ? 'Success' : 'Failed',
    },
  });

  if (data.respStatus === 'A') {
    const order = paymentOrder.order;
    await Promise.all(
      order.items.map(item =>
        prisma.product.update({
          where: { id: item.productId! },
          data: { quantity: { decrement: item.quantity } },
        })
      )
    );

    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'DELIVERED' },
    });
  } else {
    await prisma.payment.delete({
      where: { cartId: data.cartId },
    });
  }
  const returnUrl = `${new URL(req.url).origin}/storev2/payment-result?tranRef=${data.tranRef}&respStatus=${data.respStatus}&respMessage=${data.respMessage}&cartId=${data.cartId}`;
  //
  return NextResponse.redirect(returnUrl, { status: 303 });
}
