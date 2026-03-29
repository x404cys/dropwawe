'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Link2,
  Plus,
  Copy,
  Trash2,
  Check,
  ExternalLink,
  MessageCircle,
  Loader2,
  DollarSign,
  CreditCard,
  BarChart2,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '../../context/LanguageContext';
import {
  createPaymentLink,
  deletePaymentLink,
  getPaymentLinks,
} from '@/server/actions/payment-links';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';

interface PaymentLink {
  id: string;
  title: string;
  amount: number;
  description: string | null;
  createdAt: Date;
  store?: { name: string | null; subLink: string | null } | null;
  _count?: { submissions: number };
}

const LOCALE_MAP = {
  ar: 'ar-IQ',
  ku: 'ckb-IQ',
  en: 'en-US',
} as const;

const PaymentLinks = ({ storeId }: { storeId?: string }) => {
  const { t, dir, lang } = useLanguage();
  const locale = LOCALE_MAP[lang];
  const pageT = t.paymentLinksPage;

  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateLink = (id: string) => `https://www.matager.store/pay/${id}`;

  useEffect(() => {
    setLoading(true);
    getPaymentLinks(storeId)
      .then(setLinks)
      .catch(() => toast.error(pageT.fetchError))
      .finally(() => setLoading(false));
  }, [pageT.fetchError, storeId]);

  const handleCreate = async () => {
    if (!title.trim() || !amount.trim()) {
      toast.error(pageT.enterTitleAndAmount);
      return;
    }

    setSaving(true);
    try {
      const newLink = await createPaymentLink({
        title: title.trim(),
        amount: Number(amount),
        description: description.trim() || undefined,
        storeId,
      });

      setLinks(prev => [newLink as PaymentLink, ...prev]);
      setTitle('');
      setAmount('');
      setDescription('');
      setShowForm(false);
      toast.success(pageT.createSuccess);
    } catch {
      toast.error(pageT.createFailed);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLinks(prev => prev.filter(link => link.id !== id));
    try {
      await deletePaymentLink(id);
      toast.success(pageT.deleteSuccess);
    } catch {
      toast.error(pageT.deleteFailed);
    }
  };

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(generateLink(id));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success(pageT.copySuccess);
  };

  const handleShareWhatsApp = (link: PaymentLink) => {
    const url = generateLink(link.id);
    const text = `${link.title}\n💰 ${pageT.shareAmountLabel}: ${formatIQD(link.amount)} ${t.currency}\n${
      link.description ? `📝 ${pageT.shareDescriptionLabel}: ${link.description}\n` : ''
    }🔗 ${pageT.shareLinkLabel}: ${url}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const totalAmount = useMemo(() => links.reduce((sum, link) => sum + link.amount, 0), [links]);
  const totalSubmissions = useMemo(
    () => links.reduce((sum, link) => sum + (link._count?.submissions ?? 0), 0),
    [links]
  );

  const stats = [
    {
      icon: <Link2 className="h-3.5 w-3.5" />,
      label: pageT.linksCount,
      value: links.length.toLocaleString(locale),
    },
    {
      icon: <DollarSign className="h-3.5 w-3.5" />,
      label: pageT.totalAmounts,
      value: `${formatIQD(totalAmount)} ${t.currency}`,
    },
    {
      icon: <BarChart2 className="h-3.5 w-3.5" />,
      label: pageT.requests,
      value: totalSubmissions.toLocaleString(locale),
    },
  ];

  return (
    <div className="bg-background min-h-screen" dir={dir}>
      <div className="border-border bg-card border-b px-6 py-2">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div>
            <h1 className="text-foreground text-lg font-bold">{pageT.title}</h1>
            <p className="text-muted-foreground mt-0.5 text-xs">{pageT.subtitle}</p>
          </div>
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              size="sm"
              className="h-9 cursor-pointer gap-1.5 rounded-lg text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5" />
              {pageT.newLink}
            </Button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
        {links.length > 0 && !loading && (
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat, index) => (
              <div key={index} className="bg-card border-border rounded-xl border px-4 py-3">
                <div className="text-muted-foreground mb-1 flex items-center gap-1.5">
                  {stat.icon}
                  <span className="text-[11px]">{stat.label}</span>
                </div>
                <p className="text-foreground text-sm font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="bg-card border-border animate-in slide-in-from-top-2 overflow-hidden rounded-xl border duration-200">
            <div className="border-border flex items-center justify-between border-b px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-xl">
                  <CreditCard className="text-primary h-4 w-4" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-semibold">{pageT.formTitle}</p>
                  <p className="text-muted-foreground text-[11px]">{pageT.payTabsGateway}</p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="text-muted-foreground hover:text-foreground text-xs transition-colors"
              >
                {t.cancel}
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-muted-foreground text-xs font-medium">
                    {pageT.serviceTitleLabel} <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={title}
                    onChange={event => setTitle(event.target.value)}
                    placeholder={pageT.serviceTitlePlaceholder}
                    className="h-10 rounded-xl font-light"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground text-xs font-medium">
                    {pageT.amountLabel} ({t.currency}) <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      value={amount}
                      onChange={event => setAmount(event.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="50000"
                      className="h-10 rounded-xl pl-12 font-light"
                      type="text"
                      inputMode="numeric"
                      dir="ltr"
                    />
                    <span className="text-muted-foreground bg-muted/60 absolute top-1/2 left-3 -translate-y-1/2 rounded px-1.5 py-0.5 text-[11px] font-medium">
                      {t.currency}
                    </span>
                  </div>
                </div>

                {amount && (
                  <div className="flex items-end pb-1">
                    <div className="bg-muted/40 w-full rounded-xl px-3 py-2 text-center">
                      <p className="text-muted-foreground mb-0.5 text-[10px]">
                        {pageT.amountPreview}
                      </p>
                      <p className="text-foreground text-sm font-bold">
                        {formatIQD(amount)}
                        <span className="text-muted-foreground mr-1 text-[10px] font-normal">
                          {t.currency}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground text-xs font-medium">
                  {pageT.descriptionLabel}
                  <span className="text-muted-foreground/60 mr-1 font-normal">({t.optional})</span>
                </label>
                <Textarea
                  value={description}
                  onChange={event => setDescription(event.target.value)}
                  placeholder={pageT.descriptionPlaceholder}
                  className="min-h-[72px] resize-none rounded-xl font-light"
                />
              </div>

              {title && (
                <div className="bg-muted/30 flex items-center gap-2 rounded-xl px-3 py-2.5">
                  <Link2 className="text-muted-foreground h-3 w-3 flex-shrink-0" />
                  <span className="text-muted-foreground truncate text-[11px]" dir="ltr">
                    https://www.matager.store/pay/
                    <span className="text-foreground font-medium">{pageT.idPlaceholder}</span>
                  </span>
                </div>
              )}
            </div>

            <div className="px-5 pb-5">
              <Button
                onClick={handleCreate}
                disabled={saving || !title.trim() || !amount.trim()}
                className="h-10 w-full gap-2 rounded-xl text-sm font-semibold"
              >
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Link2 className="h-3.5 w-3.5" />
                )}
                {saving ? pageT.creatingLink : pageT.createLink}
              </Button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
          </div>
        )}

        {!loading && links.length === 0 && !showForm && (
          <div className="bg-card border-border rounded-xl border p-10 text-center">
            <div className="bg-muted/50 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl">
              <Link2 className="text-muted-foreground h-6 w-6" />
            </div>
            <p className="text-foreground mb-1 text-sm font-semibold">{pageT.emptyTitle}</p>
            <p className="text-muted-foreground mx-auto mb-5 max-w-xs text-xs">
              {pageT.emptyDescription}
            </p>
            <Button
              onClick={() => setShowForm(true)}
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 rounded-xl text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5" />
              {pageT.createFirstLink}
            </Button>
          </div>
        )}

        {!loading && links.length > 0 && (
          <div className="space-y-3">
            <p className="text-muted-foreground px-0.5 text-xs font-semibold">
              {pageT.yourLinks} ({links.length.toLocaleString(locale)})
            </p>

            {links.map(link => (
              <div
                key={link.id}
                className="bg-card border-border hover:border-border/80 overflow-hidden rounded-xl border transition-colors"
              >
                <div className="flex items-start justify-between p-4 pb-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-foreground truncate text-sm font-semibold">{link.title}</h3>
                      {link.store?.name && (
                        <span className="bg-primary/10 text-primary flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium">
                          {link.store.name}
                        </span>
                      )}
                    </div>
                    {link.description && (
                      <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">
                        {link.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-3">
                      <div className="text-muted-foreground flex items-center gap-1 text-[10px]">
                        <Clock className="h-3 w-3" />
                        {new Date(link.createdAt).toLocaleDateString(locale)}
                      </div>
                      {(link._count?.submissions ?? 0) > 0 && (
                        <div className="text-muted-foreground flex items-center gap-1 text-[10px]">
                          <BarChart2 className="h-3 w-3" />
                          {link._count!.submissions.toLocaleString(locale)} {pageT.requestLabel}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mr-3 flex flex-shrink-0 flex-col items-end">
                    <span className="text-foreground text-base font-bold">{formatIQD(link.amount)}</span>
                    <span className="text-muted-foreground text-[10px]">{t.currency}</span>
                  </div>
                </div>

                <div className="bg-muted/30 mx-4 mb-3 flex items-center gap-2 rounded-xl px-3 py-2">
                  <Link2 className="text-muted-foreground h-3 w-3 flex-shrink-0" />
                  <span className="text-muted-foreground flex-1 truncate text-[11px]" dir="ltr">
                    {generateLink(link.id)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-4 pb-4">
                  <Button
                    onClick={() => handleCopy(link.id)}
                    variant="outline"
                    size="sm"
                    className="h-8 flex-1 gap-1.5 rounded-xl text-xs font-medium"
                  >
                    {copiedId === link.id ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copiedId === link.id ? pageT.copied : pageT.copy}
                  </Button>

                  <Button
                    onClick={() => window.open(generateLink(link.id), '_blank')}
                    variant="outline"
                    size="sm"
                    className="h-8 flex-1 gap-1.5 rounded-xl text-xs font-medium"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {pageT.open}
                  </Button>

                  <Button
                    onClick={() => handleShareWhatsApp(link)}
                    variant="outline"
                    size="sm"
                    className="h-8 flex-1 gap-1.5 rounded-xl border-emerald-200 text-xs font-medium text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <MessageCircle className="h-3 w-3" />
                    {pageT.whatsapp}
                  </Button>

                  <button
                    onClick={() => handleDelete(link.id)}
                    className="border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border transition-colors"
                    aria-label={t.delete}
                    title={t.delete}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentLinks;
