import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL!;

async function updateSubmission(
  cartId: string,
  tranRef: string,
  respStatus: string,
  respMessage: string
) {
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

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;

    const cartId = params.get('cartId') ?? params.get('cart_id') ?? '';
    const tranRef = params.get('tranRef') ?? params.get('tran_ref') ?? '';
    const respStatus = params.get('respStatus') ?? params.get('resp_status') ?? '';
    const respMessage = params.get('respMessage') ?? params.get('resp_message') ?? '';

    console.log('[PayTabs GET]', { cartId, respStatus });

    if (!cartId) {
      return NextResponse.redirect(`${BASE_URL}/pay/unknown?error=1`, { status: 303 });
    }

    const isSuccess = await updateSubmission(cartId, tranRef, respStatus, respMessage);

    const parts = cartId.split('-');
    const paymentLinkId = parts.slice(1, -1).join('-');

    const redirectUrl = `${BASE_URL}/pay/${paymentLinkId}?status=${isSuccess ? 'success' : 'failed'}&cart=${encodeURIComponent(cartId)}`;

    return NextResponse.redirect(redirectUrl, { status: 303 });
  } catch (error) {
    console.error('[PayTabs GET] error:', error);
    return NextResponse.redirect(`${BASE_URL}/pay/unknown?error=1`, { status: 303 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let cartId = '';
    let tranRef = '';
    let respStatus = '';
    let respMessage = '';

    const contentType = req.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
      const body = await req.json();
      cartId = body.cart_id ?? body.cartId ?? '';
      tranRef = body.tran_ref ?? body.tranRef ?? '';
      respStatus = body.payment_result?.response_status ?? body.respStatus ?? '';
      respMessage = body.payment_result?.response_message ?? body.respMessage ?? '';
    } else {
      const formData = await req.formData();
      const d: Record<string, string> = {};
      for (const [k, v] of formData.entries()) {
        d[k] = typeof v === 'string' ? v : '';
      }
      cartId = d.cartId ?? d.cart_id ?? '';
      tranRef = d.tranRef ?? d.tran_ref ?? '';
      respStatus = d.respStatus ?? d.resp_status ?? '';
      respMessage = d.respMessage ?? d.resp_message ?? '';
    }

    console.log('[PayTabs POST]', { cartId, respStatus });

    if (!cartId) {
      return NextResponse.json({ error: 'missing cartId' }, { status: 400 });
    }

    await updateSubmission(cartId, tranRef, respStatus, respMessage);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[PayTabs POST] error:', error);
    return NextResponse.json({ error: 'server error' }, { status: 200 });
  }
}
