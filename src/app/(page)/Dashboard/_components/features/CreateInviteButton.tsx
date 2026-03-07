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

export default function CreateInvitePage() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const inviteLink = inviteCode && `https://login.drop-wave.com/login/invite/${inviteCode}`;

  const { data } = useSWR<MultiUser[]>(
    '/api/dashboard/setting/multi-user/get-users',
    (url: string | URL | Request) => fetch(url).then(res => res.json())
  );

  const handleCreateInvite = async () => {
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
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success(t.teamSettings?.inviteCopied || 'تم نسخ رابط الدعوة');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div dir="rtl" className="space-y-6">

      {/* Header section */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            {t.teamSettings?.title || 'دعوة أعضاء لإدارة المتجر'}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mt-1">
            {t.teamSettings?.subtitle ||
              'أضف أعضاء إلى فريقك وامنحهم صلاحيات لإدارة الطلبات والمخزون.'}
          </p>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4 text-center space-y-2">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">{t.teamSettings?.teamwork || 'عمل جماعي'}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {t.teamSettings?.teamworkDesc || 'إدارة المتجر بالتعاون'}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 text-center space-y-2">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">{t.teamSettings?.quickInvite || 'دعوة سريعة'}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {t.teamSettings?.quickInviteDesc || 'إضافة أعضاء برابط'}
            </p>
          </div>
        </div>
      </div>

      {/* Invite button */}
      <Button
        onClick={handleCreateInvite}
        disabled={loading}
        className="w-full h-12 rounded-xl font-bold text-base active:scale-[0.98] transition-all"
        size="lg"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {t.teamSettings?.creatingInvite || 'جارٍ إنشاء رابط الدعوة...'}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Link2 className="w-4 h-4" />
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
            className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                {t.teamSettings?.inviteCode || 'كود الدعوة'}
              </p>
              <span className="font-mono text-sm font-bold text-foreground bg-card border border-border/50 px-2.5 py-0.5 rounded-lg">
                {inviteCode}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-card border border-border/50 rounded-xl p-3">
              <Link2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground truncate flex-1" dir="ltr">
                {inviteLink}
              </span>
            </div>

            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="w-full h-11 rounded-xl font-bold gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600">تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
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
          <h3 className="text-sm font-bold text-foreground">
            {t.teamSettings?.addedMembers || 'الأعضاء المضافون'}
          </h3>
          {data && data.length > 0 && (
            <span className="bg-muted text-muted-foreground text-[11px] font-bold px-2 py-0.5 rounded-full">
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
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 hover:shadow-sm transition-shadow"
                >
                  {item.user.image ? (
                    <Image
                      src={item.user.image}
                      alt={item.user.name}
                      width={40}
                      height={40}
                      className="rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {initials}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{item.user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.user.email}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[10px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      {item.role}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString('ar-IQ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {t.teamSettings?.noMembers || 'لا يوجد أعضاء مضافون حتى الآن.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
