import { NextResponse } from 'next/server';
import { orderPaymentService } from '@/server/services/order-payment.service';

export async function GET(req: Request, context: { params: Promise<{ cartId: string }> }) {
  const { cartId } = await context.params;

  const order = await orderPaymentService.getPaymentDetails(cartId);

  return NextResponse.json(order);
}
