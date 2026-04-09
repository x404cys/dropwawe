'use client';
// src/app/(page)/Dashboard/(page)/setting/store/(page)/template-section/template-section.tsx
// Section wrapper for the template editor.
// Mirrors the pattern of basic-info-section.tsx and social-links-section.tsx.
// Wraps TemplateEditor inside a SettingsSectionCard.

import SettingsSectionCard from '../../../_components/settings-section-card';
import TemplateEditor from '@/components/template-editor/TemplateEditor';
import type { TemplateFormState } from '@/lib/template/types';

interface TemplateSectionProps {
  initialData: TemplateFormState;
  storeId: string;
  storeName: string;
  storeDescription: string;
  storeLogoImage: string | null;
  storeSubLink: string;
  categories: string[];
  viewOnly?: boolean;
}

export default function TemplateSection({
  initialData,
  storeId,
  storeName,
  storeDescription,
  storeLogoImage,
  storeSubLink,
  categories,
  viewOnly = false,
}: TemplateSectionProps) {
  const storefrontUrl = `https://${storeSubLink}.matager.store`;

  return (
    <SettingsSectionCard noPadding>
      <TemplateEditor
        initialData={initialData}
        storeId={storeId}
        storeName={storeName}
        storeDescription={storeDescription}
        storeLogoImage={storeLogoImage}
        categories={categories}
        storefrontUrl={storefrontUrl}
        viewOnly={viewOnly}
      />
    </SettingsSectionCard>
  );
}
