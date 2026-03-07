'use client';

import { Input } from '@/components/ui/input';
import axios, { AxiosError } from 'axios';
import { User, Eye, EyeOff, Truck, Link2 } from 'lucide-react';
import { MdPassword } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../../../../../context/LanguageContext';

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
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [linked, setLinked] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch('/api/delivery/al-waseet/merchant/get-info');
        const data = await res.json();
        if (data?.username) {
          setUsername(data.username);
          setLinked(true);
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
        toast.success(res.data.msg || t.store?.alwaseetLoginSuccess || 'تم تسجيل الدخول بنجاح');
        setLinked(true);
        return;
      }

      toast.error(res.data.msg || t.error || 'خطأ');
    } catch (error) {
      const err = error as AxiosError<MerchantLoginResponse>;
      toast.error(err.response?.data?.msg || t.store?.networkError || 'خطأ بالشبكة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/15">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
          <Truck className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">
            {t.store?.linkAlwaseetAccount || 'ربط حساب شركة الوسيط'}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {t.store?.alwaseetDesc || 'سجّل دخولك للربط مع منصة الوسيط للتوصيل'}
          </p>
        </div>
        {linked && (
          <span className="mr-auto flex-shrink-0 text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            مرتبط           </span>
        )}
      </div>

       <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
          <User className="w-3 h-3" />
          {t.store?.alwaseetUsernameLabel || 'اسم المستخدم'}
        </label>
        <div className="relative">
          <Input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder={t.store?.alwaseetUsernamePlaceholder || 'اسم المستخدم في تطبيق الوسيط'}
            className="h-11 text-sm pl-10"
          />
          <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

       <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
          <MdPassword className="w-3 h-3" />
          {t.store?.alwaseetPasswordLabel || 'كلمة السر'}
        </label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-11 text-sm pl-10 pr-10"
          />
          <MdPassword className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <Button
        onClick={login}
        disabled={loading || !username || !password}
        className="w-full h-12 rounded-xl font-bold text-base active:scale-[0.98] transition-all"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {t.store?.alwaseetLoggingIn || 'جاري تسجيل الدخول...'}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            {t.store?.alwaseetLoginBtn || 'ربط الحساب'}
          </span>
        )}
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-border/60" />
        <span className="text-xs font-medium text-muted-foreground">{(t as any).or || 'أو'}</span>
        <div className="flex-1 h-px bg-border/60" />
      </div>
    </div>
  );
}
