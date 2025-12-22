'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';
import axios from 'axios';
import useSWR, { mutate } from 'swr';

type ThemeId = 'NORMAL' | 'MODERN';

type Theme = {
  id: ThemeId;
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
    image: '/img-theme/MODREN-THEME.PNG',
    badge: 'شائع',
  },
  {
    id: 'NORMAL',
    name: 'ثيم كلاسيكي',
    description: 'تصميم بسيط وألوان هادئة',
    image: '/img-theme/NORMAL-THEME.png',
  },
];

type ThemeResponse = {
  theme: ThemeId;
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ThemeSection() {
  const [loadingTheme, setLoadingTheme] = useState<ThemeId | null>(null);

  const { data, isLoading } = useSWR<ThemeResponse>('/api/dashboard/setting/get-theme', fetcher, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
  });

  const selectTheme = async (themeId: ThemeId) => {
    setLoadingTheme(themeId);

    try {
      await axios.post('/api/dashboard/setting/update', {
        theme: themeId,
      });

      await mutate('/api/dashboard/setting/get-theme');
    } catch (error) {
      console.error('خطأ أثناء تحديث الثيم:', error);
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

      {/* Current Theme */}
      <div className="flex items-center gap-4">
        <span>الثيم الحالي:</span>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium">
          {data?.theme === 'NORMAL' ? 'ثيم كلاسيكي' : 'ثيم عصري'}
        </span>
      </div>

      {/* Themes */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {themes.map(theme => {
          const isActive = data?.theme === theme.id;
          const isLoadingBtn = loadingTheme === theme.id;

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
                <img src={theme.image} alt={theme.name} className="h-60 w-full object-cover" />
              )}

              {theme.badge && (
                <span className="bg-primary absolute top-3 left-3 rounded-full px-3 py-1 text-xs text-white">
                  {theme.badge}
                </span>
              )}

              <div className="space-y-4 p-5">
                <h3 className="text-lg font-semibold">{theme.name}</h3>
                <p className="text-muted-foreground text-sm">{theme.description}</p>

                <Button
                  className="w-full"
                  size="sm"
                  variant={isActive ? 'secondary' : 'default'}
                  disabled={isLoadingBtn || isLoading}
                  onClick={() => selectTheme(theme.id)}
                >
                  {isLoadingBtn ? (
                    'جارٍ التحديث...'
                  ) : isActive ? (
                    <>
                      <Check className="ml-2 h-4 w-4" />
                      مفعل
                    </>
                  ) : (
                    <>
                      <Sparkles className="ml-2 h-4 w-4" />
                      اختر الثيم
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
