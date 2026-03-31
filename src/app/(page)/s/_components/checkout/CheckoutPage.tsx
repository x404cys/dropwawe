'use client';

import {
  ArrowRight,
  Check,
  CreditCard,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Tag,
} from 'lucide-react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { trackVisitorVisit } from '@/app/lib/context/visitorTracking';
import { formatTrackedOrderName } from '@/lib/visitor-tracking';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { useCart } from '../../_context/CartContext';
import { useLanguage } from '../../_context/LanguageContext';
import { getCartItemKey } from '../../_utils/cart';
import { getDiscountedPrice } from '../../_utils/price';
import { buildStorefrontCheckoutPath, buildStorefrontHomePath } from '../../_utils/routes';

interface CheckoutPageProps {
  storeId: string;
  storeSlug?: string | null;
  storeName?: string | null;
  primaryColor: string;
  shippingPrice?: number;
}

const EMPTY_CUSTOMER_INFO = {
  name: '',
  phone: '',
  email: '',
  notes: '',
  location: '',
};

export default function CheckoutPage({
  storeId,
  storeSlug,
  storeName,
  primaryColor,
  shippingPrice,
}: CheckoutPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const successOrderId = searchParams.get('success');
  const {
    cart,
    cartCount,
    cartTotal,
    updateCartQty,
    clearCart,
    customerInfo,
    setCustomerInfo,
    paymentMethod,
    setPaymentMethod,
    setCouponCode,
    coupon,
    applyCoupon,
    removeCoupon,
    effectiveShipping,
    grandTotal,
  } = useCart();
  const { t } = useLanguage();

  const shippingTotal = effectiveShipping(shippingPrice);
  const orderTotal = grandTotal(shippingPrice);
  const isInfoValid =
    customerInfo.name.trim().length >= 2 && customerInfo.phone.trim().length >= 10;

  useEffect(() => {
    if (!successOrderId || !storeSlug) return;

    void trackVisitorVisit({
      storeName: storeSlug,
      pageType: 'ORDER_SUCCESS',
      entityType: 'ORDER',
      entityId: successOrderId,
      entityName: formatTrackedOrderName(successOrderId),
      dedupeKey: `order-success:${storeSlug}:${successOrderId}`,
    });
  }, [storeSlug, successOrderId]);

  const handleApplyCoupon = async () => {
    await applyCoupon(
      storeId,
      cart.map(item => ({
        id: item.product.id,
        price: getDiscountedPrice(item.product),
        quantity: item.qty,
      }))
    );
  };

  const handlePlaceOrder = async () => {
    if (!isInfoValid || cart.length === 0) return;

    try {
      const response = await fetch(
        paymentMethod === 'cod' ? '/api/s/orders/cod' : '/api/s/orders/paytabs',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            storeId,
            items: cart.map(item => ({
              productId: item.product.id,
              qty: item.qty,
              selectedColor: item.product.selectedColor,
              selectedSize: item.product.selectedSize,
            })),
            customerInfo: {
              name: customerInfo.name,
              phone: customerInfo.phone,
              email: customerInfo.email,
              address: customerInfo.location,
              notes: customerInfo.notes,
            },
            paymentMethod,
            couponCode: coupon.status === 'valid' ? coupon.code : undefined,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        console.error('[PLACE_ORDER_ERROR]', data);
        return;
      }

      const orderId =
        typeof data?.order?.id === 'string'
          ? data.order.id
          : typeof data?.orderId === 'string'
            ? data.orderId
            : null;

      if (paymentMethod !== 'cod') {
        if (data.redirect_url) {
          if (storeSlug) {
            await trackVisitorVisit({
              storeName: storeSlug,
              pageType: 'PAYMENT_REDIRECT',
              entityType: orderId ? 'ORDER' : 'STORE',
              entityId: orderId ?? storeId,
              entityName: orderId ? formatTrackedOrderName(orderId) : (storeName ?? storeSlug),
              dedupeKey: orderId
                ? `payment-redirect:${storeSlug}:${orderId}`
                : `payment-redirect:${storeSlug}`,
            });
          }

          window.location.href = data.redirect_url;
          return;
        }

        console.error('[PAYTABS]', 'redirect_url not found', data);
        return;
      }

      clearCart();
      removeCoupon();
      setCustomerInfo(EMPTY_CUSTOMER_INFO);
      setPaymentMethod('electronic');
      router.replace(buildStorefrontCheckoutPath(orderId));
    } catch (error) {
      console.error('[PLACE_ORDER]', error);
    }
  };

  if (successOrderId) {
    return (
      <div dir="rtl" className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        <div
          className="rounded-[32px] border p-8 text-center shadow-sm"
          style={{
            borderColor: 'var(--store-border)',
            backgroundColor: 'var(--store-surface)',
          }}
        >
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: `${primaryColor}15` }}
          >
            <Check className="h-8 w-8" style={{ color: primaryColor }} />
          </div>

          <h1 className="text-2xl font-bold" style={{ color: 'var(--store-text)' }}>
            {t.checkout.successTitle}
          </h1>
          <p className="mt-3 text-sm" style={{ color: 'var(--store-text-muted)' }}>
            {t.checkout.orderNumber}: {formatTrackedOrderName(successOrderId)}
          </p>
          <p className="mt-2 text-sm" style={{ color: 'var(--store-text-muted)' }}>
            {t.checkout.contactNote}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => router.push(buildStorefrontHomePath())}
              className="rounded-2xl px-5 py-3 text-sm font-semibold text-white"
              style={{ backgroundColor: primaryColor }}
            >
              {t.nav.store}
            </button>
            <button
              type="button"
              onClick={() => router.replace(buildStorefrontCheckoutPath())}
              className="rounded-2xl border px-5 py-3 text-sm font-semibold"
              style={{
                borderColor: 'var(--store-border)',
                color: 'var(--store-text)',
              }}
            >
              {t.checkout.title}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="mx-auto max-w-6xl px-4 py-6 md:px-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.push(buildStorefrontHomePath())}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border transition-opacity hover:opacity-80"
          style={{ borderColor: 'var(--store-border)', color: 'var(--store-text)' }}
          aria-label={t.nav.home}
        >
          <ArrowRight className="h-4 w-4" />
        </button>

        <div className="min-w-0 text-center">
          <p className="truncate text-xs" style={{ color: 'var(--store-text-muted)' }}>
            {storeName ?? storeSlug ?? t.nav.store}
          </p>
          <h1 className="truncate text-lg font-semibold" style={{ color: 'var(--store-text)' }}>
            {t.checkout.title}
          </h1>
        </div>

        <div
          className="flex h-11 min-w-11 items-center justify-center rounded-2xl border px-3 text-sm font-semibold"
          style={{ borderColor: 'var(--store-border)', color: 'var(--store-text)' }}
        >
          {cartCount}
        </div>
      </div>

      {cart.length === 0 ? (
        <div
          className="rounded-[32px] border p-8 text-center"
          style={{
            borderColor: 'var(--store-border)',
            backgroundColor: 'var(--store-surface)',
          }}
        >
          <ShoppingCart className="mx-auto mb-4 h-10 w-10 opacity-30" />
          <p className="text-lg font-semibold" style={{ color: 'var(--store-text)' }}>
            {t.checkout.emptyCart}
          </p>
          <button
            type="button"
            onClick={() => router.push(buildStorefrontHomePath())}
            className="mt-6 rounded-2xl px-5 py-3 text-sm font-semibold text-white"
            style={{ backgroundColor: primaryColor }}
          >
            {t.nav.store}
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <section
              className="rounded-[32px] border p-5"
              style={{
                borderColor: 'var(--store-border)',
                backgroundColor: 'var(--store-surface)',
              }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold" style={{ color: 'var(--store-text)' }}>
                  {t.checkout.products}
                </h2>
                <span className="text-sm" style={{ color: 'var(--store-text-muted)' }}>
                  {cartCount}
                </span>
              </div>

              <div className="space-y-3">
                {cart.map(({ product, qty }) => {
                  const price = getDiscountedPrice(product);
                  const key = getCartItemKey(product);

                  return (
                    <div
                      key={key}
                      className="flex gap-3 rounded-3xl border p-3"
                      style={{
                        borderColor: 'var(--store-border-soft)',
                        backgroundColor: 'var(--store-bg)',
                      }}
                    >
                      <div
                        className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl"
                        style={{ backgroundColor: 'var(--store-surface-strong)' }}
                      >
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package className="h-5 w-5 opacity-30" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className="line-clamp-1 text-sm font-semibold"
                          style={{ color: 'var(--store-text)' }}
                        >
                          {product.name}
                        </p>

                        {(product.selectedColor || product.selectedSize) && (
                          <div
                            className="mt-1 space-y-1 text-xs"
                            style={{ color: 'var(--store-text-muted)' }}
                          >
                            {product.selectedColor ? (
                              <p>
                                {t.product.color}: {product.selectedColor}
                              </p>
                            ) : null}
                            {product.selectedSize ? (
                              <p>
                                {t.product.size}: {product.selectedSize}
                              </p>
                            ) : null}
                          </div>
                        )}

                        <p className="mt-2 text-sm font-semibold" style={{ color: primaryColor }}>
                          {formatIQD(price)} {t.store.currency}
                        </p>
                      </div>

                      <div className="flex flex-col items-end justify-between gap-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQty(
                                product.id,
                                -1,
                                product.selectedColor,
                                product.selectedSize
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-xl border"
                            style={{ borderColor: 'var(--store-border)' }}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQty(
                                product.id,
                                1,
                                product.selectedColor,
                                product.selectedSize
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-xl text-white"
                            style={{ backgroundColor: primaryColor }}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            updateCartQty(
                              product.id,
                              -qty,
                              product.selectedColor,
                              product.selectedSize
                            )
                          }
                          className="text-xs font-medium"
                          style={{ color: 'var(--store-text-muted)' }}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section
              className="rounded-[32px] border p-5"
              style={{
                borderColor: 'var(--store-border)',
                backgroundColor: 'var(--store-surface)',
              }}
            >
              <h2 className="mb-4 text-base font-semibold" style={{ color: 'var(--store-text)' }}>
                Coupon
              </h2>

              {coupon.status === 'valid' ? (
                <div
                  className="flex items-center justify-between rounded-2xl border px-4 py-3"
                  style={{ borderColor: primaryColor, backgroundColor: `${primaryColor}08` }}
                >
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" style={{ color: primaryColor }} />
                    <span className="text-sm font-semibold" style={{ color: primaryColor }}>
                      {coupon.code}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--store-text-muted)' }}>
                      {coupon.appliedOn === 'SHIPPING'
                        ? t.product.deliveryFast
                        : `${formatIQD(coupon.discount)} ${t.store.currency}`}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs font-medium"
                    style={{ color: 'var(--store-text-muted)' }}
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    value={coupon.code}
                    onChange={event => setCouponCode(event.target.value)}
                    onKeyDown={event => {
                      if (event.key === 'Enter') {
                        void handleApplyCoupon();
                      }
                    }}
                    className="h-11 flex-1 rounded-2xl border px-4 outline-none"
                    style={{
                      borderColor: 'var(--store-border)',
                      backgroundColor: 'var(--store-bg)',
                      color: 'var(--store-text)',
                    }}
                    placeholder="Coupon"
                    dir="ltr"
                  />

                  <button
                    type="button"
                    onClick={() => void handleApplyCoupon()}
                    disabled={!coupon.code.trim() || coupon.status === 'loading'}
                    className="h-11 rounded-2xl px-5 text-sm font-semibold text-white disabled:opacity-50"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {coupon.status === 'loading' ? '...' : 'Apply'}
                  </button>
                </div>
              )}

              {coupon.status === 'error' && coupon.message ? (
                <p className="mt-3 text-sm text-red-500">{coupon.message}</p>
              ) : null}
            </section>
          </div>

          <div className="space-y-6">
            <section
              className="rounded-[32px] border p-5"
              style={{
                borderColor: 'var(--store-border)',
                backgroundColor: 'var(--store-surface)',
              }}
            >
              <h2 className="mb-4 text-base font-semibold" style={{ color: 'var(--store-text)' }}>
                {t.checkout.orderInfo}
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    className="mb-2 block text-sm"
                    style={{ color: 'var(--store-text-muted)' }}
                  >
                    {t.checkout.fullName} *
                  </label>
                  <input
                    value={customerInfo.name}
                    onChange={event =>
                      setCustomerInfo({ ...customerInfo, name: event.target.value })
                    }
                    className="h-11 w-full rounded-2xl border px-4 outline-none"
                    style={{
                      borderColor: 'var(--store-border)',
                      backgroundColor: 'var(--store-bg)',
                      color: 'var(--store-text)',
                    }}
                    placeholder={t.checkout.fullNamePlaceholder}
                  />
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm"
                    style={{ color: 'var(--store-text-muted)' }}
                  >
                    {t.checkout.phone} *
                  </label>
                  <input
                    value={customerInfo.phone}
                    onChange={event =>
                      setCustomerInfo({ ...customerInfo, phone: event.target.value })
                    }
                    className="h-11 w-full rounded-2xl border px-4 outline-none"
                    style={{
                      borderColor: 'var(--store-border)',
                      backgroundColor: 'var(--store-bg)',
                      color: 'var(--store-text)',
                    }}
                    placeholder="07701234567"
                    type="tel"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm"
                    style={{ color: 'var(--store-text-muted)' }}
                  >
                    {t.checkout.email}
                  </label>
                  <input
                    value={customerInfo.email}
                    onChange={event =>
                      setCustomerInfo({ ...customerInfo, email: event.target.value })
                    }
                    className="h-11 w-full rounded-2xl border px-4 outline-none"
                    style={{
                      borderColor: 'var(--store-border)',
                      backgroundColor: 'var(--store-bg)',
                      color: 'var(--store-text)',
                    }}
                    placeholder={t.checkout.email}
                    type="email"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm"
                    style={{ color: 'var(--store-text-muted)' }}
                  >
                    Location
                  </label>
                  <input
                    value={customerInfo.location}
                    onChange={event =>
                      setCustomerInfo({ ...customerInfo, location: event.target.value })
                    }
                    className="h-11 w-full rounded-2xl border px-4 outline-none"
                    style={{
                      borderColor: 'var(--store-border)',
                      backgroundColor: 'var(--store-bg)',
                      color: 'var(--store-text)',
                    }}
                    placeholder="Baghdad - Karrada"
                  />
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm"
                    style={{ color: 'var(--store-text-muted)' }}
                  >
                    {t.checkout.notes}
                  </label>
                  <textarea
                    value={customerInfo.notes}
                    onChange={event =>
                      setCustomerInfo({ ...customerInfo, notes: event.target.value })
                    }
                    className="min-h-24 w-full resize-none rounded-2xl border px-4 py-3 outline-none"
                    style={{
                      borderColor: 'var(--store-border)',
                      backgroundColor: 'var(--store-bg)',
                      color: 'var(--store-text)',
                    }}
                    placeholder={t.checkout.notesPlaceholder}
                  />
                </div>
              </div>
            </section>

            <section
              className="rounded-[32px] border p-5"
              style={{
                borderColor: 'var(--store-border)',
                backgroundColor: 'var(--store-surface)',
              }}
            >
              <h2 className="mb-4 text-base font-semibold" style={{ color: 'var(--store-text)' }}>
                {t.checkout.paymentMethod}
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {(['electronic', 'cod'] as const).map(method => {
                  const active = paymentMethod === method;
                  const Icon = method === 'electronic' ? CreditCard : Check;

                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className="rounded-2xl border p-4 text-center transition-opacity hover:opacity-90"
                      style={
                        active
                          ? {
                              borderColor: primaryColor,
                              backgroundColor: `${primaryColor}08`,
                              color: primaryColor,
                            }
                          : {
                              borderColor: 'var(--store-border)',
                              color: 'var(--store-text)',
                            }
                      }
                    >
                      <Icon className="mx-auto mb-2 h-4 w-4" />
                      <p className="text-sm font-semibold">
                        {method === 'electronic'
                          ? t.checkout.payElectronic
                          : t.checkout.payOnDelivery}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            <section
              className="rounded-[32px] border p-5"
              style={{
                borderColor: 'var(--store-border)',
                backgroundColor: 'var(--store-surface)',
              }}
            >
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span style={{ color: 'var(--store-text-muted)' }}>{t.checkout.total}</span>
                  <span style={{ color: 'var(--store-text)' }}>
                    {formatIQD(cartTotal)} {t.store.currency}
                  </span>
                </div>

                {coupon.status === 'valid' && coupon.discount > 0 ? (
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--store-text-muted)' }}>Coupon</span>
                    <span style={{ color: primaryColor }}>
                      -{formatIQD(coupon.discount)} {t.store.currency}
                    </span>
                  </div>
                ) : null}

                <div className="flex items-center justify-between">
                  <span style={{ color: 'var(--store-text-muted)' }}>{t.product.delivery}</span>
                  <span style={{ color: 'var(--store-text)' }}>
                    {shippingTotal > 0
                      ? `${formatIQD(shippingTotal)} ${t.store.currency}`
                      : t.product.deliveryFast}
                  </span>
                </div>

                <div className="border-t pt-3" style={{ borderColor: 'var(--store-border-soft)' }}>
                  <div className="flex items-center justify-between text-base font-semibold">
                    <span style={{ color: 'var(--store-text)' }}>{t.product.total}</span>
                    <span style={{ color: primaryColor }}>
                      {formatIQD(orderTotal)} {t.store.currency}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={!isInfoValid}
                onClick={() => void handlePlaceOrder()}
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}
              >
                <Check className="h-4 w-4" />
                {t.checkout.confirmOrder}
              </button>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
