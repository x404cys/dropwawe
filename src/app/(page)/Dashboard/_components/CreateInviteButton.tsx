'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Copy, Link2, Loader2 } from 'lucide-react';

export default function CreateInvitePage() {
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  const inviteLink = inviteCode && `${window.location.origin}/login/invite/${inviteCode}`;

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
    } catch (err) {
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
    <div dir="rtl" className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">دعوة مستخدمين</h1>
        <p className="text-muted-foreground text-sm">
          أنشئ رابط دعوة للسماح لمستخدمين جدد بالانضمام إلى المنصة. وادراة متجرك بسهولة مع فريقك.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>إنشاء دعوة جديدة</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            onClick={handleCreateInvite}
            disabled={loading}
            className="w-full cursor-pointer bg-sky-600 hover:bg-sky-700"
          >
            {loading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جارٍ الإنشاء...
              </>
            ) : (
              'إنشاء رابط دعوة'
            )}
          </Button>

          {inviteCode && (
            <div className="bg-muted/40 space-y-3 rounded-lg border p-4">
              <div className="text-sm">
                <span className="text-muted-foreground">كود الدعوة</span>
                <p className="font-mono font-semibold">{inviteCode}</p>
              </div>

              <div className="bg-background flex items-center justify-between gap-2 rounded-md border p-2">
                <div className="flex items-center gap-2 truncate text-sm">
                  <Link2 className="text-muted-foreground h-4 w-4" />
                  <span className="truncate">{inviteLink}</span>
                </div>

                <Button size="icon" variant="ghost" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 cursor-pointer" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
