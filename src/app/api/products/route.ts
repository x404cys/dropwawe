import { NextResponse } from 'next/server';
import { prisma } from '../../lib/db';
import { authOperation } from '../../lib/authOperation';
import { getServerSession } from 'next-auth';
import { uploadToServer } from '@/app/lib/uploadToSupabase';

export async function POST(req: Request) {
  const session = await getServerSession(authOperation);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    const name = formData.get('name');
    const description = formData.get('description');
    const shippingType = formData.get('shippingType');
    const hasReturnPolicy = formData.get('hasReturnPolicy');
    const priceStr = formData.get('price');
    const minPriceStr = formData.get('minPrice');
    const maxPriceStr = formData.get('maxPrice');
    const wholesalePriceStr = formData.get('wholesalePrice');

    const quantityStr = formData.get('quantity');
    const discountStr = formData.get('discount');
    const category = (formData.get('category') as string) || '';
    const file = formData.get('image') as File | null;
    const unlimitedStr = formData.get('unlimited');
    const unlimited = unlimitedStr === 'true';
    const galleryFiles = formData.getAll('gallery') as File[];
    const sizesRaw = formData.get('sizes') as string | null;
    const sizes: { size: string; stock: number }[] = sizesRaw ? JSON.parse(sizesRaw) : [];
    const colorsRaw = formData.get('colors') as string | null;
    const colors: { name: string; hex: string; stock: number }[] = colorsRaw
      ? JSON.parse(colorsRaw)
      : [];

    if (
      !name ||
      typeof name !== 'string' ||
      !file ||
      !priceStr ||
      typeof priceStr !== 'string' ||
      !quantityStr ||
      typeof quantityStr !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Missing required fields or wrong types' },
        { status: 400 }
      );
    }

    const price = parseFloat(priceStr);
    const quantity = parseInt(quantityStr);
    const discount = discountStr ? parseFloat(discountStr as string) : 0;
    const minPrice = minPriceStr ? parseFloat(minPriceStr as string) : 0;
    const maxPrice = maxPriceStr ? parseFloat(maxPriceStr as string) : 0;
    const wholesalePrice = wholesalePriceStr ? parseFloat(wholesalePriceStr as string) : 0;
    if (isNaN(price) || isNaN(quantity) || isNaN(discount)) {
      return NextResponse.json({ error: 'Invalid number fields' }, { status: 400 });
    }
    const imageUrl = await uploadToServer(file, userId);

    if (!imageUrl) {
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description as string,
        price,
        quantity,
        hasReturnPolicy: hasReturnPolicy as string,
        shippingType: shippingType as string,
        discount,
        category,
        image: imageUrl,
        userId,
        unlimited,
        isFromSupplier: !wholesalePrice ? false : true,
      },
    });

    const supplier = await prisma.supplier.findUnique({
      where: { userId: session.user.id },
    });

    if (!supplier) {
      return NextResponse.json({ error: 'Supplier not found for this user' }, { status: 400 });
    }
    await prisma.productPricing.create({
      data: {
        wholesalePrice,
        maxPrice,
        minPrice,
        minQuantity: 1,
        productId: product.id,
        supplierId: supplier.id,
      },
    });

    for (const gFile of galleryFiles) {
      const gUrl = await uploadToServer(gFile, userId);
      if (gUrl) {
        await prisma.productImage.create({
          data: {
            url: gUrl,
            productId: product.id,
          },
        });
      }
    }

    for (const s of sizes) {
      await prisma.productSize.create({
        data: {
          size: s.size,
          stock: s.stock,
          productId: product.id,
        },
      });
    }
    for (const c of colors) {
      await prisma.productColor.create({
        data: {
          color: c.name,
          hex: c.hex,
          stock: c.stock,
          productId: product.id,
        },
      });
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    console.error('POST Product Error:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');

    let products;

    if (slug) {
      products = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: slug, mode: 'insensitive' } },
            { category: { contains: slug, mode: 'insensitive' } },
          ],
        },
        include: { images: true, sizes: true },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      products = await prisma.product.findMany({
        include: { images: true, sizes: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(products);
  } catch (error: unknown) {
    console.error('Fetch Products Error:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
