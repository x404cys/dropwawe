import { NextResponse } from 'next/server';
import { getDashboardStats } from '@/server/services/dashboard.service';

/**
 * GET /api/dashboard/stats?storeId=xxx&storeSubLink=yyy
 *
 * Single aggregated endpoint for the Stats page.
 * Returns dashboard statistics using a clean, service-based architecture.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const storeId = url.searchParams.get('storeId');
  const storeSubLink = url.searchParams.get('storeSubLink') ?? '';

  if (!storeId) {
    return NextResponse.json({ error: 'Missing storeId' }, { status: 400 });
  }

  try {
    const stats = await getDashboardStats(storeId, storeSubLink);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('[/api/dashboard/stats] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
