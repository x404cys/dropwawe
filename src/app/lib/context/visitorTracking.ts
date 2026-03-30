const VISITOR_ID_STORAGE_KEY = 'visitorId';
const VISIT_SESSION_PREFIX = 'visit';

function createVisitorId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getOrCreateVisitorId() {
  if (typeof window === 'undefined') return null;

  const existingVisitorId = window.localStorage.getItem(VISITOR_ID_STORAGE_KEY);
  if (existingVisitorId) return existingVisitorId;

  const nextVisitorId = createVisitorId();
  window.localStorage.setItem(VISITOR_ID_STORAGE_KEY, nextVisitorId);

  return nextVisitorId;
}

function getSessionVisitKey(dedupeKey?: string) {
  if (!dedupeKey) return null;

  return `${VISIT_SESSION_PREFIX}:${dedupeKey}`;
}

export async function trackVisitorVisit({
  path,
  dedupeKey,
  endpoint = '/api/visit',
}: {
  path: string;
  dedupeKey?: string;
  endpoint?: string;
}) {
  if (typeof window === 'undefined' || !path) return;

  const visitorId = getOrCreateVisitorId();
  if (!visitorId) return;

  const sessionVisitKey = getSessionVisitKey(dedupeKey);

  if (sessionVisitKey && window.sessionStorage.getItem(sessionVisitKey)) {
    return;
  }

  if (sessionVisitKey) {
    window.sessionStorage.setItem(sessionVisitKey, '1');
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId,
        path,
        referrer: document.referrer || null,
      }),
      keepalive: true,
    });

    if (!response.ok) {
      throw new Error(`Visit tracking failed with status ${response.status}`);
    }
  } catch {
    if (sessionVisitKey) {
      window.sessionStorage.removeItem(sessionVisitKey);
    }
  }
}
