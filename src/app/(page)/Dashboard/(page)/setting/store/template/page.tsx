'use client';

import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_TEMPLATE_STATE } from '@/lib/template/defaults';
import { toFormState } from '@/lib/template/transform';
import type { TemplateFormState } from '@/lib/template/types';
import { useStoreProvider } from '../../../../context/StoreContext';
import SettingsPageHeader from '../../_components/settings-page-header';
import TemplateSection from '../(page)/template-section/template-section';
import { useLanguage } from '@/app/(page)/Dashboard/context/LanguageContext';

export default function TemplateSettingsPage() {
  const { currentStore } = useStoreProvider();
  const { t, dir } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  const localizedDefaultTemplate = useMemo<TemplateFormState>(
    () => ({
      ...DEFAULT_TEMPLATE_STATE,
      heroButtonText: t.templateEditor.defaults.heroPrimaryButton,
      heroSecondaryButton: t.templateEditor.defaults.heroSecondaryButton,
      ctaButton: t.templateEditor.defaults.ctaButton,
      announcementBar: {
        ...DEFAULT_TEMPLATE_STATE.announcementBar,
        text: t.templateEditor.defaults.announcementBarText,
      },
    }),
    [t]
  );

  const [templateData, setTemplateData] = useState<TemplateFormState>(localizedDefaultTemplate);

  useEffect(() => {
    if (!currentStore?.id) {
      setTemplateData(localizedDefaultTemplate);
      setIsLoading(false);
      return;
    }

    const fetchTemplate = async () => {
      try {
        const res = await fetch(`/api/template?storeId=${encodeURIComponent(currentStore.id)}`);
        if (!res.ok) {
          setTemplateData(localizedDefaultTemplate);
          return;
        }

        const data = (await res.json()) as {
          template: { store?: { products?: Array<{ category: string }> } };
        };

        setTemplateData(toFormState(data.template as Parameters<typeof toFormState>[0]));
        setCategories(
          Array.from(
            new Set(
              data.template?.store?.products?.map(
                (product: { category: string }) => product.category
              )
            )
          )
        );
      } catch {
        setTemplateData(localizedDefaultTemplate);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchTemplate();
  }, [currentStore?.id, localizedDefaultTemplate]);

  return (
    <section dir={dir} className="bg-background min-h-screen pb-28">
      <SettingsPageHeader
        title={t.templateEditor.page.title}
        subtitle={t.templateEditor.page.subtitle}
      />

      <main className="mx-auto max-w-lg px-2 pt-4">
        {isLoading ? (
          <div className="text-muted-foreground flex items-center justify-center py-20 text-sm">
            {t.templateEditor.page.loading}
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
            {t.templateEditor.page.storeNotFound}
          </div>
        )}
      </main>
    </section>
  );
}
