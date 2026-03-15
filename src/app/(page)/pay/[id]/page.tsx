'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  CreditCard,
  Send,
  CheckCircle2,
  Store,
  Clock,
  AlertCircle,
  Loader2,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getPaymentLinkById, initiatePayTabsPayment } from '@/server/actions/payment-links';
import { toast } from 'sonner';

const PaymentPage = () => {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [link, setLink] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [payerName, setPayerName] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [payerEmail, setPayerEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const status = searchParams.get('status');
  const isPaid = status === 'success';
  const isFailed = status === 'failed';

  useEffect(() => {
    if (!id) return;
    getPaymentLinkById(id)
      .then(data => {
        if (data) setLink(data);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async () => {
    if (!payerName.trim() || !payerPhone.trim() || !payerEmail.trim()) {
      toast('يرجى تعبئة جميع الحقول');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payerEmail)) {
      toast('البريد الإلكتروني غير صحيح');
      return;
    }

    setSubmitting(true);
    try {
      const { redirectUrl } = await initiatePayTabsPayment({
        paymentLinkId: id,
        payerName: payerName.trim(),
        payerPhone: payerPhone.trim(),
        payerEmail: payerEmail.trim(),
      });
      window.location.href = redirectUrl;
    } catch (err: any) {
      toast('حدث خطأ');
      setSubmitting(false);
    }
  };

  const storeName = link?.store?.name || link?.user?.storeName || 'المتجر';

  if (loading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (notFound || !link) {
    return (
      <div
        className="bg-background flex min-h-screen flex-col items-center justify-center px-6 text-center"
        dir="rtl"
      >
        <div className="bg-destructive/10 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
          <AlertCircle className="text-destructive h-10 w-10" />
        </div>
        <h1 className="mb-2 text-xl font-bold">رابط غير صالح</h1>
        <p className="text-muted-foreground max-w-xs text-sm">
          هذا الرابط غير موجود أو تم حذفه. تواصل مع البائع للحصول على رابط جديد.
        </p>
      </div>
    );
  }

  if (isPaid) {
    return (
      <div
        className="bg-background flex min-h-screen flex-col items-center justify-center px-6 text-center"
        dir="rtl"
      >
        <div className="animate-in zoom-in mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10 duration-300">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
        <h1 className="mb-2 text-xl font-bold">تم الدفع بنجاح! 🎉</h1>
        <p className="text-muted-foreground mb-4 max-w-xs text-sm">
          تمت عملية الدفع بنجاح وسيتم التواصل معك قريباً
        </p>
        <div className="bg-card border-border w-full max-w-sm rounded-2xl border p-4">
          <div className="mb-2 flex justify-between">
            <span className="text-muted-foreground text-xs">الخدمة</span>
            <span className="text-sm font-bold">{link.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-xs">المبلغ المدفوع</span>
            <span className="text-primary text-sm font-bold">
              {link.amount.toLocaleString('ar-IQ')} د.ع
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (isFailed) {
    return (
      <div
        className="bg-background flex min-h-screen flex-col items-center justify-center px-6 text-center"
        dir="rtl"
      >
        <div className="bg-destructive/10 mb-6 flex h-24 w-24 items-center justify-center rounded-full">
          <XCircle className="text-destructive h-12 w-12" />
        </div>
        <h1 className="mb-2 text-xl font-bold">فشلت عملية الدفع</h1>
        <p className="text-muted-foreground mb-6 max-w-xs text-sm">
          لم تكتمل عملية الدفع. يمكنك المحاولة مرة أخرى.
        </p>
        <Button onClick={() => (window.location.href = `/pay/${id}`)} className="rounded-2xl px-8">
          حاول مجدداً
        </Button>
      </div>
    );
  }

  return (
    <div
      className="from-primary/5 via-background to-background min-h-screen bg-gradient-to-b"
      dir="rtl"
    >
      <div className="bg-primary/10 border-primary/20 border-b">
        <div className="container mx-auto flex max-w-lg items-center justify-center gap-2 px-4 py-3">
          <ShieldCheck className="text-primary h-4 w-4" />
          <span className="text-primary text-xs font-semibold">صفحة دفع آمنة عبر PayTabs</span>
        </div>
      </div>

      <main className="container mx-auto max-w-lg space-y-6 px-4 py-8">
        {/* Store Badge */}
        <div className="flex items-center justify-center">
          <div className="bg-card border-border flex items-center gap-2 rounded-full border px-4 py-2 shadow-sm">
            <Store className="text-muted-foreground h-4 w-4" />
            <span className="text-xs font-semibold">{storeName}</span>
          </div>
        </div>

        <div className="bg-card border-border overflow-hidden rounded-3xl border shadow-lg">
          {/* Header */}
          <div className="from-primary/10 to-primary/5 space-y-3 bg-gradient-to-l px-6 py-6 text-center">
            <h1 className="text-lg font-bold">{link.title}</h1>
            {link.description && (
              <p className="text-muted-foreground text-xs leading-relaxed">{link.description}</p>
            )}
            <div className="pt-2">
              <span className="text-primary text-3xl font-black">
                {link.amount.toLocaleString('ar-IQ')}
              </span>
              <span className="text-muted-foreground mr-1.5 text-sm font-semibold">د.ع</span>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4 p-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">الاسم الكامل *</label>
              <Input
                value={payerName}
                onChange={e => setPayerName(e.target.value)}
                placeholder="أدخل اسمك الكامل"
                className="bg-muted/30 h-12 rounded-xl"
                disabled={submitting}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">رقم الهاتف *</label>
              <Input
                value={payerPhone}
                onChange={e => setPayerPhone(e.target.value)}
                placeholder="07xxxxxxxxx"
                type="tel"
                inputMode="tel"
                dir="ltr"
                className="bg-muted/30 h-12 rounded-xl text-left"
                disabled={submitting}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">البريد الإلكتروني *</label>
              <Input
                value={payerEmail}
                onChange={e => setPayerEmail(e.target.value)}
                placeholder="example@email.com"
                type="email"
                inputMode="email"
                dir="ltr"
                className="bg-muted/30 h-12 rounded-xl text-left"
                disabled={submitting}
              />
              <p className="text-muted-foreground text-[10px]">مطلوب لاستلام إيصال الدفع</p>
            </div>

            {/* PayTabs Badge */}
            <div className="bg-muted/20 flex items-center justify-center gap-2 rounded-xl py-2">
              <CreditCard className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground text-xs">الدفع الآمن عبر</span>
              <span className="text-foreground text-xs font-bold">PayTabs</span>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!payerName.trim() || !payerPhone.trim() || !payerEmail.trim() || submitting}
              className="h-13 w-full gap-2 rounded-2xl text-sm font-bold shadow-lg"
              size="lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> جاري التحويل لبوابة الدفع...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> ادفع الآن — {link.amount.toLocaleString('ar-IQ')} د.ع
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 pb-8">
          <Clock className="text-muted-foreground h-3 w-3" />
          <span className="text-muted-foreground text-[10px]">
            تم إنشاء هذا الرابط بتاريخ {new Date(link.createdAt).toLocaleDateString('ar-IQ')}
          </span>
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;
