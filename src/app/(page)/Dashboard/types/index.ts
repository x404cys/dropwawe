/**
 * Dashboard shared types
 * Centralized type definitions to eliminate duplication across dashboard components
 */

export interface Notification {
  id: string;
  type?: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  orderId: string;
}

export interface DashboardNavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  show?: string;
  plans?: string[];
  roles?: string[];
}

export type ProfitResponse = {
  totalAmount: number;
};
