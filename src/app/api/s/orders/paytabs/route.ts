import { NextRequest, NextResponse } from 'next/server';
import { orderPaymentService } from '@/server/services/order-s-payment.service';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const { storeId, userId, items, customerInfo, paymentMethod } = data;

    const result = await orderPaymentService.createPaymentForOrder({
      storeId,
      userId: userId ?? null,
      items,
      customerInfo,
      paymentMethod,
    });

    return NextResponse.json(
      {
        success: true,
        order: result.order,
        redirect_url: result.redirect_url,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Failed to create order + payment:', error);

    try {
      const parsedError = JSON.parse(error.message);

      if (parsedError.message === 'Validation failed') {
        return NextResponse.json(
          { error: 'Validation failed', details: parsedError.details },
          { status: 400 }
        );
      }
    } catch {}

    if (error.message === 'Invalid input') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}