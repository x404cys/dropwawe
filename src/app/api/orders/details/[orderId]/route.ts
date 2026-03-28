import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

const productSelect = {
  id: true,
  name: true,
  image: true,
  description: true,
  category: true,
  price: true,
  discount: true,
  isFromSupplier: true,
} as const;

const paymentOrderSelect = {
  id: true,
  cartId: true,
  tranRef: true,
  amount: true,
  currency: true,
  status: true,
  respCode: true,
  respMessage: true,
  customerEmail: true,
  createdAt: true,
} as const;

const couponSelect = {
  id: true,
  code: true,
  type: true,
  value: true,
  scope: true,
  maxDiscount: true,
  expiresAt: true,
  isActive: true,
} as const;

const storeSelect = {
  id: true,
  name: true,
  subLink: true,
  phone: true,
  shippingPrice: true,
  shippingType: true,
  methodPayment: true,
  description: true,
} as const;

const userSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  storeName: true,
} as const;

const supplierSelect = {
  id: true,
  name: true,
  phone: true,
  address: true,
  paymentInfo: true,
  methodPayment: true,
} as const;

export async function GET(req: Request, context: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await context.params;
    const session = await getServerSession(authOperation);

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: productSelect,
            },
          },
        },
        paymentOrder: {
          select: paymentOrderSelect,
        },
        coupon: {
          select: couponSelect,
        },
        store: {
          select: storeSelect,
        },
        user: {
          select: userSelect,
        },
      },
    });

    if (order) {
      return NextResponse.json({
        ...order,
        orderSource: 'ORDER' as const,
      });
    }

    if (session?.user.role === 'SUPPLIER') {
      const traderOrder = await prisma.orderFromTrader.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: {
                select: productSelect,
              },
            },
          },
          paymentOrder: {
            select: paymentOrderSelect,
          },
          trader: {
            select: userSelect,
          },
          supplier: {
            select: supplierSelect,
          },
        },
      });

      if (traderOrder) {
        return NextResponse.json({
          ...traderOrder,
          orderSource: 'TRADER_ORDER' as const,
        });
      }

      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await context.params;
    const session = await getServerSession(authOperation);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
