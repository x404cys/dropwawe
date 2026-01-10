'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession, signIn } from 'next-auth/react';

export default function InvitePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteValid, setInviteValid] = useState(false);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

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
          setStoreId(res.data.storeId);
          setOwnerId(res.data.ownerId);
        } else {
          setError(res.data.error || 'Invalid or expired invite code.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to verify invite.');
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
      const res = await axios.post('/api/dashboard/invite/use', {
        inviteCode,
        userId: session.user.id,
      });

      if (res.data.success) {
        router.replace('/Dashboard');
      } else {
        setError(res.data.error || 'Failed to join store');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to join store');
    }
  };

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      {inviteValid && storeId ? (
        <>
          <h1 className="mb-4 text-2xl font-bold">You have been invited to join this store!</h1>
          <button
            className="rounded bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
            onClick={handleJoin}
          >
            Join Store
          </button>
        </>
      ) : (
        <p className="text-red-500">Invalid or expired invite code.</p>
      )}
    </div>
  );
}
