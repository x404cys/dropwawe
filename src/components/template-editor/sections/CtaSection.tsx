'use client';

import { useLanguage } from '@/app/(page)/Dashboard/context/LanguageContext';
import { Input } from '@/components/ui/input';
import type { TemplateFormState } from '@/lib/template/types';

interface CtaSectionProps {
  ctaTitle: TemplateFormState['ctaTitle'];
  ctaDesc: TemplateFormState['ctaDesc'];
  ctaButton: TemplateFormState['ctaButton'];
  onChange: (
    partial: Partial<Pick<TemplateFormState, 'ctaTitle' | 'ctaDesc' | 'ctaButton'>>
  ) => void;
}

export default function CtaSection({ ctaTitle, ctaDesc, ctaButton, onChange }: CtaSectionProps) {
  const { t } = useLanguage();
  const tt = t.templateEditor;

  return (
    <div className="space-y-2">
      <Input
        value={ctaTitle}
        onChange={event => onChange({ ctaTitle: event.target.value })}
        className="rounded-xl"
        placeholder={tt.cta.titlePlaceholder}
      />
      <Input
        value={ctaDesc}
        onChange={event => onChange({ ctaDesc: event.target.value })}
        className="rounded-xl"
        placeholder={tt.cta.descriptionPlaceholder}
      />
      <Input
        value={ctaButton}
        onChange={event => onChange({ ctaButton: event.target.value })}
        className="rounded-xl"
        placeholder={tt.cta.buttonPlaceholder}
      />
    </div>
  );
}
