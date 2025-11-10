import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const respStatus = searchParams.get('respStatus');
    const tranRef = searchParams.get('tranRef');
    const cartId = searchParams.get('cartId');

    console.log('💳 PayTabs Redirect Callback:', { respStatus, tranRef, cartId });

    if (respStatus === 'A') {
      return NextResponse.redirect(
        `https://accseshop.matager.store/storev2/payment-result?status=success&tranRef=${tranRef}&cartId=${cartId}`
      );
    } else {
      return NextResponse.redirect(
        `https://accseshop.matager.store/storev2/payment-result?status=failed&tranRef=${tranRef}&cartId=${cartId}`
      );
    }
  } catch (err) {
    console.error('Callback GET error:', err);
    return NextResponse.redirect(
      'https://accseshop.matager.store/storev2/payment-result?status=error'
    );
  }
}
