import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';
import { uploadToServer } from '@/app/lib/uploadToSupabase';

interface Params {
  params: { id: string };
}

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
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

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOperation);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    const name = formData.get('name') as string;
    const priceStr = formData.get('price') as string;
    const quantityStr = formData.get('quantity') as string;

    const discountStr = formData.get('discount') as string | null;
    const shippingType = formData.get('shippingType') as string | null;
    const hasReturnPolicy = formData.get('hasReturnPolicy') as string | null;
    const category = formData.get('category') as string | null;
    const description = formData.get('description') as string | null;
    const file = formData.get('image') as File | null;
    const unlimitedStr = formData.get('unlimited') as string | null;
    const unlimited = unlimitedStr === 'true';
    const isDigitalStr = formData.get('isDigital') as string | null;
    const isDigital = isDigitalStr === 'true';

    // New Fields
    const telegramLink = formData.get('telegramLink') as string | null;
    const galleryFiles = formData.getAll('gallery') as File[];
    const sizesRaw = formData.get('sizes') as string | null;
    const sizes: { size: string; stock: number }[] = sizesRaw ? JSON.parse(sizesRaw) : [];
    const colorsRaw = formData.get('colors') as string | null;
    const colors: { name: string; hex: string; stock: number }[] = colorsRaw
      ? JSON.parse(colorsRaw)
      : [];

    if (!name || !priceStr || !quantityStr) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const price = parseFloat(priceStr);
    const quantity = parseInt(quantityStr);
    const discount = discountStr ? parseFloat(discountStr) : 0;

    if (isNaN(price) || isNaN(quantity) || isNaN(discount)) {
      return NextResponse.json({ error: 'Invalid number fields' }, { status: 400 });
    }

    const existing = await prisma.product.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let imagePath: string | undefined;

    if (file && file.size > 0) {
      const url = await uploadToServer(file, session.user.id);
      if (url) {
        imagePath = url;
      }
    }

    const updateData: Record<string, unknown> = {
      name,
      price,
      quantity,
      discount,
      category: category ?? undefined,
      description: description ?? undefined,
      ...(imagePath ? { image: imagePath } : {}),
      unlimited,
    };

    if (isDigitalStr !== null) {
      updateData.isDigital = isDigital;
    }

    if (isDigitalStr !== null && isDigital) {
      updateData.shippingType = null;
      updateData.hasReturnPolicy = null;
    } else {
      updateData.shippingType = shippingType ?? undefined;
      updateData.hasReturnPolicy = hasReturnPolicy ?? undefined;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData as any,
    });

    // Handle Telegram Link (Upsert ProductSubInfo)
    if (telegramLink !== null) {
      await prisma.productSubInfo.upsert({
        where: { productId: id },
        update: { telegram: telegramLink },
        create: { productId: id, telegram: telegramLink },
      });
    }

    // Handle Gallery Images (Append new images)
    for (const gFile of galleryFiles) {
      if (gFile && gFile.size > 0) {
        const gUrl = await uploadToServer(gFile, session.user.id);
        if (gUrl) {
          await prisma.productImage.create({
            data: {
              url: gUrl,
              productId: id,
            },
          });
        }
      }
    }

    // Sync Sizes (Delete existing and recreate)
    if (sizesRaw !== null) {
      await prisma.productSize.deleteMany({ where: { productId: id } });
      for (const s of sizes) {
        await prisma.productSize.create({
          data: {
            size: s.size,
            stock: s.stock,
            productId: id,
          },
        });
      }
    }

    // Sync Colors (Delete existing and recreate)
    if (colorsRaw !== null) {
      await prisma.productColor.deleteMany({ where: { productId: id } });
      for (const c of colors) {
        await prisma.productColor.create({
          data: {
            color: c.name,
            hex: c.hex,
            stock: c.stock,
            productId: id,
          },
        });
      }
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOperation);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const existing = await prisma.product.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
