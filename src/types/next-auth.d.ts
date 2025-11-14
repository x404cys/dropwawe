type UserRole = 'GUEST' | 'SUPPLIER' | 'DROPSHIPPER' | 'TRADER' | 'A';

declare module 'next-auth' {
  interface User {
    id: string;
    role: UserRole;
  }

  interface Session {
    user: {
      id: string;
      role: UserRole;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      storeSlug?: string | null;
      storeName?: string | null;
      shippingPrice?: number | null;
    };
  }

  interface JWT {
    id: string;
    role: UserRole;
    storeSlug?: string | null;
  }
}
