'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import axios from 'axios';

export default function InviteRegisterPage() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [validInvite, setValidInvite] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const codeFromPath = pathParts[pathParts.length - 1];
    setInviteCode(codeFromPath);

    const checkInvite = async () => {
      try {
        const res = await axios.post('/api/dashboard/invite/verify', {
          inviteCode: codeFromPath,
        });
        if (res.data.success) setValidInvite(true);
        else setError('هذا الرابط غير صالح أو انتهت صلاحيته.');
      } catch (err) {
        console.error(err);
        setError('حدث خطأ أثناء التحقق من الرابط.');
      }
    };

    if (codeFromPath) checkInvite();
  }, []);

  const callbackUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://dashboard.dropwave.cloud/'
      : 'http://localhost:3000/Dashboard/';

  const handleGoogleSignIn = async () => {
    if (!inviteCode) return;
    setIsLoading(true);
    await signIn('google', {
      callbackUrl: `${callbackUrl}/Loading-data-invite/${inviteCode}`,
    });
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">تسجيل مستخدم جديد</h1>
        {error && <p className="mb-4 text-red-500">{error}</p>}

        {!error && !validInvite && <p>جارٍ التحقق من رابط الدعوة...</p>}

        {validInvite && (
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-3xl bg-sky-600 text-lg font-semibold text-white transition hover:bg-sky-800"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                جاري التحميل...
              </>
            ) : (
              <>
                <FaGoogle className="h-5 w-5" />
                تسجيل الدخول عبر Google
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
