import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import dotenv from 'dotenv';

dotenv.config();
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
      userId,
      items,
      fullName,
      location,
      phone,
      total,
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
    let calculatedTotal = 0;

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

      calculatedTotal += item.price * item.quantity;
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        storeId,
        userId,
        total: calculatedTotal,
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
    function iqdToUsd(amountIQD: number): number {
      return Number((amountIQD / 1300).toFixed(2));
    }
    const totalInUSD = iqdToUsd(calculatedTotal);

    const PAYTABS_SERVER_KEY = 'SKJ9R66GWL-JJ6GGK966B-TZ9GLZ29LH';
    const PAYTABS_PROFILE_ID = 144505;

    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dropwave.cloud';

    const CALLBACK_URL = `${SITE_URL}/api/storev2/payment/paytabs/order/callback`;

    const cart_id = order.id;

    const payload = {
      profile_id: PAYTABS_PROFILE_ID,
      tran_type: 'sale',
      tran_class: 'ecom',
      cart_id: cart_id,
      cart_description: `دفع طلب رقم ${order.id}`,
      cart_currency: 'IQD',
      cart_amount: 11000,
      callback: CALLBACK_URL,
      return: CALLBACK_URL,
    };

    const response = await fetch('https://secure-iraq.paytabs.com/payment/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: PAYTABS_SERVER_KEY,
      },
      body: JSON.stringify(payload),
    });

    const paytabsResponse = await response.json();

    if (!response.ok || !paytabsResponse.redirect_url) {
      return NextResponse.json(
        {
          success: false,
          message: paytabsResponse.message || 'Failed to create payment',
        },
        { status: 400 }
      );
    }

    await prisma.paymentOrder.create({
      data: {
        orderId: order.id,
        cartId: cart_id,
        amount: calculatedTotal,
        status: 'PENDING',
      },
      include: {
        order: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        order,
        redirect_url: paytabsResponse.redirect_url,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create order + payment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
