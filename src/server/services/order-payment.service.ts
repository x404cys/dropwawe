import { orderPaymentRepository } from '../repositories/order-payment.repository';
import { payTabsService } from './paytabs.service';
import { PayTabsItemInput, PayTabsCallbackData, PayTabsPayload } from '../types/paytabs.types';
import { PAYTABS_PROFILE_ID, SITE_URL, PAYTABS_CURRENCY } from '../config/paytabs.config';

export const orderPaymentService = {
  createPaymentForOrder: async (
    storeId: string,
    userId: string,
    fullName: string,
    location: string,
    phone: string,
    items: PayTabsItemInput[]
  ) => {
    // 1. Validate Input
    if (
      !storeId ||
      !fullName ||
      !location ||
      !phone ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      throw new Error('Invalid input');
    }

    // 2. Lookup DB data
    const productIds = items.map(item => item.productId);
    const productsInDb = await orderPaymentRepository.getProductsWithPricing(productIds);

    const errors: { productId: string; type: string; message: string }[] = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const product = productsInDb.find(p => p.id === item.productId);
      if (!product) {
        errors.push({
          productId: item.productId,
          type: 'NOT_FOUND',
          message: `Product not found: ${item.productId}`,
        });
        continue;
      }
      if (product.price < item.price) {
        errors.push({
          productId: product.id,
          type: 'PRICE_MISMATCH',
          message: `Price mismatch for product: ${product.name}`,
        });
      }
      calculatedTotal += item.price * item.quantity;
    }

    if (errors.length > 0) {
      throw new Error(JSON.stringify({ message: 'Validation failed', details: errors }));
    }

    // 3. Create normal order
    const order = await orderPaymentRepository.createOrder(
      storeId,
      userId,
      calculatedTotal,
      fullName,
      location,
      phone,
      items
    );

    // 4. Handle Supplier/Trader logic if applicable
    let traderOrder = null;
    if (productsInDb.find(p => p.isFromSupplier === true)) {
      const supplierItems = items
        .map(item => {
          const product = productsInDb.find(p => p.id === item.productId);
          if (!product || !product.isFromSupplier) return null;
          const wholesalePrice = product.pricingDetails?.wholesalePrice ?? 0;
          return {
            productId: product.id,
            quantity: item.quantity,
            price: item.price,
            wholesalePrice,
            traderProfit: (item.price - wholesalePrice) * item.quantity,
            supplierProfit: wholesalePrice * item.quantity,
            supplierId: product.supplierId,
          };
        })
        .filter(Boolean) as any[];

      traderOrder = await orderPaymentRepository.createTraderOrder(
        userId,
        supplierItems[0].supplierId,
        order.id,
        supplierItems.reduce((sum, i) => sum + i.wholesalePrice * i.quantity, 0),
        order.fullName!,
        order.location!,
        order.phone!,
        supplierItems
      );
    }

    // 5. Build PayTabs Payload
    const cart_id = order.id;
    const CALLBACK_URL = `${SITE_URL}/api/storev2/payment/paytabs/order/callback`;

    const payload: PayTabsPayload = {
      profile_id: PAYTABS_PROFILE_ID,
      tran_type: 'sale',
      tran_class: 'ecom',
      cart_id: cart_id,
      cart_description: `دفع طلب رقم ${order.id}`,
      cart_currency: PAYTABS_CURRENCY,
      cart_amount: calculatedTotal,
      callback: CALLBACK_URL,
      return: CALLBACK_URL,
    };

    // 6. Call PayTabs
    const paytabsResponse = await payTabsService.createPaymentRequest(payload);

    if (!paytabsResponse.ok || !paytabsResponse.redirect_url) {
      throw new Error(paytabsResponse.message || 'Failed to create payment');
    }

    // 7. Store Payment intent
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

    // Trigger updates
    await orderPaymentRepository.updatePaymentOrder(data);
    if (traderPayment) {
      await orderPaymentRepository.updateTraderPayment(data);
    }

    // If successful payment
    if (data.respStatus === 'A') {
      await orderPaymentRepository.processSuccessfulOrder(
        paymentOrder.order.id,
        paymentOrder.order.storeId!,
        paymentOrder.order.total,
        paymentOrder.order.items.map(i => ({ productId: i.productId, quantity: i.quantity }))
      );
    }

    return paymentOrder;
  },

  getPaymentDetails: async (cartId: string) => {
    return orderPaymentRepository.getOrderByCartId(cartId);
  },
};
