'use client';
import { useEffect } from 'react';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { 
  Zap, Truck, Globe
  } from "lucide-react";
const fbEvent = (name: string, options = {}) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', name, options);
  }
};
export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const callbackUrl = 'https://dashboard.matager.store/create-store';
  useEffect(() => {
    fbEvent('ViewContent', {
      content_name: 'Sign In Page',
    });
  }, []);
  const handleGoogleSignIn = async () => {
    fbEvent('InitiateCheckout', {
      content_name: 'Google Sign In',
    });
    setIsLoading(true);
    await signIn('google', {
      callbackUrl,
    });
    setIsLoading(false);
  };

  return (
     <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6" dir="rtl">
        <div className="w-full max-w-sm space-y-8 text-center">
           <div className="space-y-3">
            <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto">
              <img src={'./Logo-Matager/Matager-logo1.PNG'} alt="ماتاجر" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">ماتاجر</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              أنشئ متجرك الإلكتروني في دقائق وابدأ البيع فوراً
            </p>
          </div>

           <div className="space-y-3">
            {[
              { icon: Zap, text: "إعداد سريع بـ 3 خطوات فقط" },
              { icon: Globe, text: "نطاق فرعي مجاني .matager.store" },
              { icon: Truck, text: "ربط مع شركات التوصيل" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <f.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs font-medium text-foreground">{f.text}</span>
              </div>
            ))}
          </div>

           <div className="space-y-3">
            <Button
              onClick={handleGoogleSignIn}
              className="w-full h-12 cursor-pointer rounded-xl text-sm font-bold gap-3"
              variant="outline"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              المتابعة عبر Google
            </Button>
            <p className="text-[10px] text-muted-foreground">
              بالمتابعة، أنت توافق على <span className="text-primary">شروط الاستخدام</span> و <span className="text-primary">سياسة الخصوصية</span>
            </p>
          </div>
        </div>
      </div>
  );
}
