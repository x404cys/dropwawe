import { prisma } from '@/app/lib/db';
import { getVisitorSchemaSupport } from '../utils/visitor-schema-support';
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

export async function getCustomerStatsAgg(storeId: string) {
  const rows = await prisma.$queryRaw<
    Array<{
      key: string;
      name: string;
      phone: string;
      orders: number;
      total: number;
      lastOrder: string;
    }>
  >`
    SELECT 
      COALESCE(phone, id) as key,
      MAX("fullName") as name,
      MAX(phone) as phone,
      COUNT(id)::int as orders,
      SUM(CASE WHEN status = 'CONFIRMED' THEN total ELSE 0 END)::float as total,
      MAX("createdAt")::text as "lastOrder"
    FROM "Order"
    WHERE "storeId" = ${storeId}
    GROUP BY COALESCE(phone, id)
    ORDER BY total DESC
  `;
  return rows;
}

export async function getTopProductsAgg(storeId: string) {
  const rows = await prisma.$queryRaw<Array<{ name: string; sales: number; revenue: number }>>`
    SELECT 
      COALESCE(p.name, 'منتج') as name,
      SUM(i.quantity)::int as sales,
      SUM(i.quantity * i.price)::float as revenue
    FROM "OrderItem" i
    JOIN "Order" o ON o.id = i."orderId"
    LEFT JOIN "Product" p ON p.id = i."productId"
    WHERE o."storeId" = ${storeId} AND o.status = 'CONFIRMED'
    GROUP BY p.name
    ORDER BY sales DESC
    LIMIT 5
  `;
  return rows;
}

export async function getGovernorateStatsAgg(storeId: string) {
  const result = await prisma.order.groupBy({
    by: ['location'],
    where: { storeId },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 10,
  });

  const total = await prisma.order.count({ where: { storeId } });
  return { data: result, total };
}

export async function getRecentOrdersAgg(storeId: string) {
  // Just fetch the date, status, total for recent orders to minimize memory and do node-side mapping safely
  const limitDate = new Date();
  limitDate.setMonth(limitDate.getMonth() - 1);

  return prisma.order.findMany({
    where: { storeId, createdAt: { gte: limitDate } },
    select: { createdAt: true, status: true, total: true },
  });
}
export async function getVisitorDemographicsAgg(storeSubLink: string | undefined | null) {
  if (!storeSubLink) return { osCounts: [], sourceCounts: [], total: 0 };

  // We fetch only userAgent and referrer. It's still N visitors, but very narrow columns.
  // We can't easily parse userAgents in SQL, so we fetch strings only (smaller payload than full object).
  const visitors = await prisma.visitor.findMany({
    where: { storeName: storeSubLink },
    select: { userAgent: true, referrer: true },
  });

  return { data: visitors, total: visitors.length };
}

export async function getVisitorLocationStatsAgg(storeSubLink: string | undefined | null) {
  if (!storeSubLink) {
    return {
      total: 0,
      uniqueVisitors: 0,
      pageGroups: [],
      entityGroups: [],
    };
  }

  const [support, total, uniqueVisitorRows] = await Promise.all([
    getVisitorSchemaSupport(),
    prisma.visitor.count({
      where: { storeName: storeSubLink },
    }),
    prisma.$queryRaw<Array<{ count: number | bigint }>>`
      SELECT COUNT(DISTINCT "visitorId")::int AS count
      FROM "Visitor"
      WHERE "storeName" = ${storeSubLink}
    `,
  ]);

  if (!support.enhancedColumns) {
    return {
      total,
      uniqueVisitors: Number(uniqueVisitorRows[0]?.count ?? 0),
      pageGroups: [],
      entityGroups: [],
    };
  }

  const [pageRows, entityRows] = await Promise.all([
    prisma.$queryRaw<Array<{ pageType: string | null; count: number | bigint }>>`
      SELECT "pageType", COUNT(*)::int AS count
      FROM "Visitor"
      WHERE "storeName" = ${storeSubLink}
      GROUP BY "pageType"
      ORDER BY COUNT(*) DESC
      LIMIT 8
    `,
    prisma.$queryRaw<
      Array<{
        entityType: string | null;
        entityId: string | null;
        entityName: string | null;
        count: number | bigint;
      }>
    >`
      SELECT
        "entityType",
        "entityId",
        COALESCE(MAX("entityName"), MAX("entityId")) AS "entityName",
        COUNT(*)::int AS count
      FROM "Visitor"
      WHERE "storeName" = ${storeSubLink}
        AND "entityId" IS NOT NULL
        AND "entityType" IN ('PRODUCT', 'ORDER')
      GROUP BY "entityType", "entityId"
      ORDER BY COUNT(*) DESC
      LIMIT 8
    `,
  ]);

  const pageGroups = pageRows.map(row => ({
    pageType: row.pageType,
    _count: { id: Number(row.count) },
  }));

  const entityGroups = entityRows.map(row => ({
    entityType: row.entityType,
    entityId: row.entityId,
    entityName: row.entityName,
    _count: { id: Number(row.count) },
  }));

  return {
    total,
    uniqueVisitors: Number(uniqueVisitorRows[0]?.count ?? 0),
    pageGroups,
    entityGroups,
  };
}
