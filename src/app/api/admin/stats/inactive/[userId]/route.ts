import { authOperation } from '@/app/lib/authOperation';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function PATCH(req: Request, context: { params: Promise<{ userId: string }> }) {
  const { userId } = await context.params;
  const { active } = await req.json();

  try {
    const session = await getServerSession(authOperation);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 });
    }

    if (session.user.role !== 'A') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { active },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
