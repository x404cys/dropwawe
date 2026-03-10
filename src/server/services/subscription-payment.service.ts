import crypto from 'crypto';
import { subscriptionRepository } from '../repositories/subscription.repository';
import { payTabsService } from './paytabs.service';
import { PayTabsPayload, PayTabsCallbackData } from '../types/paytabs.types';
import {
  PAYTABS_PROFILE_ID,
  MATAGER_DASHBOARD_URL,
  PAYTABS_CURRENCY,
} from '../config/paytabs.config';
import { planRoleMap } from '@/app/lib/planRoleMap';

export const subscriptionPaymentService = {
  createUpgradePayment: async (
    userId: string,
    email: string | null | undefined,
    planType: string
  ) => {
    if (!planType) throw new Error('Plan type is required');

    const plan = await subscriptionRepository.getSubscriptionPlan(planType);
    if (!plan) throw new Error('Plan not found');

    const now = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    const currentSubscription = await subscriptionRepository.getUserSubscription(userId);

    // Archive current active
    if (currentSubscription) {
      await subscriptionRepository.createSubscriptionHistory({
        userId,
        planId: currentSubscription.planId,
        subscriptionId: currentSubscription.id,
        startDate: currentSubscription.startDate,
        endDate: currentSubscription.endDate,
        price: plan.price,
        status: 'EXPIRED',
      });
    }

    const subscription = await subscriptionRepository.upsertUserSubscription(
      userId,
      plan.id,
      now,
      endDate
    );

    await subscriptionRepository.createSubscriptionHistory({
      userId,
      planId: plan.id,
      subscriptionId: subscription.id,
      startDate: now,
      endDate,
      price: plan.price,
      status: 'PENDING',
    });

    const cartId = `${userId}-${crypto.randomUUID()}`;

    // Create DB Payment
    await subscriptionRepository.createPayment(cartId, userId, plan.id, plan.price, email);

    // Initiate PayTabs
    const CALLBACK_URL = `${MATAGER_DASHBOARD_URL}/api/storev2/payment/paytabs/plans/subscriptions/callback`;

    const payload: PayTabsPayload = {
      profile_id: PAYTABS_PROFILE_ID,
      tran_type: 'sale',
      tran_class: 'ecom',
      cart_id: cartId,
      cart_description: `دفع اشتراك (${planType}) للمستخدم ${email}`,
      cart_currency: PAYTABS_CURRENCY,
      cart_amount: plan.price,
      callback: CALLBACK_URL,
      return: CALLBACK_URL,
      customer_details: {
        email: email || '',
        city: 'Baghdad',
        country: 'IQ',
      },
    };

    const paytabsResponse = await payTabsService.createPaymentRequest(payload);

    if (!paytabsResponse.ok || !paytabsResponse.redirect_url) {
      throw new Error(paytabsResponse.message || 'Payment failed');
    }

    return paytabsResponse.redirect_url;
  },

  handleSubscriptionCallback: async (data: PayTabsCallbackData) => {
    if (!data.cartId) throw new Error('cartId not found');

    const payment = await subscriptionRepository.getPaymentById(data.cartId);
    if (!payment) throw new Error('Payment record not found');

    if (data.respStatus === 'A') {
      await subscriptionRepository.processSuccessfulOldSubscription(data, payment.userId);
    } else {
      await subscriptionRepository.updateFailedPayment(data);
    }

    return data;
  },

  updateSubscriptionStatus: async (cartId: string, userId: string) => {
    if (!cartId) throw new Error('cartId is required');

    const payment = await subscriptionRepository.getPaymentForUpdate(cartId);
    if (!payment) throw new Error(`Payment not found for cartId: ${cartId}`);

    const subscription = await subscriptionRepository.getUserSubscription(userId);
    if (!subscription) throw new Error('Subscription not found for user');

    const plan = await subscriptionRepository.getSubscriptionPlan(undefined, subscription.planId);
    if (!plan) throw new Error('Plan not found');

    const role = planRoleMap[plan.type];
    const message = `تم الاشتراك في الباقة ${plan.name}-${plan.price}-${plan.type}`;

    await subscriptionRepository.processSuccessfulSubscriptionUpdate(
      subscription.id,
      userId,
      role,
      payment.id,
      cartId,
      message, 
    );

    return subscription;
  },

  getPaymentAndPlanDetails: async (cartId: string, userId: string) => {
    const payment = await subscriptionRepository.getPaymentById(cartId);
    if (!payment) throw new Error('Payment not found');

    const userSubscription = await subscriptionRepository.getUserSubscription(userId);
    if (!userSubscription) throw new Error('userSubscription not found');

    return { payment, userSubscription };
  },
};
