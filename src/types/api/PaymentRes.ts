export type PaymentResult = Readonly<{
  payment: PaymentInfo;
  userSubscription: UserSubscriptionInfo;
}>;

export type PaymentInfo = Readonly<{
  id: string;
  cartId: string;
  tranRef: string;
  amount: number;
  currency: string;
  status: string;
  respCode: string;
  respMessage: string;
  token: string;
  customerEmail: string;
  signature: string;
  createdAt: string;
}>;

export type UserSubscriptionInfo = Readonly<{
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  canceledAt: string | null;
  limitProducts: number;
  plan: SubscriptionPlanInfo;
}>;

export type SubscriptionPlanInfo = Readonly<{
  id: string;
  name: string;
  type: string;
  price: number;
  durationDays: number;
  maxProducts: number;
  maxTemplates: number;
  templateCategory: string;
  maxStores: number;
  maxSuppliers: number;
  features: string[];
  createdAt: string;
}>;
