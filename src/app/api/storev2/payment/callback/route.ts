import { NextResponse } from 'next/server';

export async function handler(req: Request) {
  const data: Record<string, string> = {
    tranRef: '',
    respStatus: '',
    respMessage: '',
    cartId: '',
  };

  try {
    if (req.method === 'POST') {
      const formData = await req.formData();
      for (const [key, value] of formData.entries()) {
        data[key] = typeof value === 'string' ? value : '';
      }
    } else if (req.method === 'GET') {
      const params = new URL(req.url).searchParams;
      data.tranRef = params.get('tranRef') ?? '';
      data.respStatus = params.get('respStatus') ?? '';
      data.respMessage = params.get('respMessage') ?? '';
      data.cartId = params.get('cartId') ?? '';
    }

    const returnUrl = `${new URL(req.url).origin}/storev2/payment-result?tranRef=${data.tranRef}&respStatus=${data.respStatus}&respMessage=${data.respMessage}&cartId=${data.cartId}`;

    console.log('PAYTABS CALLBACK DATA:', data);

    return NextResponse.redirect(returnUrl);
  } catch (err) {
    console.error('Callback error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export { handler as GET, handler as POST };
