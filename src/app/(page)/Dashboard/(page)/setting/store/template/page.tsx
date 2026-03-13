// src/app/(page)/Dashboard/(page)/setting/store/template/page.tsx
// Server Component — fetches the StoreTemplate and passes it to TemplateSection.
// Mirrors the pattern of theme/page.tsx and social/page.tsx.
// Note: this page uses 'use client' because it depends on useLanguage context
// for the header title, following the same pattern as theme/page.tsx.

'use client';

import { useStoreProvider } from '../../../../context/StoreContext';
import { useEffect, useState } from 'react';
import SettingsPageHeader from '../../_components/settings-page-header';
import TemplateSection from '../(page)/template-section/template-section';
import { toFormState } from '@/lib/template/transform';
import { DEFAULT_TEMPLATE_STATE } from '@/lib/template/defaults';
import type { TemplateFormState } from '@/lib/template/types';

export default function TemplateSettingsPage() {
  const { currentStore } = useStoreProvider();
  const [templateData, setTemplateData] = useState<TemplateFormState>(DEFAULT_TEMPLATE_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!currentStore?.id) return;

    const fetchTemplate = async () => {
      try {
        const res = await fetch(`/api/template?storeId=${encodeURIComponent(currentStore.id)}`);
        if (!res.ok) return;
        const data = (await res.json()) as {
          template: { store?: { products?: Array<{ category: string }> } };
        };
        setTemplateData(toFormState(data.template as Parameters<typeof toFormState>[0]));
        setCategories(
          Array.from(
            new Set(data.template?.store?.products?.map((p: { category: string }) => p.category))
          )
        );
      } catch {
      } finally {
        setIsLoading(false);
      }
    };

    void fetchTemplate();
  }, [currentStore?.id]);

  return (
    <section dir="rtl" className="bg-background min-h-screen pb-28">
      <SettingsPageHeader title="تخصيص القالب" subtitle="عدّل هوية ومحتوى وتصميم متجرك" />
      <main className="mx-auto max-w-lg px-4 pt-4">
        {isLoading ? (
          <div className="text-muted-foreground flex items-center justify-center py-20 text-sm">
            جارٍ التحميل...
          </div>
        ) : currentStore ? (
          <TemplateSection
            initialData={templateData}
            storeId={currentStore.id}
            storeName={currentStore.name ?? ''}
            storeDescription={currentStore.description ?? ''}
            storeLogoImage={currentStore.image ?? null}
            storeSubLink={currentStore.subLink ?? ''}
            categories={categories}
          />
        ) : (
          <div className="text-muted-foreground flex items-center justify-center py-20 text-sm">
            لم يتم العثور على متجر
          </div>
        )}
      </main>
    </section>
  );
}
