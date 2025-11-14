import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const tranRef = params.get('tranRef') ?? '';
  const respStatus = params.get('respStatus') ?? '';
  const respMessage = params.get('respMessage') ?? '';
  const cartId = params.get('cartId') ?? '';

  const returnUrl = `${new URL(req.url).origin}/storev2/payment-result?tranRef=${tranRef}&respStatus=${respStatus}&respMessage=${respMessage}&cartId=${cartId}`;
  console.log('PAYTABS CALLBACK GET:', { tranRef, respStatus, respMessage, cartId });

  return NextResponse.redirect(returnUrl, { status: 303 });
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const data: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    data[key] = typeof value === 'string' ? value : '';
  }

  const returnUrl = `${new URL(req.url).origin}/storev2/payment-result?tranRef=${data.tranRef}&respStatus=${data.respStatus}&respMessage=${data.respMessage}&cartId=${data.cartId}`;
  console.log('PAYTABS CALLBACK POST:', data);

  return NextResponse.redirect(returnUrl, { status: 303 });
}
