import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';
import { z } from 'zod';

const storeSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'اسم المتجر يجب أن يكون 3 أحرف على الأقل' })
    .max(100, { message: 'اسم المتجر يجب ألا يزيد عن 100 حرف' }),

  subLink: z
    .string()
    .min(5, { message: 'رابط المتجر يجب أن يكون 5 أحرف على الأقل' })
    .max(30, { message: 'رابط المتجر يجب ألا يزيد عن 30 حرف' })
    .regex(/^[a-z0-9]+$/, { message: 'يجب أن يحتوي الرابط على أحرف صغيرة وأرقام فقط' }),

  shippingPrice: z.string().optional(),

  shippingType: z.string().optional(),

  hasReturnPolicy: z.boolean().optional(),

  facebookLink: z.string().url({ message: 'رابط الفيسبوك غير صالح' }).optional(),

  instaLink: z.string().url({ message: 'رابط الانستغرام غير صالح' }).optional(),

  phone: z
    .string()
    .min(7, { message: 'رقم الهاتف قصير جدًا' })
    .max(15, { message: 'رقم الهاتف طويل جدًا' }),

  telegram: z.string(),

  description: z
    .string()
    .min(10, { message: 'الوصف قصير جدًا' })
    .max(1000, { message: 'الوصف طويل جدًا' }),

  active: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOperation);
    if (!session || !session.user?.email || !session.user.role?.includes('TRADER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = storeSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return NextResponse.json({ error: 'Invalid data', details: errors }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const shippingPrice = parsed.data.shippingPrice
      ? Math.max(0, parseFloat(parsed.data.shippingPrice))
      : null;

    const store = await prisma.store.findUnique({
      where: { userId: user.id },
    });

    if (store) {
      if (store.subLink !== parsed.data.subLink) {
        const existingSubLink = await prisma.store.findUnique({
          where: { subLink: parsed.data.subLink },
        });
        if (existingSubLink) {
          return NextResponse.json(
            { error: 'Subdomain already taken', field: 'subLink' },
            { status: 409 }
          );
        }
      }

      const updatedStore = await prisma.store.update({
        where: { id: store.id },
        data: {
          name: parsed.data.name,
          subLink: parsed.data.subLink,
          shippingPrice,
          shippingType: parsed.data.shippingType,
          hasReturnPolicy: 'd',
          facebookLink: parsed.data.facebookLink,
          instaLink: parsed.data.instaLink,
          phone: parsed.data.phone,
          telegram: parsed.data.telegram,
          description: parsed.data.description,
          active: parsed.data.active ?? store.active,
        },
      });

      return NextResponse.json(updatedStore, { status: 200 });
    } else {
      const newStore = await prisma.store.create({
        data: {
          name: parsed.data.name,
          subLink: parsed.data.subLink,
          shippingPrice,
          shippingType: parsed.data.shippingType,
          hasReturnPolicy: '',
          facebookLink: parsed.data.facebookLink,
          instaLink: parsed.data.instaLink,
          phone: parsed.data.phone,
          telegram: parsed.data.telegram,
          description: parsed.data.description,
          active: parsed.data.active ?? true,
          userId: user.id,
        },
      });

      return NextResponse.json(newStore, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating/updating store:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
