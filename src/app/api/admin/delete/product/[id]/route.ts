import { authOperation } from '@/app/lib/authOperation';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const producId = (await context.params).id;
  try {
    const session = await getServerSession(authOperation);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 });
    }

    if (session.user.role !== 'A') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
  } catch (e) {}

  await prisma.product.delete({
    where: {
      id: producId,
    },
  });
}
