export enum TypePlan {
  NORMAL = 'NORMAL',
  MODERN = 'MODERN',
  PENDINGROFESSIONAL = 'PENDINGROFESSIONAL',
}

export type PlanType =
  | 'trader-basic'
  | 'trader-pro'
  | 'drop-basics'
  | 'drop-pro'
  | 'multi-basics'
  | 'multi-pro'
  | 'multi-drop'
  | 'multi-trader'
  | 'free-trial'
  | 'ramadan-plan';

export interface Plan {
  id: string;
  name: string;
  type: PlanType;

  price: number;
  durationDays: number;

  maxProducts: number | null;
  maxTemplates: number;
  templateCategory: string;

  maxStores: number | null;
  maxSuppliers: number | null;

  features: string[] | null;

  createdAt: string;

  subscriptions: {
    id: string;
  }[];
}
