import { UserRole } from '@/types/next-auth';

export const planRoleMap: Record<string, UserRole> = {
  'trader-basic': 'TRADER',
  'trader-pro': 'TRADER',

  'drop-basics': 'DROPSHIPPER',
  'drop-pro': 'DROPSHIPPER',

  supplier: 'SUPPLIER',
};
