'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Copy, Link2, Loader2, UserPlus, Users, ShieldCheck, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

type MultiUser = {
  createdAt: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
};

export default function CreateInvitePage({ readOnly = false }: { readOnly?: boolean }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const inviteLink = inviteCode && `https://login.matager.store/login/invite/${inviteCode}`;

  const { data } = useSWR<MultiUser[]>(
    '/api/dashboard/setting/multi-user/get-users',
    (url: string | URL | Request) => fetch(url).then(res => res.json())
  );

  const handleCreateInvite = async () => {
    if (readOnly) return;
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/invite/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || t.teamSettings?.inviteCreateFailed || 'فشل إنشاء رابط الدعوة');
        return;
      }

      setInviteCode(data.invite.code);
      toast.success(t.teamSettings?.inviteCreatedSuccess || 'تم إنشاء رابط الدعوة بنجاح');
    } catch {
      toast.error(t.teamSettings?.serverError || 'حدث خطأ في الخادم');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (readOnly || !inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success(t.teamSettings?.inviteCopied || 'تم نسخ رابط الدعوة');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div dir="rtl" className="space-y-6">
      {/* Header section */}
      <div className="flex items-start gap-3">
        <div className="bg-primary/10 border-primary/20 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border">
          <UserPlus className="text-primary h-5 w-5" />
        </div>
        <div>
          <h2 className="text-foreground text-lg font-bold">
            {t.teamSettings?.title || 'دعوة أعضاء لإدارة المتجر'}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            {t.teamSettings?.subtitle ||
              'أضف أعضاء إلى فريقك وامنحهم صلاحيات لإدارة الطلبات والمخزون.'}
          </p>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-2 gap-3">
        <div className="border-border bg-card space-y-2 rounded-2xl border p-4 text-center">
          <div className="bg-primary/10 mx-auto flex h-9 w-9 items-center justify-center rounded-xl">
            <Users className="text-primary h-4 w-4" />
          </div>
          <div>
            <p className="text-foreground text-xs font-bold">
              {t.teamSettings?.teamwork || 'عمل جماعي'}
            </p>
            <p className="text-muted-foreground mt-0.5 text-[11px]">
              {t.teamSettings?.teamworkDesc || 'إدارة المتجر بالتعاون'}
            </p>
          </div>
        </div>

        <div className="border-border bg-card space-y-2 rounded-2xl border p-4 text-center">
          <div className="bg-primary/10 mx-auto flex h-9 w-9 items-center justify-center rounded-xl">
            <ShieldCheck className="text-primary h-4 w-4" />
          </div>
          <div>
            <p className="text-foreground text-xs font-bold">
              {t.teamSettings?.quickInvite || 'دعوة سريعة'}
            </p>
            <p className="text-muted-foreground mt-0.5 text-[11px]">
              {t.teamSettings?.quickInviteDesc || 'إضافة أعضاء برابط'}
            </p>
          </div>
        </div>
      </div>

      {/* Invite button */}
      <Button
        onClick={handleCreateInvite}
        disabled={loading || readOnly}
        className="h-12 w-full rounded-xl text-base font-bold transition-all active:scale-[0.98]"
        size="lg"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t.teamSettings?.creatingInvite || 'جارٍ إنشاء رابط الدعوة...'}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            {t.teamSettings?.createInvite || 'إنشاء رابط دعوة جديد'}
          </span>
        )}
      </Button>

      {/* Invite link result */}
      <AnimatePresence>
        {inviteCode && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-primary/20 bg-primary/5 space-y-3 rounded-2xl border p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs font-bold tracking-wide uppercase">
                {t.teamSettings?.inviteCode || 'كود الدعوة'}
              </p>
              <span className="text-foreground bg-card border-border/50 rounded-lg border px-2.5 py-0.5 font-mono text-sm font-bold">
                {inviteCode}
              </span>
            </div>

            <div className="bg-card border-border/50 flex items-center gap-2 rounded-xl border p-3">
              <Link2 className="text-muted-foreground h-4 w-4 flex-shrink-0" />
              <span className="text-muted-foreground flex-1 truncate text-xs" dir="ltr">
                {inviteLink}
              </span>
            </div>

            <Button
              onClick={copyToClipboard}
              disabled={readOnly}
              variant="outline"
              className="h-11 w-full gap-2 rounded-xl font-bold"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-600">تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  {t.teamSettings?.copyInviteLink || 'نسخ رابط الدعوة'}
                </>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Members list */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <h3 className="text-foreground text-sm font-bold">
            {t.teamSettings?.addedMembers || 'الأعضاء المضافون'}
          </h3>
          {data && data.length > 0 && (
            <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[11px] font-bold">
              {data.length}
            </span>
          )}
        </div>

        {data && data.length > 0 ? (
          <div className="space-y-2">
            {data.map(item => {
              const initials =
                item.user.name
                  ?.split(' ')
                  .map(n => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase() || 'U';

              return (
                <div
                  key={item.user.id}
                  className="border-border bg-card flex items-center gap-3 rounded-2xl border p-3 transition-shadow hover:shadow-sm"
                >
                  {item.user.image ? (
                    <Image
                      src={item.user.image}
                      alt={item.user.name}
                      width={40}
                      height={40}
                      className="flex-shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="bg-primary/10 text-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold">
                      {initials}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-semibold">
                      {item.user.name}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">{item.user.email}</p>
                  </div>

                  <div className="flex flex-shrink-0 flex-col items-end gap-1">
                    <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-bold">
                      {item.role}
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                      {new Date(item.createdAt).toLocaleDateString('ar-IQ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2 py-10 text-center">
            <div className="bg-muted mx-auto flex h-12 w-12 items-center justify-center rounded-2xl">
              <Users className="text-muted-foreground h-6 w-6" />
            </div>
            <p className="text-muted-foreground text-sm">
              {t.teamSettings?.noMembers || 'لا يوجد أعضاء مضافون حتى الآن.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
