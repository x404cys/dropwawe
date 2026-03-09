import {
  getRevenueAggregation,
  getOrderCounts,
  getProductCount,
  getVisitorsCount,
  getOrders,
  getVisitors,
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
    allOrders,
    allVisitors,
  ] = await Promise.all([
    getRevenueAggregation(storeId),
    getOrderCounts(storeId),
    getProductCount(storeId),
    getVisitorsCount(storeSubLink),
    getOrders(storeId),
    getVisitors(storeSubLink),
  ]);

  const totalRevenue = revenueAgg._sum.total ?? 0;
  const confirmedCount = revenueAgg._count._all;

  const customerMap: Record<
    string,
    { name: string; phone: string; orders: number; total: number; lastOrder: string }
  > = {};

  allOrders.forEach(order => {
    const key = order.phone?.trim() || order.id;
    if (!customerMap[key]) {
      customerMap[key] = {
        name: order.fullName ?? '-',
        phone: order.phone ?? '-',
        orders: 0,
        total: 0,
        lastOrder: order.createdAt.toISOString(),
      };
    }
    customerMap[key].orders += 1;
    if (order.status === 'CONFIRMED') {
      customerMap[key].total += order.total;
    }
  });

  const customers = Object.values(customerMap);

  const productSales: Record<string, { name: string; sales: number; revenue: number }> = {};

  allOrders.forEach(order => {
    if (order.status !== 'CONFIRMED') return;
    const perItem = order.items.length > 0 ? order.total / order.items.length : 0;
    order.items.forEach(item => {
      const name = item.product?.name ?? 'منتج';
      if (!productSales[name]) productSales[name] = { name, sales: 0, revenue: 0 };
      productSales[name].sales += item.quantity;
      productSales[name].revenue += perItem * item.quantity;
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)
    .map(p => ({ name: p.name, sales: p.sales, revenue: Math.round(p.revenue) }));

  const now = new Date();
  const weeklyMap: Record<string, { orders: number; revenue: number }> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayKey = d.toLocaleDateString('en-CA');
    weeklyMap[dayKey] = { orders: 0, revenue: 0 };
  }

  allOrders.forEach(order => {
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

  allOrders.forEach(order => {
    if (order.status !== 'CONFIRMED' || order.createdAt < firstOfMonth) return;
    const key = order.createdAt.toISOString().split('T')[0];
    monthlyMap[key] = (monthlyMap[key] || 0) + order.total;
  });

  const monthlyChart = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, revenue]) => ({ day, revenue }));

  const govMap: Record<string, number> = {};
  allOrders.forEach(order => {
    const loc = (order.location ?? 'غير محدد').trim() || 'غير محدد';
    govMap[loc] = (govMap[loc] || 0) + 1;
  });

  const govTotal = allOrders.length;
  const governorateData = Object.entries(govMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, orders]) => ({
      name,
      orders,
      percentage: toPercent(orders, govTotal),
    }));

  const deviceCounts: Record<string, number> = { Mobile: 0, Tablet: 0, Desktop: 0 };
  const osCounts: Record<string, number> = {};

  allVisitors.forEach(v => {
    const ua = v.userAgent ?? '';
    const device = detectDevice(ua);
    const os = detectOS(ua);
    deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    osCounts[os] = (osCounts[os] || 0) + 1;
  });

  const totalVisitors = allVisitors.length;

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

  const sourceCounts: Record<string, number> = {
    مباشر: 0,
    'محركات بحث': 0,
    'سوشيال ميديا': 0,
    فيسبوك: 0,
    انستغرام: 0,
    إحالة: 0,
  };

  allVisitors.forEach(v => {
    const label = classifyReferrer(v.referrer);
    sourceCounts[label] = (sourceCounts[label] || 0) + 1;
  });

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
    visitCount,
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
