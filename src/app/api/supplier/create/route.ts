import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';
import { z } from 'zod';
import { uploadToServer } from '@/app/lib/uploadToSupabase';
const storeSchema = z.object({
  name: z.string().min(3).max(100),
  subLink: z
    .string()
    .min(5)
    .max(30)
    .regex(/^[a-z0-9]+$/),
  shippingPrice: z.string().optional(),
  shippingType: z.string().optional(),
  hasReturnPolicy: z.string().optional(),
  facebookLink: z.string().url().or(z.literal('')).optional(),
  instaLink: z.string().url().or(z.literal('')).optional(),
  telegram: z.string().url().or(z.literal('')).optional(),
  phone: z.string().min(7).max(15),
  description: z.string().min(10).max(1000),
  active: z.boolean().optional(),
  facebookPixel: z.string().optional(),
  tiktokPixel: z.string().optional(),
  googlePixel: z.string().optional(),
  selectedMethods: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOperation);
    const userId = session?.user?.id;
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();

    const data = {
      name: formData.get('name'),
      subLink: formData.get('subLink'),
      shippingPrice: formData.get('shippingPrice'),
      shippingType: formData.get('shippingType'),
      hasReturnPolicy: formData.get('hasReturnPolicy'),
      facebookLink: formData.get('facebookLink'),
      instaLink: formData.get('instaLink'),
      phone: formData.get('phone'),
      telegram: formData.get('telegram'),
      imageUrl: formData.get('image'),
      description: formData.get('description'),
      active: formData.get('active') === 'true',
      header: formData.get('header'),
      selectedMethods: formData.get('selectedMethods'),
    };

    const parsed = storeSchema.safeParse(data);

    if (!parsed.success) {
      const errors = parsed.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      console.log(errors);
      return NextResponse.json({ error: 'Invalid data', details: errors }, { status: 400 });
    }

    const shippingPrice = parsed.data.shippingPrice
      ? Math.max(0, parseFloat(parsed.data.shippingPrice))
      : null;

    const existingStore = await prisma.store.findFirst({
      where: { userId: session.user.id },
    });

    // const imageUrl = await uploadToServer(data.imageUrl as File, userId!);

    // if (!imageUrl) {
    //   return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    // }
    // const headerUrl = await uploadToServer(data.header as File, userId!);

    // if (!headerUrl) {
    //   return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    // }

    let store;
    if (existingStore) {
      store = await prisma.store.update({
        where: { id: existingStore.id },
        data: {
          name: parsed.data.name,
          subLink: parsed.data.subLink,
          shippingPrice,
          shippingType: parsed.data.shippingType,
          hasReturnPolicy: parsed.data.hasReturnPolicy || '',
          facebookLink: parsed.data.facebookLink || '',
          instaLink: parsed.data.instaLink || '',
          phone: parsed.data.phone,
          telegram: parsed.data.telegram,
          description: parsed.data.description,
          active: parsed.data.active ?? existingStore.active,
          facebookPixel: parsed.data.facebookPixel || '',
          tiktokPixel: parsed.data.tiktokPixel || '',
          googlePixel: parsed.data.googlePixel || '',
          Header: 'headerUrl',
          image: 'imageUrl',
          methodPayment: parsed.data.selectedMethods || '',
        },
      });
      await prisma.user.updateMany({
        where: { role: 'SUPPLIER' },
        data: { active: true },
      });
    } else {
      store = await prisma.store.create({
        data: {
          name: parsed.data.name,
          subLink: parsed.data.subLink,
          shippingPrice,
          shippingType: parsed.data.shippingType,
          hasReturnPolicy: parsed.data.hasReturnPolicy || '',
          facebookLink: parsed.data.facebookLink || '',
          instaLink: parsed.data.instaLink || '',
          phone: parsed.data.phone,
          telegram: parsed.data.telegram,
          description: parsed.data.description,
          active: parsed.data.active ?? true,
          userId: session.user.id,
          facebookPixel: parsed.data.facebookPixel || '',
          tiktokPixel: parsed.data.tiktokPixel || '',
          googlePixel: parsed.data.googlePixel || '',
          Header: 'headerUrl',
          image: 'imageUrl',
          methodPayment: parsed.data.selectedMethods || '',
        },
      });
    }
    await prisma.supplier.create({
      data: {
        shippingPrice,
        shippingType: parsed.data.shippingType || '',
        hasReturnPolicy: parsed.data.hasReturnPolicy || '',
        facebookLink: parsed.data.facebookLink || '',
        instaLink: parsed.data.instaLink || '',
        telegram: parsed.data.telegram,
        description: parsed.data.description,
        active: parsed.data.active ?? true,
        userId: session.user.id,
        Header: 'headerUrl',
        image: 'imageUrl',
        methodPayment: parsed.data.selectedMethods || '',
      },
    });
    await prisma.user.updateMany({
      where: { role: 'SUPPLIER' },
      data: { active: true },
    });

    return NextResponse.json(store, {
      status: existingStore ? 200 : 201,
    });
  } catch (error) {
    console.error('Error creating/updating store:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
