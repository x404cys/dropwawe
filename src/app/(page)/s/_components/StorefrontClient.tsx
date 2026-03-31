'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import { trackVisitorVisit } from '@/app/lib/context/visitorTracking';
import type { VisitEntityType, VisitPageType } from '@/lib/visitor-tracking';
import { SectionsConfig, StorefrontStore } from '../_lib/types';
import FloatingCart from './floating/FloatingCart';

interface StorefrontClientProps {
  store: StorefrontStore;
  primaryColor?: string;
  sections?: SectionsConfig;
  showFloatingCart?: boolean;
  visit: {
    pageType: VisitPageType;
    entityType: VisitEntityType;
    entityId?: string | null;
    entityName?: string | null;
    dedupeKey: string;
  };
  children: ReactNode;
}

export default function StorefrontClient({
  store,
  primaryColor,
  sections,
  showFloatingCart = true,
  visit,
  children,
}: StorefrontClientProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!store.subLink) return;

    void trackVisitorVisit({
      storeName: store.subLink,
      path: pathname,
      pageType: visit.pageType,
      entityType: visit.entityType,
      entityId: visit.entityId ?? null,
      entityName: visit.entityName ?? null,
      dedupeKey: visit.dedupeKey,
    });
  }, [
    pathname,
    store.subLink,
    visit.dedupeKey,
    visit.entityId,
    visit.entityName,
    visit.entityType,
    visit.pageType,
  ]);

  return (
    <>
      {children}
      {showFloatingCart && sections?.store && primaryColor ? (
        <FloatingCart primaryColor={primaryColor} />
      ) : null}
    </>
  );
}
