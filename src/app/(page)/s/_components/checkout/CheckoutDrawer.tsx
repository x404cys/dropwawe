// Purpose: Checkout drawer — "use client", left-side fixed panel with backdrop.
// Handles cart view, order form, payment selection, order placement via POST /api/s/orders,
// and success state. Reads/writes state from CartContext.
// Pixel-perfect match to Storefront.tsx checkout drawer.

'use client';

import {
  X, ShoppingCart, Check, Minus, Plus, Package, CreditCard, Download,
} from 'lucide-react';
import { useCart } from '../../_context/CartContext';
import { getDiscountedPrice } from '../../_utils/price';

interface CheckoutDrawerProps {
  storeId: string;
  primaryColor: string;
}

export default function CheckoutDrawer({ storeId, primaryColor }: CheckoutDrawerProps) {
  const {
    cart, cartCount, cartTotal, updateCartQty, clearCart,
    showCart, setShowCart,
    checkoutStep, setCheckoutStep,
    customerInfo, setCustomerInfo,
    paymentMethod, setPaymentMethod,
  } = useCart();

  if (!showCart) return null;

  const isInfoValid =
    customerInfo.name.trim().length >= 2 && customerInfo.phone.trim().length >= 10;

  const placeOrder = async () => {
    if (!isInfoValid) return;
    try {
      const res = await fetch('/api/s/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId,
          items: cart.map((c) => ({ productId: c.product.id, qty: c.qty })),
          customerInfo,
          paymentMethod,
        }),
      });
      if (res.ok) {
        setCheckoutStep('success');
        setTimeout(() => {
          clearCart();
          setShowCart(false);
          setCheckoutStep('cart');
          setCustomerInfo({ name: '', phone: '', email: '', notes: '' });
        }, 4000);
      }
    } catch (err) {
      console.error('[PLACE_ORDER]', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={() => {
          setShowCart(false);
          setCheckoutStep('cart');
        }}
      />

      {/* Drawer panel */}
      <div className="absolute inset-y-0 left-0 w-full sm:max-w-md sm:right-0 sm:left-auto bg-background shadow-xl flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-left duration-300">
        {/* Header */}
        <div className="border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => {
                setShowCart(false);
                setCheckoutStep('cart');
              }}
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
            >
              <X className="h-4 w-4 text-foreground" />
            </button>
            <h2 className="text-sm font-bold text-foreground">
              {checkoutStep === 'success' ? 'تم الطلب ✓' : `إتمام الشراء (${cartCount})`}
            </h2>
            <div className="w-8" />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {checkoutStep === 'success' ? (
            <div className="flex flex-col items-center justify-center h-full py-20 px-8 text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-in zoom-in"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <Check className="h-10 w-10" style={{ color: primaryColor }} />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">تم تأكيد طلبك! 🎉</h2>
              <p className="text-sm text-muted-foreground mb-1">
                رقم الطلب: #{Math.floor(1000 + Math.random() * 9000)}
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                سيتم التواصل معك عبر الواتساب
              </p>
            </div>
          ) : cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-sm">السلة فارغة</p>
            </div>
          ) : (
            <div className="p-4 space-y-5">
              {/* Cart items */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-foreground">المنتجات</p>
                {cart.map(({ product, qty }) => {
                  const price = getDiscountedPrice(product);
                  return (
                    <div key={product.id} className="flex gap-3 bg-muted/30 rounded-xl p-3">
                      <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0].url}
                            alt=""
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="h-5 w-5 text-muted-foreground/30" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-foreground line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-[11px] font-bold mt-0.5" style={{ color: primaryColor }}>
                          {price.toLocaleString('ar-IQ')} د.ع
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateCartQty(product.id, -1)}
                          className="w-6 h-6 rounded-lg border border-border flex items-center justify-center"
                        >
                          <Minus className="h-3 w-3 text-foreground" />
                        </button>
                        <span className="text-[11px] font-bold text-foreground w-5 text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateCartQty(product.id, 1)}
                          className="w-6 h-6 rounded-lg text-white flex items-center justify-center"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => updateCartQty(product.id, -qty)}
                        className="self-center"
                      >
                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Customer info */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-foreground">معلومات الطلب</p>
                <div>
                  <label className="text-[10px] text-muted-foreground mb-1 block">الاسم الكامل *</label>
                  <input
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full h-10 rounded-xl border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                    placeholder="الاسم الكامل"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground mb-1 block">رقم الهاتف *</label>
                  <input
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full h-10 rounded-xl border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                    placeholder="07701234567"
                    type="tel"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground mb-1 block">البريد الإلكتروني</label>
                  <input
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full h-10 rounded-xl border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                    placeholder="email@example.com"
                    type="email"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Payment */}
              <div>
                <p className="text-xs font-bold text-foreground mb-2">طريقة الدفع</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentMethod('electronic')}
                    className="p-3 rounded-xl border-2 text-center transition-all"
                    style={
                      paymentMethod === 'electronic'
                        ? { borderColor: primaryColor, backgroundColor: `${primaryColor}08` }
                        : { borderColor: 'var(--border)' }
                    }
                  >
                    <CreditCard
                      className="h-4 w-4 mx-auto mb-1"
                      style={{ color: paymentMethod === 'electronic' ? primaryColor : undefined }}
                    />
                    <p className="text-[10px] font-bold text-foreground">دفع إلكتروني</p>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className="p-3 rounded-xl border-2 text-center transition-all"
                    style={
                      paymentMethod === 'cod'
                        ? { borderColor: primaryColor, backgroundColor: `${primaryColor}08` }
                        : { borderColor: 'var(--border)' }
                    }
                  >
                    <Download
                      className="h-4 w-4 mx-auto mb-1"
                      style={{ color: paymentMethod === 'cod' ? primaryColor : undefined }}
                    />
                    <p className="text-[10px] font-bold text-foreground">تحويل</p>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[10px] text-muted-foreground mb-1 block">ملاحظات (اختياري)</label>
                <textarea
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                  className="w-full h-16 rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors resize-none"
                  placeholder="ملاحظات..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {checkoutStep !== 'success' && cart.length > 0 && (
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">المجموع</span>
              <span className="text-lg font-bold" style={{ color: primaryColor }}>
                {cartTotal.toLocaleString('ar-IQ')}{' '}
                <span className="text-xs text-muted-foreground">د.ع</span>
              </span>
            </div>
            <button
              disabled={!isInfoValid}
              onClick={placeOrder}
              className="w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <Check className="h-4 w-4" /> تأكيد الطلب
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
