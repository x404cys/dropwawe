export const VISIT_PAGE_TYPES = [
  'LANDING',
  'STORE_HOME',
  'PRODUCT',
  'CHECKOUT',
  'ORDER_SUCCESS',
  'PAYMENT_REDIRECT',
] as const;

export type VisitPageType = (typeof VISIT_PAGE_TYPES)[number];

export const VISIT_ENTITY_TYPES = ['STORE', 'PRODUCT', 'ORDER'] as const;

export type VisitEntityType = (typeof VISIT_ENTITY_TYPES)[number];

const VISIT_PAGE_TYPE_SET = new Set<string>(VISIT_PAGE_TYPES);
const VISIT_ENTITY_TYPE_SET = new Set<string>(VISIT_ENTITY_TYPES);

export function isVisitPageType(value: unknown): value is VisitPageType {
  return typeof value === 'string' && VISIT_PAGE_TYPE_SET.has(value);
}

export function isVisitEntityType(value: unknown): value is VisitEntityType {
  return typeof value === 'string' && VISIT_ENTITY_TYPE_SET.has(value);
}

export function formatTrackedOrderName(orderId: string) {
  return `#${orderId.slice(-6).toUpperCase()}`;
}
