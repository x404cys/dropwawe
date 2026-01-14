'use client';

import { Input } from '@/components/ui/input';
import axios, { AxiosError } from 'axios';
import { Phone, Truck, User } from 'lucide-react';
import { MdPassword } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ShippingSectionProps {
  phone: string;
  shippingPrice: string;
  fieldErrors: { [key: string]: string };
  onPhoneChange: (value: string) => void;
  onShippingPriceChange: (value: string) => void;
}
interface MerchantLoginResponse {
  status: boolean;
  msg?: string;
  login?: {
    token: string;
    tokenExp: string;
  };
}

export default function ShippingSection({
  phone,
  shippingPrice,
  fieldErrors,
  onPhoneChange,
  onShippingPriceChange,
}: ShippingSectionProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch('/api/delivery/al-waseet/merchant/get-info');
        const data = await res.json();

        if (data?.username) {
          setUsername(data.username);
        }
      } catch (err) {
        console.log('Fetch Error:', err);
      }
    };

    getData();
  }, []);

  const login = async () => {
    try {
      const res = await axios.post<MerchantLoginResponse>(
        '/api/delivery/al-waseet/merchant/login',
        {
          username,
          password,
        }
      );

      if (res.data.status) {
        toast.success(res.data.msg || 'تم تسجيل الدخول بنجاح');
        return;
      }

      toast.error(res.data.msg || 'حدث خطأ');
    } catch (error) {
      const err = error as AxiosError<MerchantLoginResponse>;

      if (err.response?.data) {
        toast.error(err.response.data.msg || 'حدث خطأ في الإدخال');
      } else {
        toast.error('خطأ بالشبكة أو غير معروف');
      }
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <span className="flex items-center">
        <span className="h-px flex-1 bg-linear-to-r from-transparent to-gray-300" />
        <span className="shrink-0 px-4 text-gray-900">التوصيل الذاتي</span>
        <span className="h-px flex-1 bg-linear-to-l from-transparent to-gray-300" />
      </span>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">رقم الهاتف</label>
        <div className="relative">
          <Input
            value={phone}
            onChange={e => onPhoneChange(e.target.value)}
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
            onChange={e => onShippingPriceChange(e.target.value)}
            placeholder="5000 د.ع"
          />
          <Truck className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>
        {fieldErrors.shippingPrice && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.shippingPrice}</p>
        )}
      </div>

      <span className="flex items-center">
        <span className="h-px flex-1 bg-linear-to-r from-transparent to-gray-300" />
        <span className="shrink-0 px-4 text-gray-900">الربط مع شركة الوسيط</span>
        <span className="h-px flex-1 bg-linear-to-l from-transparent to-gray-300" />
      </span>

      <Dialog>
        <DialogTrigger dir="rtl" asChild>
          <Button
            variant={'outline'}
            className="w-full cursor-pointer rounded-md border border-black"
          >
            اضغط هنا لـ ربط حساب الوسيط
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right">تسجيل الدخول إلى شركة الوسيط</DialogTitle>
          </DialogHeader>

          <form
            dir="rtl"
            onSubmit={e => {
              e.preventDefault();
              login();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">اسم المستخدم</label>
              <div className="relative">
                <Input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="ادخل اسم المستخدم المختار في تطبيق الوسيط"
                />
                <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">كلمة السر</label>
              <div className="relative">
                <Input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="ادخل كلمة السر المختارة في تطبيق الوسيط"
                />
                <MdPassword className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <Button
              variant={'outline'}
              type="submit"
              className="w-full rounded-lg bg-black py-2 text-white hover:bg-gray-900"
            >
              تسجيل الدخول
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <span className="flex items-center">
        <span className="h-px flex-1 bg-linear-to-r from-transparent to-gray-300" />
        <span className="shrink-0 px-4 text-gray-900">-</span>
        <span className="h-px flex-1 bg-linear-to-l from-transparent to-gray-300" />
      </span>
    </div>
  );
}
