'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';
import { Loader2, AlertCircle, Store } from 'lucide-react';

export default function WelcomPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteValid, setInviteValid] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const codeFromPath = pathParts[pathParts.length - 1];
    setInviteCode(codeFromPath);

    const checkInvite = async () => {
      try {
        const res = await axios.post('/api/dashboard/invite/verify', {
          inviteCode: codeFromPath,
        });

        if (res.data.success) {
          setInviteValid(true);
        } else {
          setError('رابط الدعوة غير صالح أو منتهي');
        }
      } catch {
        setError('حدث خطأ أثناء التحقق من الدعوة');
      } finally {
        setLoading(false);
      }
    };

    if (codeFromPath) checkInvite();
  }, []);

  const handleJoin = async () => {
    if (!session?.user?.id) {
      await signIn('google', { callbackUrl: window.location.href });
      return;
    }

    try {
      setJoining(true);
      const res = await axios.post('/api/dashboard/invite/use', {
        inviteCode,
        userId: session.user.id,
      });

      if (res.data.success) {
        router.replace('/Dashboard');
      } else {
        setError(res.data.error || 'فشل الانضمام إلى المتجر');
      }
    } catch {
      setError('حدث خطأ أثناء الانضمام');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/Logo-Matager/Matager-logo2.PNG"
            alt="Matager"
            width={64}
            height={64}
            className="rounded-2xl"
          />
          <h1 className="text-2xl font-bold tracking-tight">Matager – منصة متاجر</h1>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold sm:text-3xl">أهلاً وسهلاً بك {session?.user.name}</h2>
          <p className="text-muted-foreground"> تم انظمامك الى المتجر بنجاح</p>
        </div>

        <div className="bg-card/50 rounded-lg border p-5">
          <p className="mb-2 text-xs">رمز الدعوة</p>
          {loading ? (
            <div className="flex justify-center py-2">
              <Loader2 className="text-primary h-5 w-5 animate-spin" />
            </div>
          ) : (
            <code className="text-primary text-lg font-bold tracking-widest">
              {inviteCode?.toUpperCase()}
            </code>
          )}
        </div>

        {error && !loading && (
          <div className="border-destructive/30 bg-destructive/5 flex items-start gap-3 rounded-lg border p-4 text-right">
            <AlertCircle className="text-destructive mt-0.5 h-5 w-5" />
            <div>
              <p className="text-destructive font-medium">تعذر المتابعة</p>
              <p className="text-destructive/80 mt-1 text-sm">{error}</p>
            </div>
          </div>
        )}

        {inviteValid && !loading && (
          <button
            onClick={handleJoin}
            disabled={joining}
            className="relative cursor-pointer w-full rounded-lg bg-gradient-to-l from-sky-300/80 via-sky-200/80 to-sky-200/90 px-8 py-4 font-bold text-sky-900 shadow-[0_6px_20px_rgba(0,150,200,0.35)] ring-2 ring-white/70 transition-all duration-300 hover:scale-105 disabled:opacity-60"
          >
            {joining ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                جارٍ الانضمام...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Store className="h-5 w-5" />
                الانضمام إلى المتجر
              </span>
            )}
          </button>
        )}

        <div className="pt-6">
          <p className="text-muted-foreground text-xs">دعوة خاصة • وصول آمن • تجربة احترافية</p>
        </div>
      </div>
    </div>
  );
}
