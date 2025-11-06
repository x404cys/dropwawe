import { prisma } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { visitorId, path } = body;

  if (!visitorId || !path) {
    return NextResponse.json({ error: 'Missing visitorId or path' }, { status: 400 });
  }

  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';

  await prisma.visitor.create({
    data: {
      visitorId,
      ip,
      userAgent,
      storeName: path,
    },
  });

  return NextResponse.json({ status: 'created' });
}
