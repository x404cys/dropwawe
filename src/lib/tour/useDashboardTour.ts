'use client';

/**
 * useDashboardTour.ts
 * React hook that initialises Shepherd.js tour for the Dashboard.
 *
 * - Auto-starts 1.5 s after mount for first-time users
 * - Exposes startTour() for the manual "ابدأ الجولة" button
 * - Detects mobile vs desktop at start time for correct step set
 */

import { useEffect, useRef, useCallback } from 'react';
import { createDashboardTour, isTourCompleted } from '@/lib/tour/dashboardTour';

export function useDashboardTour(isReady: boolean = true) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tourRef = useRef<any>(null);

  useEffect(() => {
    // Only start building the tour or timer once the UI is actually ready (no skeletons)
    if (!isReady) return;

    if (!tourRef.current) {
      tourRef.current = createDashboardTour();
    }

    if (!isTourCompleted() && tourRef.current) {
      const timer = setTimeout(() => {
        tourRef.current?.drive();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  const startTour = useCallback(() => {
    // Always create a fresh instance so the correct mobile/desktop
    // step set is picked up at the moment the button is pressed.
    if (tourRef.current?.destroy) {
      tourRef.current.destroy();
    }
    tourRef.current = createDashboardTour();
    if (tourRef.current) {
      tourRef.current.drive();
    }
  }, []);

  return { startTour };
}
