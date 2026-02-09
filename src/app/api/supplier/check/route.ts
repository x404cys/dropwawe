import { authOperation } from '@/app/lib/authOperation';
import { prisma } from '@/app/lib/db';
import { error } from 'console';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const session = await getServerSession(authOperation);

  try {
    const supplier = await prisma.supplier.findUnique({
      where: {
        userId: session?.user.id,
      },
    });
    return NextResponse.json(supplier);
  } catch (err) {
    return NextResponse.json({ err }, { status: 404 });
  }
}
c