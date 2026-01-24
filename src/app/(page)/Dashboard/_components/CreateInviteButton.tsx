'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Copy, Link2, Loader2, UserPlus } from 'lucide-react';
import Image from 'next/image';
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
    toast.success('تم نسخ الرابط');
  };

  return (
    <div dir="rtl" className="space-y-10">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky-600/10 text-sky-600">
            <UserPlus className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">دعوة مستخدمين</h1>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          أنشئ روابط دعوة لإضافة أعضاء جدد وإدارة متجرك باحترافية مع فريقك.
        </p>
      </div>

      <Card className="from-background to-muted/40 border-none bg-gradient-to-br">
        <CardContent className="space-y-6">
          <Button
            onClick={handleCreateInvite}
            disabled={loading}
            className="h-12 w-full rounded-lg bg-gradient-to-l from-sky-600 to-blue-600 text-base font-semibold hover:opacity-90"
          >
            {loading ? (
              <>
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                جارٍ إنشاء الرابط...
              </>
            ) : (
              'إنشاء رابط دعوة جديد'
            )}
          </Button>

          {inviteCode && (
            <div className="bg-background/60 space-y-4 rounded-lg border p-4 backdrop-blur">
              <div>
                <p className="text-muted-foreground text-xs">كود الدعوة</p>
                <p className="font-mono text-sm font-semibold">{inviteCode}</p>
              </div>

              <div className="bg-muted/40 flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="flex items-center gap-2 truncate text-sm">
                  <Link2 className="text-muted-foreground h-4 w-4" />
                  <span className="truncate">{inviteLink}</span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={copyToClipboard}
                  className="hover:bg-sky-600/10"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">المستخدمون المضافون</h2>
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
                  className="bg-background flex items-center justify-between rounded-lg border p-4 transition hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
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

                    <div>
                      <p className="leading-tight font-medium">{item.user.name}</p>
                      <p className="text-muted-foreground text-sm">{item.user.email}</p>
                    </div>
                  </div>

                  <span className="text-muted-foreground text-xs whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">لا يوجد مستخدمون مدعوون حتى الآن.</p>
        )}
      </div>
    </div>
  );
}
