import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ItemInput = {
  productId: string;
  quantity: number;
  price: number;
  selectedColor: string;
  selectedSize: string;
};

export async function POST(request: NextRequest) {
  try {
    const data: {
      storeId: string;
      userId: string;
      items: ItemInput[];
      fullName: string;
      location: string;
      phone: string;
      total: number;
      selectedColor: string;
      selectedSize: string;
    } = await request.json();

    const {
      storeId,
      items,
      fullName,
      location,
      phone,
      total,
      userId,
      selectedColor,
      selectedSize,
    } = data;

    if (
      !storeId ||
      !fullName ||
      !location ||
      !phone ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const productIds = items.map(item => item.productId);
    const productsInDb = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        pricingDetails: true,
      },
    });

    const errors: { productId: string; type: string; message: string }[] = [];
    let total2 = 0;

    for (const item of items) {
      const product = productsInDb.find(p => p.id === item.productId);

      if (!product) {
        errors.push({
          productId: item.productId,
          type: 'NOT_FOUND',
          message: `Product not found: ${item.productId}`,
        });
        continue;
      }

      if (product.price < item.price) {
        errors.push({
          productId: product.id,
          type: 'PRICE_MISMATCH',
          message: `Price mismatch for product: ${product.name}`,
        });
      }

      total2 += item.price * item.quantity;
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        storeId,
        userId,
        total,
        fullName,
        location,
        phone,
        status: 'PENDING',
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: selectedSize,
            color: selectedColor,
          })),
        },
      },
      include: { items: true },
    });

    await Promise.all(
      items.map(item =>
        prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        })
      )
    );

    if (productsInDb.find(p => p.isFromSupplier === true)) {
      const supplierItems = items
        .map(item => {
          const product = productsInDb.find(p => p.id === item.productId);

          if (!product || !product.isFromSupplier) return null;

          const wholesalePrice = product.pricingDetails?.wholesalePrice ?? 0;

          return {
            productId: product.id,
            quantity: item.quantity,
            price: item.price,
            wholesalePrice,
            traderProfit: (item.price - wholesalePrice) * item.quantity,
            supplierProfit: wholesalePrice * item.quantity,
            supplierId: product.supplierId,
          };
        })
        .filter(Boolean) as {
        productId: string;
        quantity: number;
        price: number;
        wholesalePrice: number;
        traderProfit: number;
        supplierProfit: number;
        supplierId: string;
      }[];

      await prisma.orderFromTrader.create({
        data: {
          traderId: userId,
          supplierId: supplierItems[0].supplierId,
          orderId: order.id,
          status: 'PENDING',
          total: supplierItems.reduce((sum, i) => sum + i.wholesalePrice * i.quantity, 0),
          fullName: order.fullName,
          location: order.location,
          phone: order.phone,
          items: {
            create: supplierItems.map(i => ({
              productId: i.productId,
              quantity: i.quantity,
              price: i.price,
              wholesalePrice: i.wholesalePrice,
              traderProfit: i.traderProfit,
              supplierProfit: i.supplierProfit,
            })),
          },
        },
        include: { items: true },
      });
    }
    const notificationMessage = `وصل طلب جديد (${order.fullName}) الموقع: ${location}. الرجاء مراجعة الطلب لمعالجته.`;

    await prisma.notification.create({
      data: {
        userId: userId,
        storeId,
        message: notificationMessage,
        type: 'order',
        orderId: order.id,
        isRead: false,
        createdAt: new Date(),
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
