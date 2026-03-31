'use client';
import { useEffect } from 'react';
import { trackVisitorVisit } from './visitorTracking';

export function useTrackVisitor(path: string) {
  useEffect(() => {
    void trackVisitorVisit({
      storeName: path,
      path: `${window.location.pathname}${window.location.search}`,
      pageType: 'LANDING',
      entityType: 'STORE',
      entityId: path,
      entityName: path,
      dedupeKey: `page:${path}:${window.location.pathname}`,
    });
  }, [path]);
}

export const useTrackVisitor4landing = useTrackVisitor;
