'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { trackVisitorVisit } from '@/app/lib/context/visitorTracking';

export function useTrackStoreVisit(storeSlug: string | null | undefined) {
  const pathname = usePathname();

  useEffect(() => {
    if (!storeSlug) return;

    void trackVisitorVisit({
      path: storeSlug,
      dedupeKey: `store:${storeSlug}:${pathname}`,
    });
  }, [pathname, storeSlug]);
}
