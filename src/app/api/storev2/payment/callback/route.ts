import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.formData();
  const data = Object.fromEntries(body);

  const { respStatus, tranRef, cartId, respMessage, amount } = data;

  console.log('PayTabs callback received:', data);

  const redirectUrl = new URL(
    '/storev2/payment-result',
    process.env.NEXT_PUBLIC_SITE_URL || 'https://accseshop.matager.store'
  );
  redirectUrl.searchParams.set('respStatus', respStatus as string);
  redirectUrl.searchParams.set('tranRef', tranRef as string);
  redirectUrl.searchParams.set('cartId', cartId as string);
  redirectUrl.searchParams.set('respMessage', respMessage as string);
  redirectUrl.searchParams.set('amount', amount as string);

  return NextResponse.redirect(redirectUrl);
}
