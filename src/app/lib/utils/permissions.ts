export type UserRole = 'GUEST' | 'SUPPLIER' | 'DROPSHIPPER' | 'TRADER' | 'DEFAULT';

export function canAccessStoreLink(role?: UserRole): boolean {
  if (!role) return false;
  return role !== 'GUEST';
}

export function canManageProducts(role?: UserRole): boolean {
  return role === 'SUPPLIER' || role === 'TRADER' || role === 'DROPSHIPPER';
}

export function canViewDashboard(role?: UserRole): boolean {
  return role !== 'GUEST' && role !== 'DEFAULT';
}
