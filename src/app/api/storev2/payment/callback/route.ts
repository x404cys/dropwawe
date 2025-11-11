import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  return handleCallback(req);
}

export async function POST(req: Request) {
  return handleCallback(req);
}

async function handleCallback(req: Request) {
  try {
    let respStatus, tranRef, cartId;

    if (req.method === 'POST') {
      const formData = await req.formData();
      const data = Object.fromEntries(formData.entries());
      respStatus = data.respStatus;
      tranRef = data.tranRef;
      cartId = data.cartId;
    } else {
      const { searchParams } = new URL(req.url);
      respStatus = searchParams.get('respStatus');
      tranRef = searchParams.get('tranRef');
      cartId = searchParams.get('cartId');
    }

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
    console.error('Callback error:', err);
    return NextResponse.redirect(
      'https://accseshop.matager.store/storev2/payment-result?status=error'
    );
  }
}
