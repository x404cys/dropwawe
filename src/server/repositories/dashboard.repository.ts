import { prisma } from '@/app/lib/db';
import { OrderData, VisitorData } from '../types/dashboard.types';

export async function getRevenueAggregation(storeId: string) {
  return prisma.order.aggregate({
    where: { storeId, status: 'CONFIRMED' },
    _sum: { total: true },
    _count: { _all: true },
  });
}

export async function getOrderCounts(storeId: string) {
  const [pendingCount, totalOrderCount] = await Promise.all([
    prisma.order.count({ where: { storeId, status: 'PENDING' } }),
    prisma.order.count({ where: { storeId } }),
  ]);
  return { pendingCount, totalOrderCount };
}

export async function getProductCount(storeId: string) {
  return prisma.product.count({ where: { storeId } });
}

export async function getVisitorsCount(storeSubLink: string | undefined | null) {
  if (!storeSubLink) return 0;
  return prisma.visitor.count({ where: { storeName: storeSubLink } });
}

export async function getOrders(storeId: string): Promise<OrderData[]> {
  const result = await prisma.order.findMany({
    where: { storeId },
    select: {
      id: true,
      fullName: true,
      phone: true,
      location: true,
      total: true,
      status: true,
      createdAt: true,
      items: {
        select: {
          quantity: true,
          product: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

   return result as OrderData[];
}

export async function getVisitors(storeSubLink: string | undefined | null): Promise<VisitorData[]> {
  if (!storeSubLink) return [];
  const result = await prisma.visitor.findMany({
    where: { storeName: storeSubLink },
    select: { userAgent: true, referrer: true },
  });
  return result as VisitorData[];
}
