'use client';
// src/components/template-editor/sections/CtaSection.tsx
// CTA (Call To Action) section inputs: title, description, button text.

import { Input } from '@/components/ui/input';
import type { TemplateFormState } from '@/lib/template/types';

interface CtaSectionProps {
  ctaTitle: TemplateFormState['ctaTitle'];
  ctaDesc: TemplateFormState['ctaDesc'];
  ctaButton: TemplateFormState['ctaButton'];
  onChange: (partial: Partial<Pick<TemplateFormState, 'ctaTitle' | 'ctaDesc' | 'ctaButton'>>) => void;
}

export default function CtaSection({ ctaTitle, ctaDesc, ctaButton, onChange }: CtaSectionProps) {
  return (
    <div className="space-y-2">
      <Input
        value={ctaTitle}
        onChange={e => onChange({ ctaTitle: e.target.value })}
        className="text-sm rounded-xl"
        placeholder="العنوان"
      />
      <Input
        value={ctaDesc}
        onChange={e => onChange({ ctaDesc: e.target.value })}
        className="text-sm rounded-xl"
        placeholder="الوصف"
      />
      <Input
        value={ctaButton}
        onChange={e => onChange({ ctaButton: e.target.value })}
        className="text-sm rounded-xl"
        placeholder="نص الزر"
      />
    </div>
  );
}
