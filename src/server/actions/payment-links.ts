'use server';

import { authOperation } from '@/app/lib/authOperation';
import { prisma } from '@/app/lib/db';
import { canUserAccessFeature } from '@/app/lib/subscription-access';
import { STORE_FEATURE_PLANS } from '@/lib/subscription/feature-access';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { payTabsService } from '../services/paytabs.service';
import { PAYTABS_PROFILE_ID, PAYTABS_SERVER_KEY } from '../config/paytabs.config';

export async function getPaymentLinks(storeId?: string) {
  const session = await getServerSession(authOperation);
  if (!session?.user?.id) throw new Error('غير مصرح');

  return prisma.paymentLink.findMany({
    where: {
      userId: session.user.id,
      ...(storeId ? { storeId } : {}),
      isActive: true,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      store: { select: { name: true, subLink: true } },
      _count: { select: { submissions: true } },
    },
  });
}

export async function createPaymentLink(data: {
  title: string;
  amount: number;
  description?: string;
  storeId?: string;
}) {
  const session = await getServerSession(authOperation);
  if (!session?.user?.id) throw new Error('غير مصرح');
  const canManage = await canUserAccessFeature(session.user.id, STORE_FEATURE_PLANS.paymentLinks);
  if (!canManage) throw new Error('Subscription required to modify this feature');

  const storeId = await prisma.storeUser.findFirst({
    where: { userId: session.user.id },
  });
  if (!storeId) throw new Error('المتجر غير موجود');

  const link = await prisma.paymentLink.create({
    data: {
      title: data.title,
      amount: data.amount,
      description: data.description,
      userId: session.user.id,
      storeId: storeId.storeId,
    },
  });

  revalidatePath('/payment-links');
  return link;
}

export async function deletePaymentLink(id: string) {
  const session = await getServerSession(authOperation);
  if (!session?.user?.id) throw new Error('غير مصرح');

  const canManage = await canUserAccessFeature(session.user.id, STORE_FEATURE_PLANS.paymentLinks);
  if (!canManage) throw new Error('Subscription required to modify this feature');

  await prisma.paymentLink.deleteMany({
    where: { id, userId: session.user.id },
  });

  revalidatePath('/payment-links');
}

export async function getPaymentLinkById(id: string) {
  return prisma.paymentLink.findUnique({
    where: { id, isActive: true },
    include: {
      user: { select: { storeName: true, phone: true, email: true } },
      store: { select: { name: true, subLink: true, phone: true } },
    },
  });
}

export async function initiatePayTabsPayment(data: {
  paymentLinkId: string;
  payerName: string;
  payerPhone: string;
  payerEmail: string;
}) {
  const link = await prisma.paymentLink.findUnique({
    where: { id: data.paymentLinkId, isActive: true },
    include: {
      user: { select: { email: true, storeName: true } },
      store: { select: { name: true } },
    },
  });

  if (!link) throw new Error('الرابط غير موجود');

  const cartId = `PLK-${data.paymentLinkId}-${Date.now()}`;

  const submission = await prisma.paymentLinkSubmission.create({
    data: {
      paymentLinkId: data.paymentLinkId,
      payerName: data.payerName ?? '-',
      payerPhone: data.payerPhone ?? '-',
      payerEmail: data.payerEmail ?? '-',
      payMethod: 'card',
      status: 'INITIATED',
      cartId,
    },
  });

  const storeName = link.store?.name || link.user?.storeName || 'المتجر';

  const baseUrl = 'https://www.matager.store';

  const ptResponse = await payTabsService.createPaymentRequest({
    profile_id: Number(PAYTABS_PROFILE_ID),
    tran_type: 'sale',
    tran_class: 'ecom',
    cart_id: cartId,
    cart_currency: 'IQD',
    cart_amount: link.amount,
    cart_description: link.title,
    customer_details: {
      name: data.payerName,
      email: data.payerEmail,
      phone: data.payerPhone,
      street1: 'N/A',
      city: 'Baghdad',
      state: 'BG',
      country: 'IQ',
      zip: '00000',
    },

    return: `${baseUrl}/api/storev2/payment/paytabs/payment-link-callback`,
    callback: `${baseUrl}/api/paytabs/payment-link-callback`,
  });

  if (!ptResponse.ok || !ptResponse.redirect_url) {
    await prisma.paymentLinkSubmission.update({
      where: { id: submission.id },
      data: { status: 'FAILED', respMessage: ptResponse.message || 'فشل إنشاء بوابة الدفع' },
    });
    throw new Error(ptResponse.message || 'فشل الاتصال ببوابة الدفع');
  }

  await prisma.paymentLinkSubmission.update({
    where: { id: submission.id },
    data: { paymentUrl: ptResponse.redirect_url },
  });

  return { redirectUrl: ptResponse.redirect_url, cartId };
}
