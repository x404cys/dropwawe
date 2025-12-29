'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserProps } from '@/types/Products';
import Loader from '@/components/Loader';

import StoreNavBarV1 from './_components/NavBar/StoreNavBarV1';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(true);

  const getSubdomain = () => {
    if (typeof window === 'undefined') return '22122121';
    const host = window.location.hostname;
    const parts = host.split('.');
    if (parts.length > 2) return parts[0];
    return '22122121';
  };

  const slug = getSubdomain();

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get<UserProps[]>(`/api/users/get/${slug}`);
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div dir="rtl" className="min-h-screen py-4">
      {children}

      <br className="py-20" />
    </div>
  );
}
