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
  const payment = await prisma.payment.create({
    data: {
      tranRef: tranRef,
      respCode: respStatus,
      respMessage: respMessage,
      cartId: cartId,
      amount: 100,
      customerEmail: customerEmail,
      signature: signature,
      token: token,
      status: respStatus === 'A' ? 'Success' : 'Failed',
    },
  });

  const returnUrl = `${new URL(req.url).origin}/storev2/payment-result?tranRef=${tranRef}&respStatus=${respStatus}&respMessage=${respMessage}&cartId=${cartId}`;

  return NextResponse.redirect(returnUrl, { status: 303 });
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const data: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    data[key] = typeof value === 'string' ? value : '';
  }
  const payment = await prisma.payment.create({
    data: {
      tranRef: data.tranRef,
      respCode: data.respStatus,
      respMessage: data.respMessage,
      cartId: data.cartId,
      amount: 100,
      customerEmail: data.customerEmail,
      signature: data.signature,
      token: data.token,
      status: data.respStatus === 'A' ? 'Success' : 'Failed',
    },
  });
  const returnUrl = `${new URL(req.url).origin}/storev2/payment-result?tranRef=${data.tranRef}&respStatus=${data.respStatus}&respMessage=${data.respMessage}&cartId=${data.cartId}`;
//
  return NextResponse.redirect(returnUrl, { status: 303 });
}
