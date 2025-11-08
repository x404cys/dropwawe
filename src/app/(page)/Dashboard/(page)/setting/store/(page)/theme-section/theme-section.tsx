'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';
import axios from 'axios';
import useSWR from 'swr';

type Theme = {
  id: 'NORMAL' | 'MODERN';
  name: string;
  description: string;
  image?: string;
  badge?: string;
};

const themes: Theme[] = [
  {
    id: 'MODERN',
    name: 'ثيم عصري',
    description: 'ألوان حديثة وتصميم جذاب للمتاجر الحديثة',
    image: '/img-theme/NORMAL-THEME.png',
    badge: 'شائع',
  },
  {
    id: 'NORMAL',
    name: 'ثيم كلاسيكي',
    description: 'تصميم بسيط وألوان هادئة',
    image: '/img-theme/MODREN-THEME.PNG',
  },
];
type ThemeProps = {
  theme: 'NORMAL' | 'MODREN';
};
export default function ThemeSection() {
  const [activeTheme, setActiveTheme] = useState<'NORMAL' | 'MODERN' | null>(null);
  const [loadingTheme, setLoadingTheme] = useState<'NORMAL' | 'MODERN' | null>(null);
  const { data } = useSWR<ThemeProps>(
    '/api/dashboard/setting/get-theme',
    (url: string | URL | Request) => fetch(url).then(res => res.json()),
    {
      revalidateOnFocus: true,
      refreshInterval: 1000,
      revalidateOnMount: true,
    }
  );
  const selectTheme = async (themeId: 'NORMAL' | 'MODERN') => {
    setLoadingTheme(themeId);
    try {
      const res = await axios.post(`/api/dashboard/setting/update/${themeId}`);
      if (res.status === 200) {
        setActiveTheme(themeId);
      }
    } catch (err) {
      console.error('حدث خطأ عند تحديث الثيم:', err);
    } finally {
      setLoadingTheme(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">اختر ثيم متجرك</h2>
        <p className="text-muted-foreground">
          حدد الثيم الذي يناسب متجرك وابدأ بيع منتجاتك بشكل احترافي
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span>الثيم الحالي</span>
        <span className="rounded-full bg-blue-200 px-3">
          {data?.theme === 'NORMAL' ? 'ثيم كلاسيكي' : 'ثيم عصري'}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {themes.map(theme => {
          const isActive = activeTheme === theme.id || data?.theme === theme.id;
          const isLoading = loadingTheme === theme.id;

          return (
            <div
              key={theme.id}
              className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
                isActive
                  ? 'border-primary ring-primary/30 shadow-lg ring-2'
                  : 'border-border hover:border-primary/50 hover:shadow-md'
              }`}
            >
              {theme.image && (
                <img
                  src={theme.image}
                  alt={theme.name}
                  className="h-60 w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              )}

              {theme.badge && (
                <span className="bg-primary absolute top-3 left-3 rounded-full px-3 py-1 text-xs text-white shadow-md">
                  {theme.badge}
                </span>
              )}

              <div className="space-y-4 p-5">
                <h3 className="text-lg font-semibold">{theme.name}</h3>
                <p className="text-muted-foreground text-sm">{theme.description}</p>

                <Button
                  variant={isActive ? 'secondary' : 'default'}
                  size="sm"
                  className="w-full"
                  onClick={() => selectTheme(theme.id)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    'جارٍ التحديث...'
                  ) : isActive ? (
                    <>
                      <Check className="ml-2 h-4 w-4" /> مفعل
                    </>
                  ) : (
                    <>
                      <Sparkles className="ml-2 h-4 w-4" /> اختر الثيم
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
