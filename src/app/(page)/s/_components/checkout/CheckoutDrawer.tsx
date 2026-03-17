// Purpose: Checkout drawer - "use client", left-side fixed panel with backdrop.
// Handles cart view, order form, payment selection, order placement via POST /api/s/orders,
// and success state. Reads/writes state from CartContext.

'use client';

import { Check, CreditCard, Download, Minus, Package, Plus, ShoppingCart, X } from 'lucide-react';
import { useCart } from '../../_context/CartContext';
import { useLanguage } from '../../_context/LanguageContext';
import { getDiscountedPrice } from '../../_utils/price';

interface CheckoutDrawerProps {
  storeId: string;
  primaryColor: string;
}

export default function CheckoutDrawer({ storeId, primaryColor }: CheckoutDrawerProps) {
  const {
    cart,
    cartCount,
    cartTotal,
    updateCartQty,
    clearCart,
    showCart,
    setShowCart,
    checkoutStep,
    setCheckoutStep,
    customerInfo,
    setCustomerInfo,
    paymentMethod,
    setPaymentMethod,
  } = useCart();
  const { t, locale } = useLanguage();

  if (!showCart) return null;

  const isInfoValid =
    customerInfo.name.trim().length >= 2 && customerInfo.phone.trim().length >= 10;

  const placeOrder = async () => {
    if (!isInfoValid) return;

    try {
      const res = await fetch(
        `${paymentMethod === 'cod' ? '/api/s/orders/cod' : '/api/s/orders/paytabs'}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            storeId,
            items: cart.map(c => ({
              productId: c.product.id,
              qty: c.qty,
            })),
            customerInfo: {
              name: customerInfo.name,
              phone: customerInfo.phone,
              email: customerInfo.email,
              address: customerInfo.location,
              notes: customerInfo.notes,
            },
            paymentMethod,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error('[PLACE_ORDER_ERROR]', data);
        return;
      }

      // الدفع الإلكتروني
      if (paymentMethod !== 'cod') {
        if (data.redirect_url) {
          window.location.href = data.redirect_url;
          return;
        }

        console.error('[PAYTABS]', 'redirect_url not found', data);
        return;
      }

      // الدفع عند الاستلام
      setCheckoutStep('success');

      setTimeout(() => {
        clearCart();
        setShowCart(false);
        setCheckoutStep('cart');
        setCustomerInfo({
          name: '',
          phone: '',
          email: '',
          notes: '',
          location: '',
        });
      }, 4000);
    } catch (err) {
      console.error('[PLACE_ORDER]', err);
    }
  };

  return (
    <div dir="rtl" className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="bg-foreground/50 absolute inset-0 backdrop-blur-sm"
        onClick={() => {
          setShowCart(false);
          setCheckoutStep('cart');
        }}
      />

      {/* Drawer panel */}
      <div className="bg-background animate-in slide-in-from-bottom sm:slide-in-from-left absolute inset-y-0 left-0 flex w-full flex-col shadow-xl duration-300 sm:right-0 sm:left-auto sm:max-w-md">
        {/* Header */}
        <div className="border-border border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => {
                setShowCart(false);
                setCheckoutStep('cart');
              }}
              className="bg-muted flex h-8 w-8 items-center justify-center rounded-full"
            >
              <X className="text-foreground h-4 w-4" />
            </button>
            <h2 className="text-foreground text-sm font-bold">
              {checkoutStep === 'success'
                ? t.checkout.orderDone
                : `${t.checkout.title} (${cartCount.toLocaleString(locale)})`}
            </h2>
            <div className="w-8" />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {checkoutStep === 'success' ? (
            <div className="flex h-full flex-col items-center justify-center px-8 py-20 text-center">
              <div
                className="animate-in zoom-in mb-6 flex h-20 w-20 items-center justify-center rounded-full"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <Check className="h-10 w-10" style={{ color: primaryColor }} />
              </div>
              <h2 className="text-foreground mb-2 text-xl font-bold">{t.checkout.successTitle}</h2>
              <p className="text-muted-foreground mb-1 text-sm">
                {t.checkout.orderNumber}: #{Math.floor(1000 + Math.random() * 9000)}
              </p>
              <p className="text-muted-foreground mb-6 text-xs">{t.checkout.contactNote}</p>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-muted-foreground flex h-full flex-col items-center justify-center">
              <ShoppingCart className="mb-3 h-12 w-12 opacity-20" />
              <p className="text-sm">{t.checkout.emptyCart}</p>
            </div>
          ) : (
            <div className="space-y-5 p-4">
              {/* Cart items */}
              <div className="space-y-2">
                <p className="text-foreground text-xs font-bold">{t.checkout.products}</p>
                {cart.map(({ product, qty }) => {
                  const price = getDiscountedPrice(product);
                  return (
                    <div key={product.id} className="bg-muted/30 flex gap-3 rounded-xl p-3">
                      <div className="bg-muted/50 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt=""
                            className="h-full w-full rounded-lg object-cover"
                          />
                        ) : (
                          <Package className="text-muted-foreground/30 h-5 w-5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground line-clamp-1 text-[11px] font-medium">
                          {product.name}
                        </p>
                        <p className="mt-0.5 text-[11px] font-bold" style={{ color: primaryColor }}>
                          {price.toLocaleString(locale)} {t.store.currency}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateCartQty(product.id, -1)}
                          className="border-border flex h-6 w-6 items-center justify-center rounded-lg border"
                        >
                          <Minus className="text-foreground h-3 w-3" />
                        </button>
                        <span className="text-foreground w-5 text-center text-[11px] font-bold">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateCartQty(product.id, 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-lg text-white"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => updateCartQty(product.id, -qty)}
                        className="self-center"
                      >
                        <X className="text-muted-foreground h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Customer info */}
              <div className="space-y-3">
                <p className="text-foreground text-xs font-bold">{t.checkout.orderInfo}</p>
                <div>
                  <label className="text-muted-foreground mb-1 block">
                    {t.checkout.fullName} *
                  </label>
                  <input
                    value={customerInfo.name}
                    onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary h-10 w-full rounded-xl border px-3 text-sm transition-colors outline-none"
                    placeholder={t.checkout.fullNamePlaceholder}
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block">{t.checkout.phone} *</label>
                  <input
                    value={customerInfo.phone}
                    onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary h-10 w-full rounded-xl border px-3 text-sm transition-colors outline-none"
                    placeholder="07701234567"
                    type="tel"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block">العنوان - location</label>
                  <input
                    value={`${customerInfo.location}`}
                    onChange={e => setCustomerInfo({ ...customerInfo, location: e.target.value })}
                    className="border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary h-10 w-full rounded-xl border px-3 transition-colors outline-none"
                    placeholder="مثال : بغداد - الكرادة داخل "
                    type="text"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Payment */}
              <div>
                <p className="text-foreground mb-2 text-xs font-bold">{t.checkout.paymentMethod}</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentMethod('electronic')}
                    className="rounded-xl border-2 p-3 text-center transition-all"
                    style={
                      paymentMethod === 'electronic'
                        ? { borderColor: primaryColor, backgroundColor: `${primaryColor}08` }
                        : { borderColor: 'var(--border)' }
                    }
                  >
                    <CreditCard
                      className="mx-auto mb-1 h-4 w-4"
                      style={{ color: paymentMethod === 'electronic' ? primaryColor : undefined }}
                    />
                    <p className="text-foreground text-[10px] font-bold">
                      {t.checkout.payElectronic}
                    </p>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className="rounded-xl border-2 p-3 text-center transition-all"
                    style={
                      paymentMethod === 'cod'
                        ? { borderColor: primaryColor, backgroundColor: `${primaryColor}08` }
                        : { borderColor: 'var(--border)' }
                    }
                  >
                    <Download
                      className="mx-auto mb-1 h-4 w-4"
                      style={{ color: paymentMethod === 'cod' ? primaryColor : undefined }}
                    />
                    <p className="text-foreground text-[10px] font-bold">
                      {t.checkout.payOnDelivery}
                    </p>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-muted-foreground mb-1 block text-[10px]">
                  {t.checkout.notes}
                </label>
                <textarea
                  value={customerInfo.notes}
                  onChange={e => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                  className="border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary h-16 w-full resize-none rounded-xl border px-3 py-2 transition-colors outline-none"
                  placeholder={t.checkout.notesPlaceholder}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {checkoutStep !== 'success' && cart.length > 0 && (
          <div className="border-border space-y-3 border-t p-4">
            <div className="flex items-center justify-between">
              <span className="text-foreground text-sm font-bold">{t.checkout.total}</span>
              <span className="text-lg font-bold" style={{ color: primaryColor }}>
                {cartTotal.toLocaleString(locale)}{' '}
                <span className="text-muted-foreground text-xs">{t.store.currency}</span>
              </span>
            </div>
            <button
              disabled={!isInfoValid}
              onClick={placeOrder}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: primaryColor }}
            >
              <Check className="h-4 w-4" /> {t.checkout.confirmOrder}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
