import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams;

  const data = {
    tranRef: params.get('tranRef'),
    respStatus: params.get('respStatus'),
    respMessage: params.get('respMessage'),
    cartId: params.get('cartId'),
  };

  console.log('PAYTABS CALLBACK GET:', data);

  const returnUrl = `/storev2/payment-result?tranRef=${data.tranRef}&respStatus=${data.respStatus}&respMessage=${data.respMessage}&cartId=${data.cartId}`;
  return NextResponse.json({ data, returnUrl });
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const data = Object.fromEntries(formData.entries());

  console.log('PAYTABS CALLBACK POST:', data);

  const returnUrl = `/storev2/payment-result?tranRef=${data.tranRef}&respStatus=${data.respStatus}&respMessage=${data.respMessage}&cartId=${data.cartId}`;
  return NextResponse.json({ data, returnUrl });
}
