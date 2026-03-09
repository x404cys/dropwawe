import { NextRequest, NextResponse } from 'next/server';
import { orderPaymentService } from '@/server/services/order-payment.service';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      storeId,
      userId,
      items,
      fullName,
      location,
      phone,
      total,
      selectedColor,
      selectedSize,
    } = data;

    const result = await orderPaymentService.createPaymentForOrder(
      storeId,
      userId,
      fullName,
      location,
      phone,
      items.map((item: any) => ({ ...item, selectedColor, selectedSize }))
    );

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

    // Attempt to parse validation errors thrown from the service
    try {
      const parsedError = JSON.parse(error.message);
      if (parsedError.message === 'Validation failed') {
        return NextResponse.json(
          { error: 'Validation failed', details: parsedError.details },
          { status: 400 }
        );
      }
    } catch (e) {
      // Ignored, not a JSON string error means it's a standard error
    }

    if (error.message === 'Invalid input') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
