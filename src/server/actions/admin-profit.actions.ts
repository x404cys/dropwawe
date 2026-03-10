'use server';

import { authOperation } from '@/app/lib/authOperation';
import { getServerSession } from 'next-auth';
import { prisma } from '@/app/lib/db';
import { revalidatePath } from 'next/cache';

export async function getTraderProfits() {
  const session = await getServerSession(authOperation);
  if (!session || session.user.role !== 'A') {
    throw new Error('Unauthorized');
  }

  try {
    const withdrawals = await prisma.withdrawal.findMany({
      include: {
        store: {
          include: {
            users: {
              where: { isOwner: true },
              include: { user: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Server Actions must return plain objects; Date objects are supported in Next 14+ but for SWR compat we stringify/parse or use plain JS
    return JSON.parse(JSON.stringify(withdrawals));
  } catch (e) {
    console.error(e);
    throw new Error('Server error');
  }
}

export async function approveTraderProfit(withdrawalId: string) {
  const session = await getServerSession(authOperation);
  if (!session || session.user.role !== 'A') {
    throw new Error('Unauthorized');
  }

  try {
    const withdrawal = await prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: { status: 'APPROVED' },
    });

    // Refetch caching layer
    revalidatePath('/admin/trader-profit');
    return { success: true };
  } catch (e) {
    console.error(e);
    throw new Error('Server error');
  }
}
