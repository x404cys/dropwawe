import { StoreProps } from '../store/StoreType';

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
  role?: 'GUEST' | 'SUPPLIER' | 'DROPSHIPPER' | 'TRADER' | 'A';
  Store?: StoreProps[];
  subscriptionPlan?: SubscriptionPlan;
};

export type UsersResponse = {
  users: User[];
  totalUsers: number;
  totalUsersHaveStores: number;
};

export interface SubscriptionPlan {
  id: string;
  planName: string;
  price: number;
  description: string;
  remainingDays: number;
  maxProducts?: number | null;
  maxTemplates?: number | null;
  templateCategory?: string | null;
  maxStores?: number | null;
  maxSuppliers?: number | null;
  features?: string | null;
  createdAt: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  canceledAt?: string | null;
  limitProducts?: number | null;
  plan: SubscriptionPlan;
}
export type SubscriptionType = {
  id: string;
  name: string;
  type: string;
  price: number;
  durationDays: number;
  description: string;
  maxProducts: number;
  maxTemplates: number;
  templateCategory: string;
  maxStores: number;
  maxSuppliers: number;
  features: string[];
  createdAt: string;
};

export type Subscription = {
  id: string;
  planName: string;
  startDate: string;
  type: string;
  endDate: string;
  remainingDays: number;
  detailsSubscription: SubscriptionType;
};

export type SubscriptionResponse = {
  isActive: boolean;
  subscription: Subscription;
  type: string;
};
