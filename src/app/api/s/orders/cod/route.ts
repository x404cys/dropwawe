// POST /api/s/orders
// Creates a new order from the storefront checkout form.
// Validates input, computes totals from DB prices (not client prices), and stores order.

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

type ItemInput = {
  productId: string;
  qty: number;
  selectedColor?: string | null;
  selectedSize?: string | null;
  color?: string | null;
  size?: string | null;
};

type CustomerInfo = {
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
};

type OrderBody = {
  storeId: string;
  userId?: string | null;
  items: ItemInput[];
  customerInfo: CustomerInfo;
  paymentMethod?: string | null;
  couponCode?: string;
  selectedSize?: string | null;
  selectedColor?: string | null;
};

type SupplierItem = {
  productId: string;
  quantity: number;
  price: number;
  wholesalePrice: number;
  traderProfit: number;
  supplierProfit: number;
  supplierId: string;
  color: string | null;
  size: string | null;
};

type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
  color: string | null;
  size: string | null;
};

export async function POST(request: NextRequest) {
  try {
    const body: OrderBody = await request.json();
    const {
      storeId,
      userId,
      items,
      customerInfo,
      paymentMethod,
      couponCode,
      selectedColor,
      selectedSize,
    } = body;

    if (
      !storeId ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !customerInfo?.name ||
      !customerInfo?.phone
    ) {
      return NextResponse.json({ error: 'بيانات ناقصة أو غير صالحة' }, { status: 400 });
    }

    // ── STORE ──
    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      return NextResponse.json({ error: 'المتجر غير موجود' }, { status: 404 });
    }

    // ── PRODUCTS ──
    const productIds = items.map(i => i.productId);
    const productsInDb = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { pricingDetails: true },
    });

    const validationErrors: { productId: string; type: string; message: string }[] = [];
    let subtotal = 0;

    const orderItems = items.map(item => {
      const product = productsInDb.find(p => p.id === item.productId);
      if (!product) {
        validationErrors.push({
          productId: item.productId,
          type: 'NOT_FOUND',
          message: `منتج غير موجود: ${item.productId}`,
        });
        return null;
      }

      const basePrice = product.discount
        ? product.price - product.price * (product.discount / 100)
        : product.price;

      subtotal += basePrice * item.qty;

      const selectedColor = item.selectedColor ?? item.color ?? null;
      const selectedSize = item.selectedSize ?? item.size ?? null;

      return {
        productId: product.id,
        quantity: item.qty,
        price: basePrice,
        color: selectedColor,
        size: selectedSize,
      };
    });

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'فشل التحقق من المنتجات', details: validationErrors },
        { status: 400 }
      );
    }

    const safeOrderItems = orderItems.filter((i): i is OrderItem => i !== null);

    const shippingPrice: number = store.shippingPrice ?? 0;

    let couponDiscount = 0;
    let shippingDiscount = 0;
    let appliedCouponId: string | null = null;

    if (couponCode?.trim()) {
      const coupon = await prisma.coupon.findFirst({
        where: {
          code: couponCode.trim(),
          isActive: true,
          OR: [{ storeId: storeId }, { storeId: null }],
        },
      });

      if (!coupon) {
        return NextResponse.json({ error: 'الكوبون غير صالح' }, { status: 400 });
      }

      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        return NextResponse.json({ error: 'انتهت صلاحية الكوبون' }, { status: 400 });
      }

      if (coupon.maxUsage && coupon.usedCount >= coupon.maxUsage) {
        return NextResponse.json(
          { error: 'تم الوصول للحد الأقصى لاستخدام الكوبون' },
          { status: 400 }
        );
      }

      if (coupon.perUser && userId) {
        const usageCount = await prisma.couponUsage.count({
          where: { couponId: coupon.id, userId },
        });
        if (usageCount >= coupon.perUser) {
          return NextResponse.json({ error: 'لقد استخدمت هذا الكوبون من قبل' }, { status: 400 });
        }
      }

      if (coupon.minOrder && subtotal < coupon.minOrder) {
        return NextResponse.json(
          { error: `الحد الأدنى للطلب ${coupon.minOrder.toLocaleString('ar-IQ')} د.ع` },
          { status: 400 }
        );
      }

      if (coupon.type === 'FREE_SHIPPING') {
        shippingDiscount = shippingPrice;
      } else if (coupon.productId) {
        const targetItem = safeOrderItems.find(i => i.productId === coupon.productId);
        if (!targetItem) {
          return NextResponse.json(
            { error: 'الكوبون غير قابل للتطبيق على منتجات السلة' },
            { status: 400 }
          );
        }
        couponDiscount = calculateDiscount(
          targetItem.price * targetItem.quantity,
          coupon.value,
          coupon.type,
          coupon.maxDiscount
        );
      } else {
        couponDiscount = calculateDiscount(subtotal, coupon.value, coupon.type, coupon.maxDiscount);
      }

      appliedCouponId = coupon.id;
    }

    const effectiveShipping = Math.max(0, shippingPrice - shippingDiscount);
    const finalTotal = Math.max(0, subtotal - couponDiscount + effectiveShipping);

    const order = await prisma.order.create({
      data: {
        storeId,
        userId: userId ?? null,
        fullName: customerInfo.name,
        phone: customerInfo.phone,
        email: customerInfo.email ?? null,
        location: customerInfo.address ?? customerInfo.notes ?? null,
        total: finalTotal,
        discount: couponDiscount + shippingDiscount,
        finalTotal,
        paymentMethod: paymentMethod ?? null,
        status: 'PENDING',
        items: { create: safeOrderItems },
      },
      include: { items: true },
    });

    if (appliedCouponId) {
      await prisma.coupon.update({
        where: { id: appliedCouponId },
        data: { usedCount: { increment: 1 } },
      });

      if (userId) {
        await prisma.couponUsage.create({
          data: { couponId: appliedCouponId, userId },
        });
      }
    }

    await Promise.all(
      items.map(item =>
        prisma.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.qty } },
        })
      )
    );

    const supplierItems: SupplierItem[] = safeOrderItems
      .map((orderItem): SupplierItem | null => {
        const product = productsInDb.find(p => p.id === orderItem.productId);
        if (!product?.isFromSupplier || !product.supplierId) return null;

        const wholesalePrice = product.pricingDetails?.wholesalePrice ?? 0;
        return {
          productId: product.id,
          quantity: orderItem.quantity,
          price: orderItem.price,
          wholesalePrice,
          traderProfit: (orderItem.price - wholesalePrice) * orderItem.quantity,
          supplierProfit: wholesalePrice * orderItem.quantity,
          supplierId: product.supplierId,
          color: orderItem.color,
          size: orderItem.size,
        };
      })
      .filter((item): item is SupplierItem => item !== null);

    if (supplierItems.length > 0 && userId) {
      const bySupplierId = supplierItems.reduce<Record<string, SupplierItem[]>>((acc, item) => {
        (acc[item.supplierId] ??= []).push(item);
        return acc;
      }, {});

      await Promise.all(
        Object.entries(bySupplierId).map(([supplierId, sItems]) =>
          prisma.orderFromTrader.create({
            data: {
              traderId: userId,
              supplierId,
              orderId: order.id,
              status: 'PENDING',
              total: sItems.reduce((sum, i) => sum + i.wholesalePrice * i.quantity, 0),
              fullName: order.fullName,
              location: order.location,
              phone: order.phone,
              items: {
                create: sItems.map(i => ({
                  productId: i.productId,
                  quantity: i.quantity,
                  price: i.price,
                  wholesalePrice: i.wholesalePrice,
                  traderProfit: i.traderProfit,
                  supplierProfit: i.supplierProfit,
                  color: i.color,
                  size: i.size,
                })),
              },
            },
          })
        )
      );
    }

    await prisma.notification.create({
      data: {
        userId: userId ?? null,
        storeId,
        message: `${
          couponCode
            ? `وصل طلب جديد (${order.fullName}) — المبلغ: ${finalTotal.toLocaleString('ar-IQ')} د.ع — الموقع: ${order.location ?? 'غير محدد'}`
            : `وصل طلب جديد (${order.fullName}) — المبلغ: ${finalTotal.toLocaleString('ar-IQ')} د.ع — الموقع: ${order.location ?? 'غير محدد , مستخ'} مستخدما الكوبون التالي : ${couponCode}`
        }`,
        type: 'order',
        orderId: order.id,
        isRead: false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        subtotal,
        shippingPrice: effectiveShipping,
        discount: couponDiscount + shippingDiscount,
        finalTotal,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[ORDER_CREATE]', error);
    return NextResponse.json({ error: 'حدث خطأ، حاول مجدداً' }, { status: 500 });
  }
}

function calculateDiscount(
  amount: number,
  value: number,
  type: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING',
  maxDiscount?: number | null
): number {
  const discount = type === 'PERCENTAGE' ? (amount * value) / 100 : value;

  return Math.max(0, maxDiscount ? Math.min(discount, maxDiscount) : discount);
}
