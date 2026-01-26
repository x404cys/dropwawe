'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Link as LinkIcon,
  Store,
  FileText,
  Phone,
  Truck,
  Facebook,
  Instagram,
  Send,
  Save,
  Settings,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { StoreProps } from '@/types/store/StoreType';
import { useDashboardData } from '../Dashboard/context/useDashboardData';
type ServerErrorDetail = {
  field: string;
  message: string;
};

type ServerErrorResponse = {
  error: string;
  details?: ServerErrorDetail[];
  field?: string;
};
export default function StoreSetupPage() {
  const { data: session } = useSession();
  const { data } = useDashboardData(session?.user?.id);
  const router = useRouter();
  const [store, setStore] = useState<StoreProps>();
  const [storeSlug, setStoreSlug] = useState('');
  const [storeName, setStoreName] = useState('');
  const [shippingPrice, setShippingPrice] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [facebookLink, setFacebook] = useState('');
  const [instaLink, setInstagram] = useState('');
  const [telegram, setTelegram] = useState('');
  const [loading, setLoading] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await axios.get(`/api/storev2/info4setting/${session?.user?.id}`);
        const storeData: StoreProps = res.data;

        setStore(storeData);
        setStoreSlug(storeData.subLink ?? '');
        setStoreName(storeData.name ?? '');
        setShippingPrice(storeData.shippingPrice?.toString() ?? '');
        setDescription(storeData.description ?? '');
        setPhone(storeData.phone ?? '');
        setFacebook(storeData.facebookLink ?? '');
        setInstagram(storeData.instaLink ?? '');
        setTelegram(storeData.telegram ?? '');
      } catch (err) {
        console.error('Error fetching store info:', err);
      }
    };

    fetchInfo();
  }, [data?.user?.id]);

  const handleSubmit = async () => {
    if (!storeSlug || !storeName || !description || !shippingPrice || !phone) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setLoading(true);
      setFieldErrors({});

      const payload = {
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
      };

      const res = await fetch('/api/storev2/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data: ServerErrorResponse = await res.json();

      if (!res.ok) {
        if (data.details) {
          const errors: { [key: string]: string } = {};
          data.details.forEach(err => {
            errors[err.field] = err.message;
          });
          setFieldErrors(errors);
        } else if (data.field) {
          setFieldErrors({ [data.field]: data.error });
        } else {
          toast.error(data.error || 'حدث خطأ في الحفظ');
        }
        return;
      }

      toast.success('تم الحفظ بنجاح ✨');
      router.back();
    } catch (err) {
      toast.error('حدث خطأ في الحفظ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="mx-auto max-w-2xl space-y-10 py-10">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
          <div className="rounded-lg border bg-gray-200 p-1.5">
            <Settings className="h-7 w-7 text-gray-400" />
          </div>
          إعدادات المتجر
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          قم بتحديث بيانات متجرك لتظهر بشكل احترافي للزوار.
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="store-link" className="text-sm font-medium text-gray-700">
            رابط المتجر
          </Label>
          <div className="flex w-full items-center">
            <div className="flex h-10 items-center justify-center rounded-r-md border border-l-0 border-gray-200 bg-gray-50 px-3 text-sm text-gray-500 select-none">
              {storeSlug}.matager.store
            </div>
            <div className="relative flex-grow">
              <Input
                id="store-link"
                value={storeSlug}
                onChange={e => {
                  const value = e.target.value.replace(/[^a-z0-9]/g, '');
                  setStoreSlug(value);
                }}
                placeholder="store1"
                className="h-10 rounded-r-none pl-10"
              />

              <LinkIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          {fieldErrors.subLink && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.subLink}</p>
          )}
          <p className="text-xs text-gray-500">سيظهر في رابط متجرك.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">اسم المتجر</label>
          <div className="relative">
            <Input
              value={storeName}
              onChange={e => setStoreName(e.target.value)}
              placeholder="اسم المتجر"
            />
            <Store className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
          {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">الوصف</label>
          <div className="relative">
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="صف متجرك للعملاء..."
            />
            <FileText className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
          </div>
          {fieldErrors.description && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.description}</p>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">رقم الهاتف</label>
            <div className="relative">
              <Input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="0770xxxxxxx"
              />
              <Phone className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>
            {fieldErrors.phone && <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">سعر التوصيل</label>
            <div className="relative">
              <Input
                value={shippingPrice}
                onChange={e => setShippingPrice(e.target.value)}
                placeholder="5000 د.ع"
              />
              <Truck className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>
            {fieldErrors.shippingPrice && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.shippingPrice}</p>
            )}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              label: 'Facebook',
              value: facebookLink,
              setValue: setFacebook,
              icon: Facebook,
              field: 'facebookLink',
              placeholder: 'رابط الفيسبوك',
            },
            {
              label: 'Instagram',
              value: instaLink,
              setValue: setInstagram,
              icon: Instagram,
              field: 'instaLink',
              placeholder: 'رابط الانستغرام',
            },
            {
              label: 'Telegram',
              value: telegram,
              setValue: setTelegram,
              icon: Send,
              field: 'telegram',
              placeholder: 'رابط التليجرام',
            },
          ].map(({ label, value, setValue, icon: Icon, field, placeholder }) => (
            <div key={field} className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{label}</label>
              <div className="relative">
                <Input
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  placeholder={placeholder}
                />
                <Icon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-500" />
              </div>
              {fieldErrors[field] && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors[field]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button disabled={loading} onClick={handleSubmit} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {loading ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
        </Button>
      </div>
    </div>
  );
}
