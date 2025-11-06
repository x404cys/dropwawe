import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const store = await prisma.store.findUnique({
      where: { userId: userId },
      select: { subLink: true },
    });

    if (!store) {
      return NextResponse.redirect('https://dashboard.sahlapp.io/Dashboard/create-store');
    }

    return NextResponse.json({
      role: user.role,
      storeSubLink: store.subLink,
    });
  } catch (error) {
    console.error('Error fetching user/store:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
