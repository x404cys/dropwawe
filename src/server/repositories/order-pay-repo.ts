import { prisma } from '@/app/lib/db';
import { PayTabsItemInput, PayTabsCallbackData } from '../types/paytabs.types';

export const orderPaymentRepository = {
  getProductsWithPricing: async (productIds: string[]) => {
    return prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { pricingDetails: true },
    });
  },

  createOrder: async (
    storeId: string,
    userId: string,
    total: number,
    fullName: string,
    location: string,
    paymentMethod: string,
    phone: string,
    shippingPrice: number,
    discount: number,
    finalTotal: number,
    couponCode: string | null,
    items: PayTabsItemInput[]
  ) => {
    return prisma.order.create({
      data: {
        storeId,
        userId,
        total,
        fullName,
        location,
        paymentMethod,
        phone,
        status: 'PENDING',
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.selectedSize,
            color: item.selectedColor,
          })),
        },
      },
      include: { items: true },
    });
  },

  createTraderOrder: async (
    traderId: string,
    supplierId: string,
    orderId: string,
    total: number,
    fullName: string,
    location: string,
    phone: string,
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
      wholesalePrice: number;
      traderProfit: number;
      supplierProfit: number;
    }>
  ) => {
    return prisma.orderFromTrader.create({
      data: {
        traderId,
        supplierId,
        orderId,
        status: 'PENDING',
        total,
        fullName,
        location,
        phone,
        items: {
          create: items.map(i => ({
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
  },

  createPaymentOrder: async (orderId: string, cartId: string, amount: number) => {
    return prisma.paymentOrder.create({
      data: {
        orderId,
        cartId,
        amount,
        status: 'PENDING',
      },
      include: { order: true },
    });
  },

  createTraderPayment: async (orderId: string, cartId: string, amount: number) => {
    return prisma.orderFromTraderPayment.create({
      data: {
        orderId,
        cartId,
        amount,
        status: 'PENDING',
      },
      include: { order: true },
    });
  },

  getPaymentOrder: async (cartId: string) => {
    return prisma.paymentOrder.findUnique({
      where: { cartId },
      include: { order: { include: { items: true } } },
    });
  },

  getTraderPayment: async (cartId: string) => {
    return prisma.orderFromTraderPayment.findUnique({
      where: { cartId },
      include: { order: { include: { items: true } } },
    });
  },

  updatePaymentOrder: async (data: PayTabsCallbackData) => {
    return prisma.paymentOrder.update({
      where: { cartId: data.cartId },
      data: {
        tranRef: data.tranRef,
        respCode: data.respStatus,
        respMessage: data.respMessage,
        customerEmail: data.customerEmail,
        signature: data.signature,
        token: data.token,
        status: data.respStatus === 'A' ? 'Success' : 'Failed',
      },
    });
  },

  updateTraderPayment: async (data: PayTabsCallbackData) => {
    return prisma.orderFromTraderPayment.update({
      where: { cartId: data.cartId },
      data: {
        tranRef: data.tranRef,
        respCode: data.respStatus,
        respMessage: data.respMessage,
        customerEmail: data.customerEmail,
        signature: data.signature,
        token: data.token,
        status: data.respStatus === 'A' ? 'Success' : 'Failed',
      },
    });
  },

  processSuccessfulOrder: async (
    orderId: string,
    storeId: string,
    totalEarned: number,
    items: { productId: string | null; quantity: number }[]
  ) => {
    return prisma.$transaction(async tx => {
      // Decrement product quantities sequentially in transaction
      for (const item of items) {
        if (item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: { quantity: { decrement: item.quantity } },
          });
        }
      }

      // Update Order Status
      await tx.order.update({
        where: { id: orderId },
        data: { status: 'PENDING' },
      });

      // Update store balance
      await tx.balance.upsert({
        where: { storeId },
        update: {
          available: { increment: totalEarned },
          pending: { increment: totalEarned },
        },
        create: {
          storeId,
          available: totalEarned,
          pending: totalEarned,
        },
      });

      // Create Ledger entry
      await tx.ledger.create({
        data: {
          storeId,
          orderId,
          type: 'ORDER_PROFIT',
          amount: totalEarned,
          note: 'ربح من طلب مدفوع',
        },
      });
    });
  },

  getOrderByCartId: async (cartId: string) => {
    return prisma.order.findFirst({
      where: {
        paymentOrder: {
          cartId: cartId,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        paymentOrder: true,
      },
    });
  },
};
