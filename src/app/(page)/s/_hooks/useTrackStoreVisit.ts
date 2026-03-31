'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { trackVisitorVisit } from '@/app/lib/context/visitorTracking';

export function useTrackStoreVisit(storeSlug: string | null | undefined) {
  const pathname = usePathname();

  useEffect(() => {
    if (!storeSlug) return;

    void trackVisitorVisit({
      storeName: storeSlug,
      path: pathname,
      pageType: 'STORE_HOME',
      entityType: 'STORE',
      entityId: storeSlug,
      entityName: storeSlug,
      dedupeKey: `store-home:${storeSlug}:${pathname}`,
    });
  }, [pathname, storeSlug]);
}
