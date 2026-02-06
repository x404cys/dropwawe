import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sublink = searchParams.get('sublink');

    if (!sublink) return NextResponse.json({ error: 'Store sublink is required' }, { status: 400 });

    const store = await prisma.store.findUnique({
      where: { subLink: sublink },
    });

    if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

    return NextResponse.json({ store });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
