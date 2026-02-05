import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

type CouponBody = {
  code: string;
  scope: 'GLOBAL' | 'STORE' | 'PRODUCT';
  type: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING';
  value: number;

  storeId?: string;
  productId?: string;

  minOrder?: number;
  maxDiscount?: number;
  maxUsage?: number;
  perUser?: number;

  startsAt?: string;
  expiresAt?: string;

  isActive?: boolean;
};

export async function POST(req: Request) {
  const session = await getServerSession(authOperation);

  try {
    const body: CouponBody = await req.json();

    const {
      code,
      scope,
      type,
      value,
      storeId,
      productId,
      minOrder,
      maxDiscount,
      maxUsage,
      perUser,
      startsAt,
      expiresAt,
      isActive,
    } = body;

    if (!code || !value || !scope) {
      return NextResponse.json(
        { message: 'يجب إدخال الكود والقيمة ونطاق الكوبون' },
        { status: 400 }
      );
    }

    const exists = await prisma.coupon.findUnique({ where: { code } });

    if (exists) {
      return NextResponse.json({ message: 'كود الكوبون مستخدم مسبقاً' }, { status: 400 });
    }

    if (scope === 'STORE' && !storeId) {
      return NextResponse.json(
        { message: 'يجب تحديد المتجر عند اختيار نطاق المتجر' },
        { status: 400 }
      );
    }

    if (scope === 'PRODUCT' && !productId) {
      return NextResponse.json(
        { message: 'يجب تحديد المنتج عند اختيار نطاق المنتج' },
        { status: 400 }
      );
    }

    if (storeId && productId) {
      return NextResponse.json(
        { message: 'الكوبون يكون إما للمتجر أو للمنتج وليس الاثنين معاً' },
        { status: 400 }
      );
    }

    if (type === 'PERCENTAGE' && value > 100) {
      return NextResponse.json({ message: 'نسبة الخصم لا يمكن أن تتجاوز 100%' }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: String(code).trim().toUpperCase(),
        scope,
        type,
        userId: session?.user.id,
        value: Number(value),
        storeId: storeId || null,
        productId: productId || null,

        minOrder: minOrder ? Number(minOrder) : null,
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,

        maxUsage: maxUsage ? Number(maxUsage) : null,
        perUser: perUser ? Number(perUser) : null,

        startsAt: startsAt ? new Date(startsAt) : new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : null,

        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(coupon);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'حدث خطأ أثناء إنشاء الكوبون';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      include: {
        store: { select: { id: true, name: true } },
        product: { select: { id: true, name: true, price: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(coupons);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'فشل جلب الكوبونات';
    return NextResponse.json({ message }, { status: 500 });
  }
}
