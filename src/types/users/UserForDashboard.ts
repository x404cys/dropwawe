import { SubscriptionType } from './User';

export type SubscriptionPlan = {
  name?: string;
  expiryDate?: string;
  status?: 'active' | 'expired' | 'pending';
  renewalDate?: string;
};

export type Store = {
  id: string;
  name: string;
  subLink: string;
  shippingPrice?: number | null;
  shippingType?: string | null;
  hasReturnPolicy?: string | null;
  image?: string | null;
  Header?: string | null;
  facebookLink?: string | null;
  instaLink?: string | null;
  phone?: string | null;
  active: boolean;
  methodPayment?: string | null;
  telegram?: string | null;
  description?: string | null;
  createdAt: string;
  facebookPixel?: string | null;
  instagramPixel?: string | null;
  tiktokPixel?: string | null;
  googlePixel?: string | null;
  theme?: 'MODERN' | 'NORMAL' | string;
};

export type UserStore = {
  id: string;
  storeId: string;
  userId: string;
  role: 'OWNER' | string;
  isOwner: boolean;
  createdAt: string;
  store: Store;
};

export type User = {
  id?: string;
  image?: string;
  storeName?: string;
  email: string;
  storeSlug?: string;
  facebookLink?: string;
  instaLink?: string;
  phone?: string;
  telegram?: string;
  name?: string;
  description?: string;
  shippingPrice?: number;
  role?: 'GUEST' | 'SUPPLIER' | 'DROPSHIPPER' | 'TRADER' | 'ADMIN' | string;
  stores?: UserStore[];
  subscriptionPlan?: SubscriptionPlan;
  UserSubscription?: SubscriptionPlanForDashboard;
  createdAt?: string;
  lastLogin?: string;
  isActive?: boolean;
  subscriptionHistory?: SubscriptionHistory[];
};
type SubscriptionHistoryPlan = {
  id: string;
  name: string;
  type: string;
  price: number;
  durationDays: number;
  maxProducts: number | null;
  maxTemplates: number | null;
  templateCategory: string | null;
  maxStores: number | null;
  maxSuppliers: number | null;
  features: string | null;
  description: string;
  createdAt: string;
};

type SubscriptionHistorySubscription = {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  canceledAt: string | null;
  autoRenew: boolean;
};

export type SubscriptionHistory = {
  id: string;
  userId: string;
  planId: string;
  subscriptionId: string;
  startDate: string;
  endDate: string;
  price: number;
  paymentId: string | null;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELED';
  createdAt: string;

  plan: SubscriptionHistoryPlan;
  subscription: SubscriptionHistorySubscription;
};
export type SubscriptionPlanForDashboard = {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  canceledAt: null;
  autoRenew: boolean;
  plan: SubscriptionType;
};
export type UserDialogState = {
  isOpen: boolean;
  type: 'details' | 'renew' | 'whatsapp' | 'delete' | null;
  user: User | null;
};
export type UsersResponse = {
  users: User[];
  totalUsers: number;
  totalUsersHaveStores: number;
};
