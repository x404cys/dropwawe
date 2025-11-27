import { authOperation } from '@/app/lib/authOperation';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOperation);

  if (!session) {
    return NextResponse.json('Info');
  }
  try {
    const Info = await prisma.merchant.findUnique({
      where: {
        userId: session?.user.id,
      },
      select: {
        username: true,
      },
    });

    return NextResponse.json(Info);
  } catch (error) {
    return NextResponse.json({ status: false, msg: 'Server Error: ' + error }, { status: 500 });
  }
}
