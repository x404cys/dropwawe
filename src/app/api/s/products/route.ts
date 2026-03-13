// Purpose: GET /api/s/products?storeId=xxx
// Returns all products for a store including images, sizes, and colors.

import { prisma } from '@/app/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const storeId = searchParams.get('storeId');

  if (!storeId) {
    return Response.json({ error: 'storeId required' }, { status: 400 });
  }

  const products = await prisma.product.findMany({
    where: { storeId },
    include: {
      images: true,
      sizes:  true,
      colors: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return Response.json({ products });
}
