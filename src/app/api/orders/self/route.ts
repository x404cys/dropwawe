import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';
import { prisma } from '@/app/lib/db';

const DIRECT_ORDER_LOCATION = 'طلب مباشر من لوحة التحكم';
const DIRECT_ORDER_PAYMENT_METHOD = 'SELF_ORDER';

type DirectOrderBody = {
  productId?: string;
  quantity?: number;
  selectedColor?: string | null;
  selectedSize?: string | null;
};

function normalizeValue(value?: string | null) {
  return value?.trim() || null;
}

function getDiscountedPrice(price: number, discount?: number | null) {
  return discount && discount > 0 ? price - price * (discount / 100) : price;
}

function colorMatches(color: { color: string; hex: string | null }, candidate?: string | null) {
  if (!candidate) return false;

  const normalizedCandidate = candidate.trim().toUpperCase();
  return [color.hex, color.color]
    .filter((value): value is string => Boolean(value))
    .some(value => value.trim().toUpperCase() === normalizedCandidate);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOperation);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: DirectOrderBody = await request.json();
    const productId = normalizeValue(body.productId);
    const quantity = Number(body.quantity ?? 1);
    const selectedColor = normalizeValue(body.selectedColor);
    const selectedSize = normalizeValue(body.selectedSize);

    if (!productId || !Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json({ error: 'Invalid order payload' }, { status: 400 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        stores: {
          select: {
            storeId: true,
          },
        },
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        pricingDetails: true,
        sizes: true,
        colors: true,
        user: {
          select: {
            id: true,
            stores: {
              select: {
                storeId: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const storeId =
      product.storeId ?? product.user?.stores[0]?.storeId ?? currentUser.stores[0]?.storeId;

    if (!storeId) {
      return NextResponse.json({ error: 'Product is not linked to a store' }, { status: 400 });
    }

    const access =
      product.userId === currentUser.id
        ? { id: currentUser.id }
        : await prisma.storeUser.findFirst({
            where: {
              storeId,
              userId: currentUser.id,
            },
            select: { id: true },
          });

    if (!access) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: {
        id: true,
        shippingPrice: true,
      },
    });

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    const hasSizeVariants = product.sizes.length > 0;
    const hasColorVariants = product.colors.length > 0;

    const matchedSize = hasSizeVariants
      ? product.sizes.find(size => size.size.trim().toUpperCase() === selectedSize?.toUpperCase())
      : null;
    const matchedColor = hasColorVariants
      ? product.colors.find(color => colorMatches(color, selectedColor))
      : null;

    if (hasSizeVariants && !matchedSize) {
      return NextResponse.json({ error: 'Please select a valid size' }, { status: 400 });
    }

    if (hasColorVariants && !matchedColor) {
      return NextResponse.json({ error: 'Please select a valid color' }, { status: 400 });
    }

    if (!product.unlimited) {
      const usesGlobalStock = product.quantity > 0 || (!hasSizeVariants && !hasColorVariants);

      if (usesGlobalStock && product.quantity < quantity) {
        return NextResponse.json({ error: 'Requested quantity is not available' }, { status: 400 });
      }

      if (matchedSize && matchedSize.stock < quantity) {
        return NextResponse.json(
          { error: 'Requested quantity is not available for this size' },
          { status: 400 }
        );
      }

      if (matchedColor && matchedColor.stock < quantity) {
        return NextResponse.json(
          { error: 'Requested quantity is not available for this color' },
          { status: 400 }
        );
      }
    }

    const unitPrice = getDiscountedPrice(product.price, product.discount);
    const shippingPrice = product.isDigital ? 0 : (store.shippingPrice ?? 0);
    const finalTotal = unitPrice * quantity + shippingPrice;
    const orderSize = matchedSize?.size ?? selectedSize;
    const orderColor = matchedColor?.hex ?? matchedColor?.color ?? selectedColor;

    const createdOrder = await prisma.$transaction(async tx => {
      const order = await tx.order.create({
        data: {
          storeId,
          userId: currentUser.id,
          email: currentUser.email ?? null,
          fullName: currentUser.name?.trim() || 'طلب مباشر',
          phone: currentUser.phone?.trim() || null,
          location: DIRECT_ORDER_LOCATION,
          total: finalTotal,
          finalTotal,
          discount: 0,
          paymentMethod: DIRECT_ORDER_PAYMENT_METHOD,
          status: 'PENDING',
          items: {
            create: {
              productId: product.id,
              quantity,
              price: unitPrice,
              color: orderColor ?? null,
              size: orderSize ?? null,
            },
          },
        },
      });

      if (!product.unlimited) {
        if (product.quantity > 0) {
          await tx.product.update({
            where: { id: product.id },
            data: {
              quantity: {
                decrement: quantity,
              },
            },
          });
        }

        if (matchedSize) {
          await tx.productSize.update({
            where: { id: matchedSize.id },
            data: {
              stock: {
                decrement: quantity,
              },
            },
          });
        }

        if (matchedColor) {
          await tx.productColor.update({
            where: { id: matchedColor.id },
            data: {
              stock: {
                decrement: quantity,
              },
            },
          });
        }
      }

      if (product.isFromSupplier && product.supplierId) {
        const wholesalePrice = product.pricingDetails?.wholesalePrice ?? 0;

        await tx.orderFromTrader.create({
          data: {
            traderId: currentUser.id,
            supplierId: product.supplierId,
            orderId: order.id,
            status: 'PENDING',
            total: wholesalePrice * quantity,
            fullName: order.fullName,
            location: order.location,
            phone: order.phone,
            items: {
              create: {
                productId: product.id,
                quantity,
                price: unitPrice,
                wholesalePrice,
                traderProfit: (unitPrice - wholesalePrice) * quantity,
                supplierProfit: wholesalePrice * quantity,
                color: orderColor ?? null,
                size: orderSize ?? null,
              },
            },
          },
        });
      }

      await tx.notification.create({
        data: {
          userId: currentUser.id,
          storeId,
          message: `تم إنشاء طلب مباشر للمنتج ${product.name} بعدد ${quantity}`,
          type: 'order',
          orderId: order.id,
          isRead: false,
        },
      });

      return order;
    });

    return NextResponse.json(
      {
        success: true,
        orderId: createdOrder.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[SELF_ORDER_CREATE]', error);
    return NextResponse.json({ error: 'Failed to create direct order' }, { status: 500 });
  }
}
