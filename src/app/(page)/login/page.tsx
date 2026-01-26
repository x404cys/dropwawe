'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FaGoogle } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const callbackUrl = 'https://dashboard.matager.store/Dashboard/create-store';

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn('google', {
      callbackUrl,
    });
    setIsLoading(false);
  };

  return (
    <div dir="rtl" className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-lg rounded-2xl border bg-white shadow-xl">
        <CardHeader className="items-center space-y-6 px-8 text-center md:px-12">
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-10 w-10 md:h-12 md:w-12">
              <Image
                src="/Logo-Matager/Matager-logo2.PNG"
                alt="Dropwave"
                fill
                className="object-contain"
              />
            </div>
          </div>  

          <CardTitle className="text-3xl font-extrabold text-gray-900 md:text-4xl">
            تسجيل الدخول
          </CardTitle>

          <p className="text-base text-gray-600">
            <span> مرحبًا بك في منصة متاجر</span>
            <br />
            <div className="items-center gap-3 text-center text-xs">
              <span> خطوة واحدة تفصلك عن النجاح في التجارة الإلكترونية</span>{' '}
            </div>{' '}
          </p>
        </CardHeader>

        <CardContent className="space-y-8 px-8 md:px-12">
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-3xl bg-sky-600 text-lg font-semibold text-white transition hover:bg-sky-800"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                جاري التحميل...
              </>
            ) : (
              <>
                <FaGoogle className="h-5 w-5" />
                تسجيل الدخول عبر Google
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-500">
                يمكنك اختيار دورك بعد التسجيل
              </span>
            </div>
          </div>

          <div className="grid items-center gap-3 text-center text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span>دخول آمن ومشفر</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span>إدارة سهلة للحساب</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center px-8 pb-10 text-center md:px-12">
          <p className="text-xs leading-relaxed text-gray-400">
            بالتسجيل، أنت توافق على شروط الخدمة
            <br />
            وسياسة الخصوصية
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
