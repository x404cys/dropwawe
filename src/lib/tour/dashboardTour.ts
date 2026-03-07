/**
 * dashboardTour.ts
 * Driver.js tour factory for the Matager Dashboard.
 * Supports separate step sets for mobile and desktop layouts.
 */

import { driver, DriveStep } from 'driver.js';

export const TOUR_STORAGE_KEY = 'dashboard-tour-completed';

/** Steps shown on mobile (md:hidden layout) */
const MOBILE_STEPS: DriveStep[] = [
  {
    element: '#mobile-revenue-card',
    popover: {
      title: 'نظرة عامة على الأداء',
      description: 'يمكنك تتبع إيرادات متجرك ونموه الأسبوعي من هذه البطاقة مباشرةً.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#mobile-stats-cards',
    popover: {
      title: 'إحصائيات المتجر',
      description: 'تُظهر هذه البطاقات معلومات سريعة عن المنتجات والزيارات والطلبات.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#mobile-quick-actions',
    popover: {
      title: 'الإجراءات السريعة',
      description: 'استخدم هذه الاختصارات للوصول السريع: إضافة منتج، الطلبات، الإعدادات والأرباح.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#mobile-plan-card',
    popover: {
      title: 'باقتك الحالية',
      description: 'أدِر اشتراكك وقم بترقية ميزات متجرك من هذا القسم.',
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '#mobile-recent-orders',
    popover: {
      title: 'آخر الطلبات',
      description: 'شاهد أحدث الطلبات الواردة من عملائك وأدِرها بسهولة.',
      side: 'top',
      align: 'center',
    },
  },
];

/** Steps shown on desktop (hidden md:block layout) */
const DESKTOP_STEPS: DriveStep[] = [
  {
    element: '#desktop-stats-cards',
    popover: {
      title: 'إحصائيات المتجر',
      description: 'تُظهر هذه البطاقات معلومات سريعة عن المنتجات والزيارات والطلبات والأرباح.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#desktop-plan-card',
    popover: {
      title: 'باقتك الحالية',
      description: 'أدِر اشتراكك وقم بترقية ميزات متجرك من هذا القسم.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#desktop-revenue-card',
    popover: {
      title: 'نظرة عامة على الأداء',
      description: 'يمكنك تتبع إيرادات متجرك ونموه الأسبوعي من هذه البطاقة مباشرةً.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#desktop-recent-orders',
    popover: {
      title: 'آخر الطلبات',
      description: 'شاهد أحدث الطلبات الواردة من عملائك وأدِرها بسهولة.',
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '#desktop-url-card',
    popover: {
      title: 'رابط متجرك',
      description: 'شارك هذا الرابط مع عملائك ليتمكنوا من زيارة متجرك مباشرةً.',
      side: 'left',
      align: 'center',
    },
  },
  {
    element: '#desktop-quick-actions',
    popover: {
      title: 'الإجراءات السريعة',
      description: 'استخدم هذه الاختصارات للوصول السريع: إضافة منتج، الطلبات، الإعدادات والأرباح.',
      side: 'left',
      align: 'center',
    },
  },
];

/** Returns true when screen width >= 768px (Tailwind's md breakpoint) */
function isDesktop(): boolean {
  return typeof window !== 'undefined' && window.innerWidth >= 768;
}

/**
 * Creates and configures a Driver.js tour instance.
 * Automatically picks the correct step set based on screen size.
 */
export function createDashboardTour() {
  if (typeof window === 'undefined') return null;

  const isMobile = !isDesktop();
  const rawSteps = isMobile ? MOBILE_STEPS : DESKTOP_STEPS;

  // Only include steps for elements that currently exist and are visible
  const steps = rawSteps.filter((step) => {
    const el = document.querySelector(step.element as string);
    return el && window.getComputedStyle(el).display !== 'none';
  });

  const driverObj = driver({
    showProgress: false,
    animate: true,
    smoothScroll: true,
    allowClose: true,
    overlayColor: 'rgba(0, 0, 0, 0.65)',
    doneBtnText: 'إنهاء الجولة ✨',
    nextBtnText: 'التالي →',
    prevBtnText: '← السابق',
    steps: steps,
    onDestroyStarted: () => {
      // Driver.js doesn't have an explicit 'skip' button natively styled exactly as you had it,
      // but closing the tour triggers onDestroyStarted.
      if (!driverObj.hasNextStep() || confirm("هل أنت متأكد من تخطّي الجولة؟")) {
        driverObj.destroy();
        localStorage.setItem(TOUR_STORAGE_KEY, 'true');
      }
    },
  });

  return driverObj;
}

/** Returns true if the user has already seen the tour. */
export function isTourCompleted(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(TOUR_STORAGE_KEY) === 'true';
}

/** Remove tour completion flag (for a "Restart Tour" button). */
export function resetTour(): void {
  if (typeof window !== 'undefined') localStorage.removeItem(TOUR_STORAGE_KEY);
}
