'use client';

import { Input } from '@/components/ui/input';
import axios, { AxiosError } from 'axios';
import { User } from 'lucide-react';
import { MdPassword } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
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

export default function CShippingSection({
  phone,
  shippingPrice,
  fieldErrors,
  onPhoneChange,
  onShippingPriceChange,
}: ShippingSectionProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const res = await axios.post<MerchantLoginResponse>(
        '/api/delivery/al-waseet/merchant/login',
        { username, password }
      );

      if (res.data.status) {
        toast.success(res.data.msg || 'تم تسجيل الدخول بنجاح');
        return;
      }

      toast.error(res.data.msg || 'حدث خطأ');
    } catch (error) {
      const err = error as AxiosError<MerchantLoginResponse>;
      toast.error(err.response?.data?.msg || 'خطأ بالشبكة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="space-y-6 rounded-lg border p-4">
      <h3 className="text-sm font-semibold text-gray-800">ربط حساب شركة الوسيط</h3>

      <div className="space-y-2">
        <label className="text-sm text-gray-700">اسم المستخدم</label>
        <div className="relative">
          <Input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="اسم المستخدم في تطبيق الوسيط"
          />
          <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-700">كلمة السر</label>
        <div className="relative">
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="كلمة السر"
          />
          <MdPassword className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <Button
        onClick={login}
        disabled={loading}
        className="w-full bg-black text-white hover:bg-gray-900"
      >
        {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
      </Button>

      <span className="flex items-center pt-2">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300" />
        <span className="px-3 text-xs text-gray-500">أو</span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300" />
      </span>
    </div>
  );
}
