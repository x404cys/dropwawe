import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

const BASE_URL = "https://www.matager.store";

async function updateSubmission(
  cartId: string,
  tranRef: string,
  respStatus: string,
  respMessage: string
) {
  if (!cartId) return false;
  const isSuccess = respStatus === 'A' || respStatus === 'H';
  await prisma.paymentLinkSubmission.updateMany({
    where: { cartId },
    data: {
      tranRef: tranRef || null,
      respCode: respStatus || null,
      respMessage: respMessage || null,
      status: isSuccess ? 'PAID' : 'FAILED',
    },
  });
  return isSuccess;
}

export async function GET(req: Request) {
  try {
    const params = new URL(req.url).searchParams;

    const cartId = params.get('cartId') ?? params.get('cart_id') ?? '';
    const tranRef = params.get('tranRef') ?? '';
    const respStatus = params.get('respStatus') ?? '';
    const respMessage = params.get('respMessage') ?? '';

    const isSuccess = await updateSubmission(cartId, tranRef, respStatus, respMessage);

     const paymentLinkId = cartId.split('-').slice(1, -1).join('-');

    const returnUrl =
      `${BASE_URL}/pay/${paymentLinkId}` +
      `?status=${isSuccess ? 'success' : 'failed'}` +
      `&tranRef=${encodeURIComponent(tranRef)}` +
      `&respStatus=${encodeURIComponent(respStatus)}` +
      `&cartId=${encodeURIComponent(cartId)}`;

    return NextResponse.redirect(returnUrl, { status: 303 });
  } catch (error) {
    console.error('PayTabs GET callback error:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const data: Record<string, string> = {};

    for (const [key, value] of formData.entries()) {
      data[key] = typeof value === 'string' ? value : '';
    }

    const cartId = data.cartId ?? data.cart_id ?? '';
    const tranRef = data.tranRef ?? '';
    const respStatus = data.respStatus ?? '';
    const respMessage = data.respMessage ?? '';

    await updateSubmission(cartId, tranRef, respStatus, respMessage);

    const paymentLinkId = cartId.split('-').slice(1, -1).join('-');

    const returnUrl =
      `${BASE_URL}/pay/${paymentLinkId}` +
      `?status=${respStatus === 'A' || respStatus === 'H' ? 'success' : 'failed'}` +
      `&tranRef=${encodeURIComponent(tranRef)}` +
      `&respStatus=${encodeURIComponent(respStatus)}` +
      `&cartId=${encodeURIComponent(cartId)}`;

    return NextResponse.redirect(returnUrl, { status: 303 });
  } catch (error) {
    console.error('PayTabs POST callback error:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
