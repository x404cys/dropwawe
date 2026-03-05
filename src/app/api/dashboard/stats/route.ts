import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

/**
 * GET /api/dashboard/stats?storeId=xxx&storeSubLink=yyy
 *
 * Single aggregated endpoint for the Stats page.
 * Returns:
 *   totalRevenue, availableBalance, orderCount, confirmedCount,
 *   pendingCount, productCount, visitCount,
 *   customers, topProducts, revenueChart, monthlyChart,
 *   governorateData, deviceData, deviceBrands, trafficSources
 */

// ── UA helpers ────────────────────────────────────────────────────────────────
function detectDevice(ua: string): 'Mobile' | 'Tablet' | 'Desktop' {
  const u = ua.toLowerCase();
  if (/tablet|ipad|playbook|silk/.test(u)) return 'Tablet';
  if (/mobile|android|iphone|ipod|blackberry|windows phone/.test(u)) return 'Mobile';
  return 'Desktop';
}

function detectOS(ua: string): string {
  const u = ua.toLowerCase();
  if (/iphone|ipad|ipod/.test(u)) return 'iOS';
  if (/android/.test(u)) return 'Android';
  if (/windows/.test(u)) return 'Windows';
  if (/mac/.test(u)) return 'macOS';
  if (/linux/.test(u)) return 'Linux';
  return 'Other';
}

function classifyReferrer(ref: string | null): string {
  if (!ref) return 'مباشر';
  const r = ref.toLowerCase();
  if (r.includes('google') || r.includes('bing') || r.includes('yahoo') || r.includes('duckduckgo')) return 'محركات بحث';
  if (r.includes('facebook') || r.includes('fb.') || r.includes('instagram') || r.includes('tiktok') || r.includes('twitter') || r.includes('t.co') || r.includes('snapchat') || r.includes('telegram')) return 'سوشيال ميديا';
  return 'إحالة';
}

function toPercent(count: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const storeId = url.searchParams.get('storeId');
  const storeSubLink = url.searchParams.get('storeSubLink') ?? '';

  if (!storeId) {
    return NextResponse.json({ error: 'Missing storeId' }, { status: 400 });
  }

  try {
    // ── Run independent queries in parallel ──────────────────────────────────
    const [
      revenueAgg,
      pendingCount,
      totalOrderCount,
      productCount,
      visitCount,
      allOrders,
      allVisitors,
    ] = await Promise.all([
      // 1. Total confirmed revenue
      prisma.order.aggregate({
        where: { storeId, status: 'CONFIRMED' },
        _sum: { total: true },
        _count: { _all: true },
      }),

      // 2. Pending orders
      prisma.order.count({ where: { storeId, status: 'PENDING' } }),

      // 3. All orders count
      prisma.order.count({ where: { storeId } }),

      // 4. Products
      prisma.product.count({ where: { storeId } }),

      // 5. Visitors (storeName = subLink)
      storeSubLink
        ? prisma.visitor.count({ where: { storeName: storeSubLink } })
        : Promise.resolve(0),

      // 6. All orders with items for chart / customer / product breakdown
      prisma.order.findMany({
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
      }),

      // 7. All visitors for this store (UA + referrer)
      storeSubLink
        ? prisma.visitor.findMany({
            where: { storeName: storeSubLink },
            select: { userAgent: true, referrer: true },
          })
        : Promise.resolve([]),
    ]);

    const totalRevenue = revenueAgg._sum.total ?? 0;
    const confirmedCount = revenueAgg._count._all;

    // ── Customers ─────────────────────────────────────────────────────────────
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

    // ── Top Products (by quantity sold) ───────────────────────────────────────
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

    // ── Revenue Chart — last 7 days ───────────────────────────────────────────
    const now = new Date();
    const weeklyMap: Record<string, { orders: number; revenue: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      weeklyMap[d.toISOString().split('T')[0]] = { orders: 0, revenue: 0 };
    }

    allOrders.forEach(order => {
      const key = order.createdAt.toISOString().split('T')[0];
      if (weeklyMap[key] !== undefined) {
        weeklyMap[key].orders += 1;
        if (order.status === 'CONFIRMED') weeklyMap[key].revenue += order.total;
      }
    });

    const revenueChart = Object.entries(weeklyMap).map(([day, v]) => ({ day, ...v }));

    // ── Monthly Revenue (current month, by day) ───────────────────────────────
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

    // ── Governorate Data (from order.location) ────────────────────────────────
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

    // ── Device Data (from visitor userAgent) ─────────────────────────────────
    const deviceCounts: Record<string, number> = { Mobile: 0, Tablet: 0, Desktop: 0 };
    const osCounts: Record<string, number> = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (allVisitors as { userAgent: string | null; referrer: string | null }[]).forEach(v => {
      const ua = v.userAgent ?? '';
      const device = detectDevice(ua);
      const os = detectOS(ua);
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      osCounts[os] = (osCounts[os] || 0) + 1;
    });

    const totalVisitors = allVisitors.length;

    const DEVICE_COLORS: Record<string, string> = {
      Mobile:  'hsl(191,80%,42%)',
      Tablet:  'hsl(280,70%,60%)',
      Desktop: 'hsl(220,80%,55%)',
    };
    const DEVICE_ICONS: Record<string, string> = {
      Mobile:  'Smartphone',
      Tablet:  'Tablet',
      Desktop: 'Monitor',
    };

    const deviceData = Object.entries(deviceCounts)
      .filter(([, c]) => c > 0)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({
        name: name === 'Mobile' ? 'موبايل' : name === 'Tablet' ? 'تابلت' : 'حاسوب',
        value: toPercent(count, totalVisitors),
        color: DEVICE_COLORS[name],
        icon: DEVICE_ICONS[name],
      }));

    // Ensure at least one entry so UI doesn't crash
    if (deviceData.length === 0) {
      deviceData.push({ name: 'موبايل', value: 0, color: 'hsl(191,80%,42%)', icon: 'Smartphone' });
    }

    const OS_COLORS: Record<string, string> = {
      Android: 'hsl(122,39%,49%)',
      iOS:     'hsl(211,100%,50%)',
      Windows: 'hsl(207,100%,42%)',
      macOS:   'hsl(0,0%,30%)',
      Linux:   'hsl(40,80%,50%)',
      Other:   'hsl(0,0%,60%)',
    };

    const deviceBrands = Object.entries(osCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({
        name,
        percentage: toPercent(count, totalVisitors),
        color: OS_COLORS[name] ?? 'hsl(0,0%,60%)',
      }));

    // ── Traffic Sources (from visitor referrer) ───────────────────────────────
    const sourceCounts: Record<string, number> = {
      'مباشر': 0,
      'محركات بحث': 0,
      'سوشيال ميديا': 0,
      'إحالة': 0,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (allVisitors as { userAgent: string | null; referrer: string | null }[]).forEach(v => {
      const label = classifyReferrer(v.referrer);
      sourceCounts[label] = (sourceCounts[label] || 0) + 1;
    });

    const SOURCE_META: Record<string, { color: string; emoji: string }> = {
      'مباشر':        { color: 'hsl(191,80%,42%)', emoji: '🔗' },
      'سوشيال ميديا': { color: 'hsl(280,70%,60%)', emoji: '📱' },
      'محركات بحث':   { color: 'hsl(40,90%,55%)',  emoji: '🔍' },
      'إحالة':        { color: 'hsl(0,70%,55%)',   emoji: '📣' },
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

    // ── Response ──────────────────────────────────────────────────────────────
    return NextResponse.json({
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
    });
  } catch (error) {
    console.error('[/api/dashboard/stats] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
