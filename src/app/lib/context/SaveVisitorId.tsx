'use client';
import { useEffect } from 'react';
import { trackVisitorVisit } from './visitorTracking';

export function useTrackVisitor(path: string) {
  useEffect(() => {
    void trackVisitorVisit({
      path,
      dedupeKey: `page:${path}:${window.location.pathname}`,
    });
  }, [path]);
}

export const useTrackVisitor4landing = useTrackVisitor;
