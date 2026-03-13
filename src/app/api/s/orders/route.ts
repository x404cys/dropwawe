// Purpose: POST /api/s/orders
// Creates a new order from the storefront checkout form.
// Validates input, computes totals from DB prices (not client prices), and stores order.

import { prisma } from '@/app/lib/db';

export async function POST(req: Request) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body: any = await req.json();
    const { storeId, items, customerInfo, paymentMethod } = body;

    if (!storeId || !items?.length || !customerInfo?.name || !customerInfo?.phone) {
      return Response.json({ error: 'بيانات ناقصة' }, { status: 400 });
    }

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      return Response.json({ error: 'المتجر غير موجود' }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let total = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderItems = items.map((item: any) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`منتج غير موجود: ${item.productId}`);
      const price = product.discount
        ? product.price - product.price * (product.discount / 100)
        : product.price;
      total += price * item.qty;
      return {
        productId: product.id,
        quantity: item.qty,
        price,
        color: item.color ?? null,
        size: item.size ?? null,
      };
    });

    const order = await prisma.order.create({
      data: {
        storeId,
        fullName: customerInfo.name,
        phone: customerInfo.phone,
        email: customerInfo.email ?? null,
        location: customerInfo.notes ?? null,
        total,
        finalTotal: total,
        status: 'PENDING',
        items: { create: orderItems },
      },
    });

    return Response.json({ success: true, orderId: order.id, total });
  } catch (err) {
    console.error('[ORDER_CREATE]', err);
    return Response.json({ error: 'حدث خطأ، حاول مجدداً' }, { status: 500 });
  }
}
