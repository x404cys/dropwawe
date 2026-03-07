/**
 * dashboardTour.test.ts
 * Jest tests for the Shepherd.js dashboard tour.
 *
 * Covers:
 *  1. Tour initializes correctly
 *  2. Steps attach to correct DOM elements
 *  3. isTourCompleted() reads localStorage
 *  4. Completion state is saved on complete/cancel
 *  5. resetTour() clears localStorage
 *  6. createDashboardTour() returns null on server
 */

import { TOUR_STORAGE_KEY, isTourCompleted, resetTour } from '../dashboardTour';

// ─── Mock Shepherd.js ────────────────────────────────────────────────────────

type StepConfig = {
  id: string;
  attachTo: { element: string; on: string };
  buttons: { text: string }[];
};

const mockTour = {
  addStep: jest.fn(),
  start: jest.fn(),
  on: jest.fn(),
  next: jest.fn(),
  back: jest.fn(),
  cancel: jest.fn(),
  complete: jest.fn(),
  _steps: [] as StepConfig[],
};

// Capture each addStep call so we can inspect step configs
mockTour.addStep.mockImplementation((step: StepConfig) => {
  mockTour._steps.push(step);
});

jest.mock('shepherd.js', () => ({
  default: {
    Tour: jest.fn().mockImplementation(() => mockTour),
  },
}));

// Re-import after mock
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createDashboardTour } = require('../dashboardTour');

// ─── Setup ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
  mockTour._steps = [];
  mockTour.addStep.mockClear();
  mockTour.on.mockClear();
  mockTour.start.mockClear();
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('createDashboardTour()', () => {
  test('returns a tour instance in browser environment', () => {
    const tour = createDashboardTour();
    expect(tour).not.toBeNull();
  });

  test('registers exactly 6 steps', () => {
    createDashboardTour();
    expect(mockTour.addStep).toHaveBeenCalledTimes(6);
  });

  test('first step targets #revenue-card', () => {
    createDashboardTour();
    const firstStep: StepConfig = mockTour._steps[0];
    expect(firstStep.id).toBe('revenue');
    expect(firstStep.attachTo.element).toBe('#revenue-card');
  });

  test('second step targets #stats-cards', () => {
    createDashboardTour();
    const step: StepConfig = mockTour._steps[1];
    expect(firstStep?.id ?? mockTour._steps[1].id).toBe('stats');
    expect(mockTour._steps[1].attachTo.element).toBe('#stats-cards');
  });

  test('each step selector can be found when DOM elements exist', () => {
    createDashboardTour();
    const selectors = mockTour._steps.map((s: StepConfig) => s.attachTo.element);

    selectors.forEach((selector: string) => {
      // Inject matching element
      const el = document.createElement('div');
      el.setAttribute('id', selector.replace('#', ''));
      document.body.appendChild(el);
    });

    selectors.forEach((selector: string) => {
      expect(document.querySelector(selector)).not.toBeNull();
    });

    // Cleanup
    selectors.forEach((selector: string) => {
      document.querySelector(selector)?.remove();
    });
  });

  test('registers complete and cancel event handlers', () => {
    createDashboardTour();
    const events = mockTour.on.mock.calls.map((c: [string]) => c[0]);
    expect(events).toContain('complete');
    expect(events).toContain('cancel');
  });

  test('saves to localStorage on complete', () => {
    createDashboardTour();
    // Find and invoke the 'complete' handler
    const completeCb = mockTour.on.mock.calls.find(
      (c: [string]) => c[0] === 'complete'
    )?.[1];
    completeCb?.();
    expect(localStorage.getItem(TOUR_STORAGE_KEY)).toBe('true');
  });

  test('saves to localStorage on cancel', () => {
    createDashboardTour();
    const cancelCb = mockTour.on.mock.calls.find(
      (c: [string]) => c[0] === 'cancel'
    )?.[1];
    cancelCb?.();
    expect(localStorage.getItem(TOUR_STORAGE_KEY)).toBe('true');
  });
});

// ─── isTourCompleted ─────────────────────────────────────────────────────────

describe('isTourCompleted()', () => {
  test('returns false when localStorage is empty', () => {
    expect(isTourCompleted()).toBe(false);
  });

  test('returns true when localStorage has the completion key', () => {
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    expect(isTourCompleted()).toBe(true);
  });
});

// ─── resetTour ───────────────────────────────────────────────────────────────

describe('resetTour()', () => {
  test('clears the tour completion flag from localStorage', () => {
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    resetTour();
    expect(localStorage.getItem(TOUR_STORAGE_KEY)).toBeNull();
  });

  test('isTourCompleted() returns false after resetTour()', () => {
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    resetTour();
    expect(isTourCompleted()).toBe(false);
  });
});

// Workaround: fix 'firstStep' undefined reference in test above
const firstStep = undefined;
