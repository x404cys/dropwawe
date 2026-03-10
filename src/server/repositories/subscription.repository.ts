import { prisma } from '@/app/lib/db';
import { PayTabsCallbackData } from '../types/paytabs.types';

import { Prisma } from '@prisma/client';

export const subscriptionRepository = {
  getPaymentById: async (cartId: string) => {
    return prisma.payment.findUnique({
      where: { cartId },
    });
  },

  getPaymentForUpdate: async (cartId: string) => {
    return prisma.payment.findUnique({
      where: { cartId, isActive: false },
    });
  },

  getUserSubscription: async (userId: string) => {
    return prisma.userSubscription.findFirst({
      where: { userId },
      include: { plan: true },
    });
  },

  getSubscriptionPlan: async (planType?: string, planId?: string) => {
    if (planType) return prisma.subscriptionPlan.findFirst({ where: { type: planType } });
    if (planId) return prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    return null;
  },

  processSuccessfulOldSubscription: async (data: PayTabsCallbackData, userId: string) => {
    return prisma.$transaction([
      prisma.userSubscription.update({
        where: { userId },
        data: { isActive: true },
      }),
      prisma.payment.update({
        where: { cartId: data.cartId },
        data: {
          tranRef: data.tranRef,
          respCode: data.respStatus,
          respMessage: data.respMessage,
          customerEmail: data.customerEmail,
          signature: data.signature,
          token: data.token,
          status: 'SUCCESS',
        },
      }),
    ]);
  },

  updateFailedPayment: async (
    data: Pick<PayTabsCallbackData, 'cartId' | 'tranRef' | 'respStatus' | 'respMessage'>
  ) => {
    return prisma.payment.update({
      where: { cartId: data.cartId },
      data: {
        tranRef: data.tranRef,
        respCode: data.respStatus,
        respMessage: data.respMessage,
        status: 'FAILED',
      },
    });
  },

  processSuccessfulSubscriptionUpdate: async (
    subscriptionId: string,
    userId: string,
    role: 'GUEST' | 'SUPPLIER' | 'DROPSHIPPER' | 'TRADER' | null | undefined,
    paymentId: string,
    cartId: string,
    notificationMessage: string
  ) => {
    return prisma.$transaction(async tx => {
      await tx.userSubscription.update({
        where: { id: subscriptionId },
        data: { isActive: true },
      });

      if (role) {
        await tx.user.update({
          where: { id: userId },
          data: { role },
        });
      }

      await tx.subscriptionHistory.updateMany({
        where: {
          userId,
          paymentId,
          status: 'PENDING',
        },
        data: { status: 'ACTIVE' },
      });

      await tx.payment.update({
        where: { cartId },
        data: { isActive: true },
      });

      await tx.notification.create({
        data: {
          userId,
          message: notificationMessage,
          type: 'Sub',
        },
      });
    });
  },

  createSubscriptionHistory: async (data: Prisma.SubscriptionHistoryUncheckedCreateInput) => {
    return prisma.subscriptionHistory.create({ data });
  },

  upsertUserSubscription: async (
    userId: string,
    planId: string,
    startDate: Date,
    endDate: Date
  ) => {
    return prisma.userSubscription.upsert({
      where: { userId },
      create: {
        userId,
        planId,
        startDate,
        endDate,
        isActive: false,
      },
      update: {
        planId,
        startDate,
        endDate,
        isActive: false,
      },
    });
  },

  createPayment: async (
    cartId: string,
    userId: string,
    planId: string,
    amount: number,
    email?: string | null
  ) => {
    return prisma.payment.create({
      data: {
        cartId,
        userId,
        planId,
        amount,
        currency: 'IQD',
        status: 'PENDING',
        customerEmail: email || '',
      },
    });
  },
};
