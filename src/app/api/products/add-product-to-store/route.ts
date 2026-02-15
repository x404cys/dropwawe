import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOperation);
  if (!session) {
    return NextResponse.redirect('/');
  }

  if (session.user.role !== 'DROPSHIPPER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { productId, profit, category } = await req.json();

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const storeUser = await prisma.storeUser.findFirst({
    where: { userId: session.user.id },
    include: { store: true },
  });

  if (!storeUser?.store) {
    return NextResponse.json({ error: 'Store not found for user' }, { status: 404 });
  }
  const plan = await prisma.userSubscription.findUnique({
    where: {
      userId: session.user.id,
    },
  });
  const checkLimitAddProduct = await prisma.subscriptionPlan.findUnique({
    where: {
      id: plan?.id,
    },
  });

  const productCount = await prisma.product.findMany({
    where: {
      OR: [{ storeId: storeUser.id }, { userId: session.user.id }],
    },
  });
  if (productCount.length === 5 && checkLimitAddProduct?.type === 'drop-basics') {
    return NextResponse.json({ message: 'Full Product' }, { status: 403 });
  }
  const addProduct = await prisma.product.create({
    data: {
      name: product.name,
      description: product.description,
      price: Number(product.price) + Number(profit),
      image: product.image,
      userId: session.user.id,
      category: category,
      storeId: storeUser.store.id,
      isFromSupplier: true,
    },
  });

  return NextResponse.json(addProduct, { status: 200 });
}
