'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '../_components/Loader-check';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/admin/check-admin-role', {
          credentials: 'include',
        });

        if (!res.ok) {
          router.replace('https://www.matager.store');
          return;
        }

        setAuthorized(true);
      } catch {
        router.replace('https://www.matager.store');
      }
    };

    checkSession();
  }, [router]);

  if (authorized === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}
