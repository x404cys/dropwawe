import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';
import { writeFile } from 'fs/promises';
import path from 'path';

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
            Store: {
              select: {
                shippingPrice: true,
              },
            },
          },
        },
        images: true,
        sizes: true,
        colors: true,
        
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

    if (!name || !priceStr || !quantityStr) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    console.log('Received quantityStr:', quantityStr);

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

    // if (file && file.size > 0) {
    //   const bytes = await file.arrayBuffer();
    //   const buffer = Buffer.from(bytes);

    //   const fileName = `${session.user.id}/${Date.now()}-${file.name}`;

    //   const { error: uploadError } = await supabase.storage
    //     .from('upload-sahl-img')
    //     .upload(fileName, buffer, {
    //       contentType: file.type,
    //       upsert: false,
    //     });

    //   if (uploadError) {
    //     return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    //   }

    //   const { data: publicUrlData } = supabase.storage
    //     .from('upload-sahl-img')
    //     .getPublicUrl(fileName);

    //   imagePath = publicUrlData.publicUrl;
    // }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        quantity,
        discount,
        shippingType: shippingType ?? undefined,
        hasReturnPolicy: hasReturnPolicy ?? undefined,
        category: category ?? undefined,
        description: description ?? undefined,
        ...(imagePath ? { image: imagePath } : {}),
        unlimited: unlimited,
      },
    });

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
