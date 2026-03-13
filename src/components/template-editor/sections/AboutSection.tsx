'use client';
// src/components/template-editor/sections/AboutSection.tsx
// "من نحن" about text area.

import { Textarea } from '@/components/ui/textarea';

interface AboutSectionProps {
  aboutText: string;
  onChange: (value: string) => void;
}

export default function AboutSection({ aboutText, onChange }: AboutSectionProps) {
  return (
    <Textarea
      value={aboutText}
      onChange={e => onChange(e.target.value)}
      rows={3}
      className=" rounded-xl resize-none"
      placeholder="نبذة تعريفية"
    />
  );
}
