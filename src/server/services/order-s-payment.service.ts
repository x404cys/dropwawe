import { orderPaymentRepository } from '../repositories/order-pay-repo';
import { payTabsService } from './paytabs.service';
import { PayTabsCallbackData, PayTabsPayload, PayTabsItemInput } from '../types/paytabs.types';
import { PAYTABS_PROFILE_ID, SITE_URL, PAYTABS_CURRENCY } from '../config/paytabs.config';

type ItemInput = {
  productId: string;
  qty: number;
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
};

type SupplierItem = {
  productId: string;
  quantity: number;
  price: number;
  wholesalePrice: number;
  traderProfit: number;
  supplierProfit: number;
  supplierId: string;
};

export const orderPaymentService = {
  createPaymentForOrder: async (body: OrderBody) => {
    const { storeId, userId, items, customerInfo, paymentMethod } = body;

    const fullName = customerInfo.name?.trim() ?? '';
    const phone = customerInfo.phone?.trim() ?? '';
    const location = customerInfo.address ?? customerInfo.notes ?? '';
    const safePaymentMethod = paymentMethod ?? 'ONLINE';

    if (!storeId || !fullName || !phone || !Array.isArray(items) || items.length === 0) {
      throw new Error('Invalid input');
    }

    const productIds = items.map(item => item.productId);
    const productsInDb = await orderPaymentRepository.getProductsWithPricing(productIds);

    const errors: { productId: string; type: string; message: string }[] = [];
    let calculatedTotal = 0;

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

      calculatedTotal += basePrice * item.qty;

      return {
        productId: product.id,
        quantity: item.qty,
        price: basePrice,
        selectedColor: item.color ?? null,
        selectedSize: item.size ?? null,
      };
    });

    if (errors.length > 0) {
      throw new Error(JSON.stringify({ message: 'Validation failed', details: errors }));
    }

    const orderItems: PayTabsItemInput[] = mappedItems.filter(
      (item): item is PayTabsItemInput => item !== null
    );

    const order = await orderPaymentRepository.createOrder(
      storeId,
      userId!,
      calculatedTotal,
      fullName, 
      location,
      safePaymentMethod,
      phone,
      orderItems
    );

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
    const CALLBACK_URL = `${SITE_URL}/api/s/payment/paytabs/order/callback`;
    const RETURN_URL = `${SITE_URL}/checkout/payment-result?orderId=${order.id}`;

    const payload: PayTabsPayload = {
      profile_id: PAYTABS_PROFILE_ID,
      tran_type: 'sale',
      tran_class: 'ecom',
      cart_id,
      cart_description: `دفع طلب رقم ${order.id}`,
      cart_currency: PAYTABS_CURRENCY,
      cart_amount: calculatedTotal,
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
      await orderPaymentRepository.createPaymentOrder(order.id, cart_id, calculatedTotal);
    }

    return {
      order,
      redirect_url: paytabsResponse.redirect_url,
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
