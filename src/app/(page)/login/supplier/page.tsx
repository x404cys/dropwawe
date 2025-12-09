'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { FaGoogle } from 'react-icons/fa';
import { Loader2, Store } from 'lucide-react';
import Logo from '@/components/utils/Logo';

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<string>('vendor');

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn('google', {
      callbackUrl: '/Dashboard/create-store/Supplier?type=SUPPLIER',
    });

    setIsLoading(false);
  };

  return (
    <div dir="rtl" className="flex items-center justify-center py-14">
      <Card className="w-full max-w-lg rounded-2xl border bg-white shadow-2xl shadow-gray-200/50">
        <CardHeader className="pt- max-h-xl -8 mt-4 px-8 md:px-12">
          <div className="mb-6 flex flex-col items-center justify-center gap-3">
            <Logo />
          </div>

          <CardTitle className="mb-2 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            تسجيل دخول الموردين
          </CardTitle>
          <p className="text-center text-lg text-gray-600"></p>
        </CardHeader>

        <CardContent className="px-8 pb-8 md:px-12">
          <div className="flex flex-col space-y-6">
            <Button
              onClick={handleGoogleSignIn}
              className="h-14 rounded-xl bg-gray-900 text-lg font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-gray-800 hover:shadow-lg active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري التحميل...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <FaGoogle className="h-5 w-5" />
                  تسجيل الدخول عبر Google
                </span>
              )}
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm font-medium text-gray-500">
                  يمكنك اختيار دورك بعد التسجيل
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>دخول آمن ومشفر</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span>إدارة سهلة للحساب</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-center px-8 pb-12 text-center md:px-12">
          <div className="space-y-4">
            <p className="text-xs text-gray-400">
              بالتسجيل، أنت توافق على شروط الخدمة وسياسة الخصوصية
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
