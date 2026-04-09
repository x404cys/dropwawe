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
  readOnly?: boolean;
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
  readOnly = false,
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
    if (readOnly) return;
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
      <div className="bg-primary/5 border-primary/15 flex items-center gap-3 rounded-2xl border p-4">
        <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl">
          <Truck className="text-primary h-5 w-5" />
        </div>
        <div>
          <p className="text-foreground font-bold">
            {t.store?.linkAlwaseetAccount || 'ربط حساب شركة الوسيط'}
          </p>
          <p className="text-muted-foreground mt-0.5 text-[11px]">
            {t.store?.alwaseetDesc || 'سجّل دخولك للربط مع منصة الوسيط للتوصيل'}
          </p>
        </div>
        {linked && (
          <span className="mr-auto flex-shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
            مرتبط{' '}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
          <User className="h-3 w-3" />
          {t.store?.alwaseetUsernameLabel || 'اسم المستخدم'}
        </label>
        <div className="relative">
          <Input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder={t.store?.alwaseetUsernamePlaceholder || 'اسم المستخدم في تطبيق الوسيط'}
            className="h-11 pl-10"
            disabled={readOnly}
          />
          <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
          <MdPassword className="h-3 w-3" />
          {t.store?.alwaseetPasswordLabel || 'كلمة السر'}
        </label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-11 pr-10 pl-10"
            disabled={readOnly}
          />
          <MdPassword className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            disabled={readOnly}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <Button
        onClick={login}
        disabled={loading || !username || !password || readOnly}
        className="h-12 w-full rounded-xl text-base font-bold transition-all active:scale-[0.98]"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            {t.store?.alwaseetLoggingIn || 'جاري تسجيل الدخول...'}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            {t.store?.alwaseetLoginBtn || 'ربط الحساب'}
          </span>
        )}
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3 py-1">
        <div className="bg-border/60 h-px flex-1" />
        <span className="text-muted-foreground text-xs font-medium">{(t as any).or || 'أو'}</span>
        <div className="bg-border/60 h-px flex-1" />
      </div>
    </div>
  );
}
