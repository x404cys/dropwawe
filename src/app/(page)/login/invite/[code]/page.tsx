'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import axios from 'axios';
import Image from 'next/image';
import { Loader2, AlertCircle } from 'lucide-react';

export default function InviteRegisterPage() {
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [validInvite, setValidInvite] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const parts = window.location.pathname.split('/');
    const code = parts[parts.length - 1];
    setInviteCode(code);

    const checkInvite = async () => {
      try {
        const res = await axios.post('/api/dashboard/invite/verify', {
          inviteCode: code,
        });

        if (res.data.success) {
          setValidInvite(true);
        } else {
          setError('رابط الدعوة غير صالح أو منتهي');
        }
      } catch {
        setError('حدث خطأ أثناء التحقق من الدعوة');
      } finally {
        setLoading(false);
      }
    };

    if (code) checkInvite();
  }, []);

  const callbackUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://dashboard.matager.store/'
      : 'http://localhost:3000/Dashboard/';

  const handleGoogleSignIn = async () => {
    if (!inviteCode) return;
    setSigningIn(true);
    await signIn('google', {
      callbackUrl: `${callbackUrl}/Loading-data-invite/${inviteCode}`,
    });
    setSigningIn(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/Logo-Matager/Matager-logo2.PNG"
            alt="Matager"
            width={64}
            height={64}
            className="rounded-2xl"
          />
          <h1 className="text-2xl font-bold">Matager</h1>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold">أهلاً بك </h2>
          <p className="text-muted-foreground text-sm">
            لديك دعوة للانضمام إلى متجر على منصة متاجر
          </p>
        </div>

        <div className="rounded-lg border p-4">
          {loading ? (
            <Loader2 className="text-primary mx-auto h-5 w-5 animate-spin" />
          ) : (
            <code className="text-primary text-lg font-bold tracking-widest">
              {inviteCode?.toUpperCase()}
            </code>
          )}
        </div>

        {error && !loading && (
          <div className="border-destructive/30 bg-destructive/5 flex items-start gap-3 rounded-lg border p-3 text-right">
            <AlertCircle className="text-destructive h-5 w-5" />
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {validInvite && !loading && (
          <button
            onClick={handleGoogleSignIn}
            disabled={signingIn}
            className="w-full cursor-pointer rounded-lg bg-gradient-to-l from-sky-300/80 via-sky-200/80 to-sky-200/90 px-6 py-3 font-bold text-sky-900 transition hover:scale-105 disabled:opacity-60"
          >
            {signingIn ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول عبر Google'}
          </button>
        )}

        <p className="text-muted-foreground pt-4 text-xs">دعوة خاصة • وصول آمن</p>
      </div>
    </div>
  );
}
