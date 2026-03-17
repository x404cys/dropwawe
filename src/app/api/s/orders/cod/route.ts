// POST /api/s/orders
// Creates a new order from the storefront checkout form.
// Validates input, computes totals from DB prices (not client prices), and stores order.

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

type ItemInput = {
  productId: string;
  qty: number;
  color?: string | null;
  size?: string | null;
};

type CustomerInfo = {
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
};

type OrderBody = {
  storeId: string;
  userId?: string | null;
  items: ItemInput[];
  customerInfo: CustomerInfo;
  paymentMethod?: string | null;
};

type SupplierItem = {
  productId: string;
  quantity: number;
  price: number;
  wholesalePrice: number;
  traderProfit: number;
  supplierProfit: number;
  supplierId: string;
};

export async function POST(request: NextRequest) {
  try {
    const body: OrderBody = await request.json();
    const { storeId, userId, items, customerInfo, paymentMethod } = body;

    // ── 1. Basic input validation ──────────────────────────────────────────────
    if (
      !storeId ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !customerInfo?.name ||
      !customerInfo?.phone
    ) {
      return NextResponse.json({ error: 'بيانات ناقصة أو غير صالحة' }, { status: 400 });
    }

    // ── 2. Verify store exists ─────────────────────────────────────────────────
    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      return NextResponse.json({ error: 'المتجر غير موجود' }, { status: 404 });
    }

    // ── 3. Fetch products from DB ──────────────────────────────────────────────
    const productIds = items.map(i => i.productId);
    const productsInDb = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { pricingDetails: true },
    });

    // ── 4. Validate products & build order items (prices from DB, not client) ──
    const validationErrors: { productId: string; type: string; message: string }[] = [];
    let total = 0;

    const orderItems = items.map(item => {
      const product = productsInDb.find(p => p.id === item.productId);

      if (!product) {
        validationErrors.push({
          productId: item.productId,
          type: 'NOT_FOUND',
          message: `منتج غير موجود: ${item.productId}`,
        });
        return null;
      }

      // Always compute price server-side, applying discount if present
      const basePrice = product.discount
        ? product.price - product.price * (product.discount / 100)
        : product.price;

      total += basePrice * item.qty;

      return {
        productId: product.id,
        quantity: item.qty,
        price: basePrice,
        color: item.color ?? null,
        size: item.size ?? null,
      };
    });

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'فشل التحقق من المنتجات', details: validationErrors },
        { status: 400 }
      );
    }

    type OrderItem = {
      productId: string;
      quantity: number;
      price: number;
      color: string | null;
      size: string | null;
    };
    const safeOrderItems = orderItems.filter((i): i is OrderItem => i !== null);

    // ── 5. Create the order ────────────────────────────────────────────────────
    const order = await prisma.order.create({
      data: {
        storeId,
        userId: userId ?? null,
        fullName: customerInfo.name,
        phone: customerInfo.phone,
        email: customerInfo.email ?? null,
        location: customerInfo.address ?? customerInfo.notes ?? null,
        total,
        finalTotal: total,
        paymentMethod: paymentMethod ?? null,
        status: 'PENDING',
        items: { create: safeOrderItems },
      },
      include: { items: true },
    });

    // ── 6. Decrement inventory ─────────────────────────────────────────────────
    await Promise.all(
      items.map(item =>
        prisma.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.qty } },
        })
      )
    );

    // ── 7. Supplier / trader split (only when applicable) ─────────────────────
    const supplierItems: SupplierItem[] = safeOrderItems
      .map((orderItem): SupplierItem | null => {
        const product = productsInDb.find(p => p.id === orderItem.productId);
        if (!product?.isFromSupplier || !product.supplierId) return null;

        const wholesalePrice = product.pricingDetails?.wholesalePrice ?? 0;

        return {
          productId: product.id,
          quantity: orderItem.quantity,
          price: orderItem.price,
          wholesalePrice,
          traderProfit: (orderItem.price - wholesalePrice) * orderItem.quantity,
          supplierProfit: wholesalePrice * orderItem.quantity,
          supplierId: product.supplierId,
        };
      })
      .filter((item): item is SupplierItem => item !== null);

    if (supplierItems.length > 0 && userId) {
      // Group by supplier so each supplier gets their own OrderFromTrader record
      const bySupplierId = supplierItems.reduce<Record<string, SupplierItem[]>>((acc, item) => {
        (acc[item.supplierId] ??= []).push(item);
        return acc;
      }, {});

      await Promise.all(
        Object.entries(bySupplierId).map(([supplierId, sItems]) =>
          prisma.orderFromTrader.create({
            data: {
              traderId: userId,
              supplierId,
              orderId: order.id,
              status: 'PENDING',
              total: sItems.reduce((sum, i) => sum + i.wholesalePrice * i.quantity, 0),
              fullName: order.fullName,
              location: order.location,
              phone: order.phone,
              items: {
                create: sItems.map(i => ({
                  productId: i.productId,
                  quantity: i.quantity,
                  price: i.price,
                  wholesalePrice: i.wholesalePrice,
                  traderProfit: i.traderProfit,
                  supplierProfit: i.supplierProfit,
                })),
              },
            },
          })
        )
      );
    }

    // ── 8. Notification ────────────────────────────────────────────────────────
    await prisma.notification.create({
      data: {
        userId: userId ?? null,
        storeId,
        message: `وصل طلب جديد (${order.fullName}) الموقع: ${order.location ?? 'غير محدد'}. الرجاء مراجعة الطلب لمعالجته.`,
        type: 'order',
        orderId: order.id,
        isRead: false,
      },
    });

    // ── 9. Response ────────────────────────────────────────────────────────────
    return NextResponse.json(
      { success: true, orderId: order.id, total, finalTotal: total },
      { status: 201 }
    );
  } catch (error) {
    console.error('[ORDER_CREATE]', error);
    return NextResponse.json({ error: 'حدث خطأ، حاول مجدداً' }, { status: 500 });
  }
}
