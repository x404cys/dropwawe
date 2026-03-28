'use client';

import { useLanguage } from '@/app/(page)/Dashboard/context/LanguageContext';
import { Textarea } from '@/components/ui/textarea';

interface AboutSectionProps {
  aboutText: string;
  onChange: (value: string) => void;
}

export default function AboutSection({ aboutText, onChange }: AboutSectionProps) {
  const { t } = useLanguage();

  return (
    <Textarea
      value={aboutText}
      onChange={event => onChange(event.target.value)}
      rows={3}
      className="resize-none rounded-xl"
      placeholder={t.templateEditor.about.placeholder}
    />
  );
}
