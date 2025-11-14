import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams;

  const tranRef = params.get('tranRef') ?? '';
  const respStatus = params.get('respStatus') ?? '';
  const respMessage = params.get('respMessage') ?? '';
  const cartId = params.get('cartId') ?? '';

  const returnUrl = `/storev2/payment-result?tranRef=${tranRef}&respStatus=${respStatus}&respMessage=${respMessage}&cartId=${cartId}`;

  return NextResponse.redirect(returnUrl);
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const data = Object.fromEntries(formData.entries());

  const tranRef = data.tranRef ?? '';
  const respStatus = data.respStatus ?? '';
  const respMessage = data.respMessage ?? '';
  const cartId = data.cartId ?? '';

  const returnUrl = `/storev2/payment-result?tranRef=${tranRef}&respStatus=${respStatus}&respMessage=${respMessage}&cartId=${cartId}`;

  return NextResponse.redirect(returnUrl);
}
