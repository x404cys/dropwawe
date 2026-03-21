import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOperation } from '@/app/lib/authOperation';

export async function DELETE(req: Request, context: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await context.params;
    const session = await getServerSession(authOperation);

    if (!orderId || !session) {
      return NextResponse.json({ error: 'Order ID and session required' }, { status: 400 });
    }
    await prisma.order.delete({
      where: { id: orderId },
    });

    return NextResponse.json({ message: 'Order items deleted successfully', status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
