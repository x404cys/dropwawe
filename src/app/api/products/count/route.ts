  import { NextResponse } from 'next/server';
  import { prisma } from '../../../lib/db';

  export async function GET(req: Request) {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const count = await prisma.product.count({
      where: { userId },
    });

    return NextResponse.json({ count });
  }
