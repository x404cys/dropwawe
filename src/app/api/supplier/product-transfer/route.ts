import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await getServerSession(authOperation);

  if (!session) {
    return NextResponse.json({ message: 'Not allowed' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { productId, newPrice } = body;

    if (!productId) {
      console.log('dsd');
      return NextResponse.json({ message: 'productId و newPrice is  requierd' }, { status: 400 });
    }
    if (!newPrice) {
      console.log('|| newPrice');
      return NextResponse.json({ message: 'productId و newPrice is  requierd' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        pricingDetails: true,
        images: true,
        colors: true,
        sizes: true,
        Supplier: true,
      },
    });

    if (!product) {
      return NextResponse.json({ message: 'product not found' }, { status: 409 });
    }
    const store = await prisma.store.findUnique({
      where: {
        userId: session.user.id,
      },
    });
    const newProduct = await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: Number.parseInt(newPrice),
        quantity: product.quantity,
        image: product.image,
        category: product.category,
        discount: product.discount,
        hasReturnPolicy: product.hasReturnPolicy,
        shippingPrice: product.shippingPrice,
        shippingType: product.shippingType,
        userId: session.user.id,
        storeId: store?.id,
        unlimited: product.unlimited,
        isFromSupplier: true,
        supplierId: product?.Supplier?.[0]?.id ?? null,
        colors: {
          create: product.colors.map(c => ({
            color: c.color,
            hex: c.hex,
            stock: c.stock,
          })),
        },
        sizes: {
          create: product.sizes.map(s => ({
            size: s.size,
            stock: s.stock,
          })),
        },
        images: {
          create: product.images.map(i => ({
            url: i.url,
          })),
        },
      },
    });

    return NextResponse.json({ newProduct }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'server err' }, { status: 500 });
  }
}
