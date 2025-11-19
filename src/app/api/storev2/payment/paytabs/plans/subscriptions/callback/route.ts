import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

async function handlePayment(
  cartId: string,
  tranRef: string,
  respStatus: string,
  respMessage: string,
  customerEmail: string,
  signature: string,
  token: string
) {}

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const cartId = params.get('cartId') ?? '';
  const tranRef = params.get('tranRef') ?? '';
  const respStatus = params.get('respStatus') ?? '';
  const respMessage = params.get('respMessage') ?? '';
  const customerEmail = params.get('customerEmail') ?? '';
  const signature = params.get('signature') ?? '';
  const token = params.get('token') ?? '';

  await handlePayment(cartId, tranRef, respStatus, respMessage, customerEmail, signature, token);

  const returnUrl = `${new URL(req.url).origin}/storev2/payment-result?tranRef=${tranRef}&respStatus=${respStatus}&respMessage=${respMessage}&cartId=${cartId}`;
  return NextResponse.redirect(returnUrl, { status: 303 });
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const data: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    data[key] = typeof value === 'string' ? value : '';
  }

  await handlePayment(
    data.cartId ?? '',
    data.tranRef ?? '',
    data.respStatus ?? '',
    data.respMessage ?? '',
    data.customerEmail ?? '',
    data.signature ?? '',
    data.token ?? ''
  );

  const returnUrl = `${new URL(req.url).origin}/storev2/payment-result?tranRef=${data.tranRef}&respStatus=${data.respStatus}&respMessage=${data.respMessage}&cartId=${data.cartId}`;
  return NextResponse.redirect(returnUrl, { status: 303 });
}
