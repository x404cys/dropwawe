'use client';

import { useEffect, useState } from 'react';
 import axios from 'axios';
import useSWR from 'swr';
import type { StoreProps } from '@/types/store/StoreType';
import { useStoreProvider } from '@/app/(page)/Dashboard/context/StoreContext';

const fetcher = (url: string) => axios.get(url).then(res => res.data.store);

export function useStoreSettings() {
  const { currentStore, setCurrentStore } = useStoreProvider();
  const subLink = currentStore?.subLink;

  const { data: store, isLoading, mutate } = useSWR<StoreProps>(
    subLink ? `/api/dashboard/store/get-store-info?sublink=${encodeURIComponent(subLink)}` : null,
    fetcher
  );

  const [storeSlug, setStoreSlug] = useState('');
  const [storeName, setStoreName] = useState('');
  const [shippingPrice, setShippingPrice] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [facebookLink, setFacebook] = useState('');
  const [instaLink, setInstagram] = useState('');
  const [telegram, setTelegram] = useState('');
  const [facebookPixel, setFacebookPixel] = useState<string | null>(null);
  const [googlePixel, setGooglePixel] = useState<string | null>(null);
  const [snapPixel, setSnapPixel] = useState<string | null>(null);
  const [tiktokPixel, setTiktokPixel] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [loading, setSaving] = useState(false);

  useEffect(() => {
    if (!store) return;
    setStoreSlug(store.subLink ?? '');
    setStoreName(store.name ?? '');
    setShippingPrice(store.shippingPrice?.toString() ?? '');
    setDescription(store.description ?? '');
    setPhone(store.phone ?? '');
    setFacebook(store.facebookLink ?? '');
    setInstagram(store.instaLink ?? '');
    setTelegram(store.telegram ?? '');
    setFacebookPixel(store.facebookPixel ?? '');
    setGooglePixel(store.googlePixel ?? '');
    setTiktokPixel(store.tiktokPixel ?? '');
  }, [store]);

  const save = async () => {
    if (!storeSlug || !storeName || !description || !shippingPrice || !phone) {
      return { ok: false, errors: {}, message: 'يرجى ملء جميع الحقول المطلوبة' };
    }
    try {
      setSaving(true);
      setFieldErrors({});
      const payload = {
        storeId: currentStore?.id,
        subLink: storeSlug,
        name: storeName,
        description,
        shippingPrice,
        phone,
        facebookLink,
        instaLink,
        telegram,
        shippingType: 'default',
        hasReturnPolicy: '__',
        active: true,
        facebookPixel,
        googlePixel,
        tiktokPixel,
      };
      const res = await fetch('/api/storev2/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        const errors: { [key: string]: string } = {};
        if (data.details) data.details.forEach((e: { field: string; message: string }) => { errors[e.field] = e.message; });
        else if (data.field) errors[data.field] = data.error;
        setFieldErrors(errors);
        return { ok: false, errors, message: data.error || 'حدث خطأ في الحفظ' };
      }
      await mutate();
      if (store) setCurrentStore(store);
      return { ok: true, errors: {}, message: '' };
    } catch {
      return { ok: false, errors: {}, message: 'حدث خطأ في الحفظ' };
    } finally {
      setSaving(false);
    }
  };

  return {
    store, isLoading, mutate,
    storeSlug, setStoreSlug,
    storeName, setStoreName,
    shippingPrice, setShippingPrice,
    description, setDescription,
    phone, setPhone,
    facebookLink, setFacebook,
    instaLink, setInstagram,
    telegram, setTelegram,
    facebookPixel, setFacebookPixel,
    googlePixel, setGooglePixel,
    snapPixel, setSnapPixel,
    tiktokPixel, setTiktokPixel,
    fieldErrors, loading,
    save,
  };
}
