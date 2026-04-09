'use client';

import { useState } from 'react';
import { Check, Eye, Palette, Sparkles, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import { PlanType } from '@/types/plans/Plans';
import { useSubscriptions } from '@/app/(page)/Dashboard/context/useSubscription';
import { useLanguage } from '../../../../../context/LanguageContext';

type ThemeId = 'NORMAL' | 'MODERN' | 'RAMADAN';

interface Template {
  id: ThemeId;
  name: string;
  description: string;
  category: 'مجاني' | 'مميز';
  colors: string[];
  features: string[];
  popular?: boolean;
  allowedPlans: PlanType[];
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ThemeSection() {
  const { t } = useLanguage();
  const { userPlanType } = useSubscriptions();
  const [loadingTheme, setLoadingTheme] = useState<ThemeId | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('الكل');

  const { data, isLoading } = useSWR<{ theme: ThemeId }>('/api/dashboard/setting/get-theme', fetcher, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
  });

  const TEMPLATES: Template[] = [
    {
      id: 'NORMAL',
      name: t.store?.classicTheme || 'بسيط',
      description: t.store?.classicThemeDesc || 'تصميم نظيف وبسيط يركز على المنتجات مع تنقل سهل',
      category: 'مجاني',
      colors: ['#FFFFFF', '#000000', '#0EA5E9'],
      features: ['تصميم متجاوب', 'عرض شبكي', 'تصفح سريع'],
      allowedPlans: ['trader-basic', 'trader-pro', 'drop-basics', 'drop-pro', 'free-trial'],
    },
    {
      id: 'MODERN',
      name: t.store?.modernTheme || 'عصري',
      description: t.store?.modernThemeDesc || 'تصميم عصري وجذاب مناسب للمتاجر الحديثة والأنيقة',
      category: 'مميز',
      colors: ['#f25933', '#0a0a0a', '#FFFFFF'],
      features: ['أنيميشن سلس', 'عرض المنتج بالكامل', 'أقسام حيوية'],
      popular: true,
      allowedPlans: ['trader-pro', 'drop-pro', 'free-trial'],
    },
  ];

  const visibleTemplates = TEMPLATES.filter(t => {
    if (!userPlanType) return false;
    return t.allowedPlans.includes(userPlanType);
  });

  const filtered = visibleTemplates.filter(t => activeCategory === 'الكل' || t.category === activeCategory);

  const applyTemplate = async (themeId: ThemeId) => {
    setLoadingTheme(themeId);
    try {
      await axios.post('/api/dashboard/setting/update', { theme: themeId });
      await mutate('/api/dashboard/setting/get-theme');
      toast.success(t.store?.themeUpdated || 'تم تطبيق القالب بنجاح');
    } catch (error) {
      console.error('خطأ أثناء تحديث الثيم:', error);
      toast.error(t.store?.themeUpdateError || 'فشل في تحديث الثيم');
    } finally {
      setLoadingTheme(null);
    }
  };

  const renderTemplateCard = (template: Template) => {
    const isSelected = data?.theme === template.id;
    const isLoadingBtn = loadingTheme === template.id;

    return (
      <div
        key={template.id}
        className={`bg-card border rounded-xl overflow-hidden transition-all ${
          isSelected ? 'border-primary shadow-sm ring-1 ring-primary/50' : 'border-border hover:border-primary/30'
        }`}
      >
        <div className="h-28 relative flex">
          {template.colors.map((color, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: color }} />
          ))}
          {template.popular && (
            <span className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold bg-background/90 text-foreground px-2 py-0.5 rounded-full shadow-sm">
              <Sparkles className="h-3 w-3 text-amber-500" /> شائع
            </span>
          )}
          {template.category === 'مميز' && (
            <span className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full shadow-sm">
              <Crown className="h-3 w-3" /> مميز
            </span>
          )}
          {isSelected && (
           <div className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-bold bg-green-400 text-white px-2 py-0.5 rounded-full shadow-sm">
            <Check className="h-3.5 w-3.5" /> مُطبق
           </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">{template.name}</h3>
            <div className="flex items-center gap-1">
              {template.colors.map((color, i) => (
                <span
                  key={i}
                  className="w-4 h-4 rounded-full border border-border/20 shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
            {template.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {template.features.map(feature => (
              <span key={feature} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border/50">
                {feature}
              </span>
            ))}
          </div>
          <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
            <Button
              onClick={() => applyTemplate(template.id)}
              disabled={isLoadingBtn || isLoading}
              size="sm"
              variant={isSelected ? 'secondary' : 'default'}
              className="flex-1 gap-1.5 text-xs font-medium"
            >
              {isLoadingBtn ? (
                t.store?.updatingTheme || 'جارٍ التحديث...'
              ) : isSelected ? (
                <>
                  <Check className="h-3.5 w-3.5" /> مُطبق
                </>
              ) : (
                <>
                  <Palette className="h-3.5 w-3.5" /> تطبيق
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium px-4">
              <Eye className="h-3.5 w-3.5" /> معاينة
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const freeTemplates = filtered.filter(t => t.category === 'مجاني');
  const premiumTemplates = filtered.filter(t => t.category === 'مميز');

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex gap-2">
        {['الكل', 'مجاني', 'مميز'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {/* Free templates */}
        {freeTemplates.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {freeTemplates.map(renderTemplateCard)}
          </div>
        )}

        {/* Premium templates */}
        {premiumTemplates.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Crown className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-bold text-foreground">قوالب مميزة</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {premiumTemplates.map(renderTemplateCard)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
