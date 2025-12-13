import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOperation } from '@/app/lib/authOperation';

export async function POST(req: Request, context: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await context.params;
    const session = await getServerSession(authOperation);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!orderId) return NextResponse.json({ error: 'Order ID required' }, { status: 400 });

    const body = await req.json();
    const { cityId, regionId } = body;
    if (!cityId || !regionId)
      return NextResponse.json({ error: 'cityId and regionId are required' }, { status: 400 });

    let order;
    if (session.user.role === 'SUPPLIER') {
      order = await prisma.orderFromTrader.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      if (!order || order.supplierId !== session.user.id) {
        return NextResponse.json({ error: 'Order not found or unauthorized' }, { status: 404 });
      }
    } else {
      order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      if (!order || order.userId !== session.user.id) {
        return NextResponse.json({ error: 'Order not found or unauthorized' }, { status: 404 });
      }
    }

    const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);
    const marchent = await prisma.merchant.findUnique({ where: { userId: session.user.id } });

    const formdata = new FormData();
    formdata.append('client_name', order.fullName ?? 'Unknown');
    formdata.append('client_mobile', order.phone ?? '');
    formdata.append('client_mobile2', order.phone ?? '');
    formdata.append('city_id', cityId);
    formdata.append('region_id', regionId);
    formdata.append('type_name', 'منتج');
    formdata.append('items_number', String(itemCount));
    formdata.append('price', String(order.total ?? 0));
    formdata.append('location', order.location ?? 'market');
    formdata.append('package_size', '1');
    formdata.append('merchant_notes', '');
    formdata.append('replacement', '0');

    const waseetReq = await fetch(
      `https://api.alwaseet-iq.net/v1/merchant/create-order?token=${marchent?.token}`,
      { method: 'POST', body: formdata, redirect: 'follow' }
    );

    const waseetRes = await waseetReq.json();

    return NextResponse.json({
      success: true,
      message: 'Order sent successfully',
      waseetResponse: waseetRes,
    });
  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
