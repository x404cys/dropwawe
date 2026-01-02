'use client';

import { useState } from 'react';

import { UserProps } from '@/types/Products';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(true);

  const getSubdomain = () => {
    if (typeof window === 'undefined') return 'abdulrqhman';
    const host = window.location.hostname;
    const parts = host.split('.');
    if (parts.length > 2) return parts[0];
    return 'abdulrqhman';
  };

  return <section className="md:mx-40">{children}</section>;
}
