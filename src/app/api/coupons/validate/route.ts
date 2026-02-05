import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

type CartProduct = {
  id: string;
  price: number;
  quantity: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      code,
      storeId,
      userId,
      products,
    }: {
      code: string;
      storeId: string;
      userId?: string;
      products: CartProduct[];
    } = body;

    if (!code || !storeId || !products?.length) {
      return NextResponse.json({ message: 'Invalid request data' }, { status: 401 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ message: 'Coupon is not valid' }, { status: 400 });
    }

    if (coupon.storeId && coupon.storeId !== storeId) {
      return NextResponse.json(
        { message: 'Coupon not applicable for this store' },
        { status: 400 }
      );
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json({ message: 'Coupon expired' }, { status: 400 });
    }

    if (coupon.maxUsage && coupon.usedCount >= coupon.maxUsage) {
      return NextResponse.json({ message: 'Coupon usage limit reached' }, { status: 400 });
    }

    if (coupon.perUser && userId) {
      const usageCount = await prisma.couponUsage.count({
        where: {
          couponId: coupon.id,
          userId,
        },
      });

      if (usageCount >= coupon.perUser) {
        return NextResponse.json({ message: 'Coupon already used by this user' }, { status: 400 });
      }
    }

    if (coupon.productId) {
      const product = products.find(p => p.id === coupon.productId);

      if (!product) {
        return NextResponse.json(
          { message: 'Coupon not applicable to products in cart' },
          { status: 400 }
        );
      }

      const discount = calculateCouponDiscount(
        product.price,
        coupon.value,
        coupon.type,
        coupon.maxDiscount
      );

      return NextResponse.json({
        valid: true,
        appliedOn: 'PRODUCT',
        productId: product.id,
        discount,
      });
    }

    const orderTotal = products.reduce((acc, p) => acc + p.price * p.quantity, 0);

    if (coupon.minOrder && orderTotal < coupon.minOrder) {
      return NextResponse.json({ message: 'Minimum order amount not reached' }, { status: 400 });
    }

    const discount = calculateCouponDiscount(
      orderTotal,
      coupon.value,
      coupon.type,
      coupon.maxDiscount
    );

    return NextResponse.json({
      valid: true,
      appliedOn: 'ORDER',
      discount,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
function calculateCouponDiscount(
  amount: number,
  value: number,
  type: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING',
  maxDiscount?: number | null
): number {
  if (type === 'FREE_SHIPPING') {
    return 0;
  }

  let discount = type === 'PERCENTAGE' ? (amount * value) / 100 : value;

  if (maxDiscount && discount > maxDiscount) {
    discount = maxDiscount;
  }

  return Math.max(discount, 0);
}
