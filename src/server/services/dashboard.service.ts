import {
  getRevenueAggregation,
  getOrderCounts,
  getProductCount,
  getVisitorsCount,
  getCustomerStatsAgg,
  getTopProductsAgg,
  getGovernorateStatsAgg,
  getRecentOrdersAgg,
  getVisitorDemographicsAgg,
} from '../repositories/dashboard.repository';
import { detectDevice, detectOS } from '../utils/device-detection';
import { classifyReferrer } from '../utils/referrer-classifier';
import { toPercent } from '../utils/math';
import { DashboardStats } from '../types/dashboard.types';

export async function getDashboardStats(
  storeId: string,
  storeSubLink?: string
): Promise<DashboardStats> {
  const [
    revenueAgg,
    { pendingCount, totalOrderCount },
    productCount,
    visitCount,
    customerStatsRows,
    topProductsRows,
    govStats,
    recentOrders,
    visitorDemo,
  ] = await Promise.all([
    getRevenueAggregation(storeId),
    getOrderCounts(storeId),
    getProductCount(storeId),
    getVisitorsCount(storeSubLink),
    getCustomerStatsAgg(storeId),
    getTopProductsAgg(storeId),
    getGovernorateStatsAgg(storeId),
    getRecentOrdersAgg(storeId),
    getVisitorDemographicsAgg(storeSubLink),
  ]);

  const totalRevenue = revenueAgg._sum.total ?? 0;
  const confirmedCount = revenueAgg._count._all;

  // Using raw SQL outputs saves megabytes of RAM over 100K order iterations
  const customers = customerStatsRows.map(
    (c: {
      name: string | null;
      phone: string | null;
      orders: number;
      total: number;
      lastOrder: string | null;
    }) => ({
      name: c.name || '-',
      phone: c.phone || '-',
      orders: c.orders || 0,
      total: c.total || 0,
      lastOrder: c.lastOrder || new Date().toISOString(),
    })
  );

  const topProducts = topProductsRows.map(
    (p: { name: string | null; sales: number; revenue: number }) => ({
      name: p.name || 'منتج',
      sales: p.sales || 0,
      revenue: Math.round(p.revenue || 0),
    })
  );

  const now = new Date();
  const weeklyMap: Record<string, { orders: number; revenue: number }> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    weeklyMap[d.toLocaleDateString('en-CA')] = { orders: 0, revenue: 0 };
  }

  // Iterate over constrained date boundaries directly
  recentOrders.forEach((order: { createdAt: Date; status: string; total: number }) => {
    const key = order.createdAt.toLocaleDateString('en-CA');
    if (weeklyMap[key]) {
      weeklyMap[key].orders += 1;
      if (order.status === 'CONFIRMED') weeklyMap[key].revenue += order.total;
    }
  });

  const chartData = Object.entries(weeklyMap).map(([day, info]) => ({
    day,
    value: info.revenue,
  }));
  const revenueChart = Object.entries(weeklyMap).map(([day, v]) => ({ day, ...v }));

  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyMap: Record<string, number> = {};

  recentOrders.forEach((order: { createdAt: Date; status: string; total: number }) => {
    if (order.status !== 'CONFIRMED' || order.createdAt < firstOfMonth) return;
    const key = order.createdAt.toISOString().split('T')[0];
    monthlyMap[key] = (monthlyMap[key] || 0) + order.total;
  });

  const monthlyChart = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, revenue]) => ({ day, revenue }));

  // Governorate Aggregation (DB level mapping)
  const governorateData = govStats.data.map(
    (g: { location: string | null; _count: { id: number } }) => ({
      name: g.location?.trim() || 'غير محدد',
      orders: g._count.id,
      percentage: toPercent(g._count.id, govStats.total),
    })
  );

  const deviceCounts: Record<string, number> = { Mobile: 0, Tablet: 0, Desktop: 0 };
  const osCounts: Record<string, number> = {};
  const sourceCounts: Record<string, number> = {
    مباشر: 0,
    'محركات بحث': 0,
    'سوشيال ميديا': 0,
    فيسبوك: 0,
    انستغرام: 0,
    إحالة: 0,
  };

  const allVisitors = visitorDemo.data || [];
  const totalVisitors = allVisitors.length;

  allVisitors.forEach((v: { userAgent: string | null; referrer: string | null }) => {
    const ua = v.userAgent ?? '';
    const device = detectDevice(ua);
    const os = detectOS(ua);
    const label = classifyReferrer(v.referrer);

    deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    osCounts[os] = (osCounts[os] || 0) + 1;
    sourceCounts[label] = (sourceCounts[label] || 0) + 1;
  });

  const DEVICE_COLORS: Record<string, string> = {
    Mobile: 'hsl(191,80%,42%)',
    Tablet: 'hsl(280,70%,60%)',
    Desktop: 'hsl(220,80%,55%)',
  };
  const DEVICE_ICONS: Record<string, string> = {
    Mobile: 'Smartphone',
    Tablet: 'Tablet',
    Desktop: 'Monitor',
  };

  const deviceData = Object.entries(deviceCounts)
    .filter(([, c]) => c > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({
      name: name === 'Mobile' ? 'موبايل' : name === 'Tablet' ? 'تابلت' : 'حاسوب',
      value: toPercent(count, totalVisitors),
      color: DEVICE_COLORS[name] || 'hsl(220,80%,55%)',
      icon: DEVICE_ICONS[name] || 'Monitor',
    }));

  if (deviceData.length === 0) {
    deviceData.push({ name: 'موبايل', value: 0, color: 'hsl(191,80%,42%)', icon: 'Smartphone' });
  }

  const OS_COLORS: Record<string, string> = {
    Android: 'hsl(122,39%,49%)',
    iOS: 'hsl(211,100%,50%)',
    Windows: 'hsl(207,100%,42%)',
    macOS: 'hsl(0,0%,30%)',
    Linux: 'hsl(40,80%,50%)',
    Other: 'hsl(0,0%,60%)',
  };

  const deviceBrands = Object.entries(osCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({
      name,
      percentage: toPercent(count, totalVisitors),
      color: OS_COLORS[name] ?? 'hsl(0,0%,60%)',
    }));

  const SOURCE_META: Record<string, { color: string; emoji: string }> = {
    مباشر: { color: 'hsl(191,80%,42%)', emoji: '🔗' },
    'سوشيال ميديا': { color: 'hsl(280,70%,60%)', emoji: '📱' },
    فيسبوك: { color: 'hsl(214,89%,52%)', emoji: '📘' },
    انستغرام: { color: 'hsl(340,82%,52%)', emoji: '📸' },
    'محركات بحث': { color: 'hsl(40,90%,55%)', emoji: '🔍' },
    إحالة: { color: 'hsl(0,70%,55%)', emoji: '📣' },
  };

  const trafficSources = Object.entries(sourceCounts)
    .filter(([, c]) => c > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({
      name,
      value: toPercent(count, totalVisitors),
      color: SOURCE_META[name]?.color ?? 'hsl(0,0%,60%)',
      emoji: SOURCE_META[name]?.emoji ?? '🌐',
    }));

  return {
    totalRevenue,
    availableBalance: totalRevenue,
    orderCount: totalOrderCount,
    confirmedCount,
    pendingCount,
    productCount,
    visitCount, // We keep the full visit count using the DB accurate getVisitorsCount
    customers,
    topProducts,
    revenueChart,
    monthlyChart,
    governorateData,
    deviceData,
    deviceBrands,
    trafficSources,
    chartData,
  };
}
