import { prisma } from '@/app/lib/db';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        pricingDetails: true,
        user: {
          select: {
            id: true,
            storeName: true,
            storeSlug: true,
            shippingPrice: true,
            stores: {
              select: {
                store: {
                  select: {
                    shippingPrice: true,
                  },
                },
              },
            },
          },
        },
        images: true,
        sizes: true,
        colors: true,
        subInfo: true,
      },
    });

    return Response.json(product);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
