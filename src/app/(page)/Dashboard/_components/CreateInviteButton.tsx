'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Link2, Loader2, UserPlus, Users, ShieldCheck } from 'lucide-react';

type MultiUser = {
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
};

export default function CreateInvitePage() {
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  const inviteLink = inviteCode && `${window.location.origin}/login/invite/${inviteCode}`;

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
        toast.error(data.error || 'فشل إنشاء رابط الدعوة');
        return;
      }

      setInviteCode(data.invite.code);
      toast.success('تم إنشاء رابط الدعوة بنجاح');
    } catch {
      toast.error('حدث خطأ في الخادم');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    toast.success('تم نسخ رابط الدعوة');
  };

  return (
    <div dir="rtl" className="mx-auto max-w-3xl space-y-12">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600/10 text-sky-600">
            <UserPlus className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold sm:text-2xl">دعوة أعضاء لإدارة المتجر</h1>
        </div>
        <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
          أضف أعضاء إلى فريقك وامنحهم صلاحيات لإدارة الطلبات والمخزون، والعمل الجماعي يساعدك على
          إدارة متجرك بكفاءة أعلى.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-background rounded-xl border p-4 text-center">
          <Users className="mx-auto h-6 w-6 text-sky-600" />
          <p className="mt-2 text-sm font-medium">عمل جماعي</p>
          <span className="text-muted-foreground text-xs">إدارة المتجر مع فريقك بسهولة</span>
        </div>

        <div className="bg-background rounded-xl border p-4 text-center">
          <UserPlus className="mx-auto h-6 w-6 text-sky-600" />
          <p className="mt-2 text-sm font-medium">دعوة سريعة</p>
          <span className="text-muted-foreground text-xs">إضافة أعضاء برابط واحد</span>
        </div>
      </div>

      <div className="from-background to-muted/40 border-none bg-gradient-to-br">
        <div className="space-y-6 p-6">
          <Button
            onClick={handleCreateInvite}
            disabled={loading}
            className="h-12 w-full rounded-lg bg-gradient-to-l from-sky-600 to-blue-600 text-sm font-semibold text-white hover:opacity-90 sm:text-base"
          >
            {loading ? (
              <>
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                جارٍ إنشاء رابط الدعوة...
              </>
            ) : (
              'إنشاء رابط دعوة جديد'
            )}
          </Button>
        </div>
        {inviteCode && (
          <div className="w-auto space-y-3">
            <div className="rounded-xl border p-4">
              <div>
                <p className="text-muted-foreground text-xs">كود الدعوة</p>
                <p className="font-mono text-sm font-semibold">{inviteCode}</p>
              </div>

              <div className="bg-muted/40 flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="flex min-w-0 items-center gap-2 text-sm">
                  <Link2 className="text-muted-foreground h-4 w-4" />
                  <span className="truncate">{inviteLink}</span>
                </div>
              </div>
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={copyToClipboard}
              className="w-full hover:bg-sky-600/10"
            >
              <span>نسخ رابط الدعوة</span>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg">الأعضاء المضافون</h2>

        {data && data.length > 0 ? (
          <div className="grid gap-3">
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
                  className="bg-background flex flex-col gap-3 rounded-xl border p-4 transition hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {item.user.image ? (
                      <Image
                        src={item.user.image}
                        alt={item.user.name}
                        width={40}
                        height={40}
                        className="rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600/10 text-sm font-semibold text-sky-600">
                        {initials}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate font-medium">{item.user.name}</p>
                      <p className="text-muted-foreground truncate text-sm">{item.user.email}</p>
                    </div>
                  </div>

                  <span className="text-muted-foreground text-xs">
                    تاريخ الانضمام: {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">لا يوجد أعضاء مضافون حتى الآن.</p>
        )}
      </div>
    </div>
  );
}
