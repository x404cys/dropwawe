'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserProps } from '@/types/Products';
import Loader from '@/components/Loader';
import StoreNavbar from '../(page)/s/[slug]/_components/StoreNavbar';
import StoreBottomNav from '../(page)/s/[slug]/_components/StoreBottomNav';
import Footer from './_components/Footer';
import StoreNavBarV1 from './_components/NavBar/StoreNavBarV1';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(true);

  const getSubdomain = () => {
    if (typeof window === 'undefined') return 'default';
    const host = window.location.hostname;
    const parts = host.split('.');
    if (parts.length > 2) return parts[0];
    return 'default';
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
      <StoreNavBarV1 slug={slug} />

      {children}

      <br className="py-20" />
    </div>
  );
}
