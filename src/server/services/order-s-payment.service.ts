import { orderPaymentRepository } from '../repositories/order-pay-repo';
import { payTabsService } from './paytabs.service';
import { PayTabsCallbackData, PayTabsPayload, PayTabsItemInput } from '../types/paytabs.types';
import { PAYTABS_PROFILE_ID, SITE_URL, PAYTABS_CURRENCY } from '../config/paytabs.config';
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
  paymentMethod?: string;
  couponCode?: string; // ✅ جديد
};

type SupplierItem = {
  productId: string;
  quantity: number;
  price: number;
  wholesalePrice: number;
  traderProfit: number;
  supplierProfit: number;
  supplierId: string;
  selectedColor: string | null;
  selectedSize: string | null;
};

// ── HELPER ──────────────────────────────────────────────
function calculateDiscount(
  amount: number,
  value: number,
  type: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING',
  maxDiscount?: number | null
): number {
  const raw = type === 'PERCENTAGE' ? (amount * value) / 100 : value;
  return Math.max(0, maxDiscount ? Math.min(raw, maxDiscount) : raw);
}

export const orderPaymentService = {
  createPaymentForOrder: async (body: OrderBody) => {
    const { storeId, userId, items, customerInfo, paymentMethod, couponCode } = body;

    const fullName = customerInfo.name?.trim() ?? '';
    const phone = customerInfo.phone?.trim() ?? '';
    const location = customerInfo.address ?? customerInfo.notes ?? '';
    const safePaymentMethod = paymentMethod ?? 'ONLINE';

    if (!storeId || !fullName || !phone || !Array.isArray(items) || items.length === 0) {
      throw new Error('Invalid input');
    }

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) throw new Error('المتجر غير موجود');

    const shippingPrice: number = store.shippingPrice ?? 0;

    const productIds = items.map(i => i.productId);
    const productsInDb = await orderPaymentRepository.getProductsWithPricing(productIds);

    const errors: { productId: string; type: string; message: string }[] = [];
    let subtotal = 0;

    const mappedItems = items.map(item => {
      const product = productsInDb.find(p => p.id === item.productId);
      if (!product) {
        errors.push({
          productId: item.productId,
          type: 'NOT_FOUND',
          message: `Product not found: ${item.productId}`,
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
        selectedColor,
        selectedSize,
      };
    });

    if (errors.length > 0) {
      throw new Error(JSON.stringify({ message: 'Validation failed', details: errors }));
    }

    const orderItems: PayTabsItemInput[] = mappedItems.filter(
      (item): item is PayTabsItemInput => item !== null
    );

    let couponDiscount = 0;
    let shippingDiscount = 0;
    let appliedCouponId: string | null = null;

    if (couponCode?.trim()) {
      const coupon = await prisma.coupon.findFirst({
        where: {
          code: couponCode.trim(),
          isActive: true,
          OR: [{ storeId }, { storeId: null }],
        },
      });

      if (!coupon) {
        throw new Error('الكوبون غير صالح');
      }

      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        throw new Error('انتهت صلاحية الكوبون');
      }

      if (coupon.maxUsage && coupon.usedCount >= coupon.maxUsage) {
        throw new Error('تم الوصول للحد الأقصى لاستخدام الكوبون');
      }

      if (coupon.perUser && userId) {
        const usageCount = await prisma.couponUsage.count({
          where: { couponId: coupon.id, userId },
        });
        if (usageCount >= coupon.perUser) {
          throw new Error('لقد استخدمت هذا الكوبون من قبل');
        }
      }

      if (coupon.minOrder && subtotal < coupon.minOrder) {
        throw new Error(`الحد الأدنى للطلب ${coupon.minOrder.toLocaleString('ar-IQ')} د.ع`);
      }

      if (coupon.type === 'FREE_SHIPPING') {
        shippingDiscount = shippingPrice;
      } else if (coupon.productId) {
        const targetItem = orderItems.find(i => i.productId === coupon.productId);
        if (!targetItem) {
          throw new Error('الكوبون غير قابل للتطبيق على منتجات السلة');
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
    const totalDiscount = couponDiscount + shippingDiscount;
    const finalTotal = Math.max(0, subtotal - couponDiscount + effectiveShipping);

    const order = await orderPaymentRepository.createOrder(
      storeId,
      userId!,
      subtotal,
      fullName,
      location,
      safePaymentMethod,
      phone,
      effectiveShipping,
      totalDiscount,
      finalTotal,
      couponCode ?? null,
      orderItems
    );

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

    let traderOrder = null;

    if (productsInDb.find(p => p.isFromSupplier === true) && userId) {
      const supplierItems = orderItems
        .map(orderItem => {
          const product = productsInDb.find(p => p.id === orderItem.productId);
          if (!product || !product.isFromSupplier || !product.supplierId) return null;

          const wholesalePrice = product.pricingDetails?.wholesalePrice ?? 0;
          return {
            productId: product.id,
            quantity: orderItem.quantity,
            price: orderItem.price,
            wholesalePrice,
            traderProfit: (orderItem.price - wholesalePrice) * orderItem.quantity,
            supplierProfit: wholesalePrice * orderItem.quantity,
            supplierId: product.supplierId,
            selectedColor: orderItem.selectedColor,
            selectedSize: orderItem.selectedSize,
          };
        })
        .filter((i): i is SupplierItem => i !== null);

      if (supplierItems.length > 0) {
        traderOrder = await orderPaymentRepository.createTraderOrder(
          userId,
          supplierItems[0].supplierId,
          order.id,
          supplierItems.reduce((sum, i) => sum + i.wholesalePrice * i.quantity, 0),
          order.fullName!,
          order.location ?? '',
          order.phone!,
          supplierItems
        );
      }
    }

    const cart_id = order.id;
    const CALLBACK_URL = `${SITE_URL}/api/storev2/payment/paytabs/order/callback`;
    const RETURN_URL = `${SITE_URL}/api/storev2/payment/paytabs/order/callback`;

    const payload: PayTabsPayload = {
      profile_id: PAYTABS_PROFILE_ID,
      tran_type: 'sale',
      tran_class: 'ecom',
      cart_id,
      cart_description: `دفع طلب رقم ${order.id}`,
      cart_currency: PAYTABS_CURRENCY,
      cart_amount: finalTotal,
      callback: CALLBACK_URL,
      return: RETURN_URL,
    };

    const paytabsResponse = await payTabsService.createPaymentRequest(payload);

    if (!paytabsResponse.ok || !paytabsResponse.redirect_url) {
      throw new Error(paytabsResponse.message || 'Failed to create payment');
    }

    if (traderOrder) {
      await orderPaymentRepository.createTraderPayment(traderOrder.id, cart_id, traderOrder.total!);
    } else {
      await orderPaymentRepository.createPaymentOrder(order.id, cart_id, finalTotal); // ✅
    }

    return {
      order,
      redirect_url: paytabsResponse.redirect_url,
      pricing: {
        subtotal,
        shippingPrice: effectiveShipping,
        discount: totalDiscount,
        finalTotal,
      },
    };
  },

  handlePaymentCallback: async (data: PayTabsCallbackData) => {
    if (!data.cartId) return null;

    const paymentOrder = await orderPaymentRepository.getPaymentOrder(data.cartId);
    const traderPayment = await orderPaymentRepository.getTraderPayment(data.cartId);

    if (!paymentOrder || !paymentOrder.order) return null;
    if (paymentOrder.status === 'Success') return paymentOrder;

    await orderPaymentRepository.updatePaymentOrder(data);

    if (traderPayment) {
      await orderPaymentRepository.updateTraderPayment(data);
    }

    if (data.respStatus === 'A') {
      await orderPaymentRepository.processSuccessfulOrder(
        paymentOrder.order.id,
        paymentOrder.order.storeId!,
        paymentOrder.order.total,
        paymentOrder.order.items.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
        }))
      );
    }

    return paymentOrder;
  },

  getPaymentDetails: async (cartId: string) => {
    return orderPaymentRepository.getOrderByCartId(cartId);
  },
};
