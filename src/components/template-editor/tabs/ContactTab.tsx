'use client';
// src/components/template-editor/tabs/ContactTab.tsx
// اContact (التواصل) tab — contactEmail, whatsappNumber, contactWebsite.
// Note: contactPhone and contactInstagram are on the Store model itself (not StoreTemplate),
// so we only manage the three new fields added to StoreTemplate.

import { Globe, Mail, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { TemplateFormState } from '@/lib/template/types';

interface ContactTabProps {
  state: TemplateFormState;
  onUpdate: (partial: Partial<TemplateFormState>) => void;
}

const FIELDS = [
  {
    icon: Mail,
    label: 'البريد الإلكتروني',
    key: 'contactEmail' as const,
    placeholder: 'hello@example.com',
  },
  {
    icon: MessageCircle,
    label: 'واتساب',
    key: 'whatsappNumber' as const,
    placeholder: '+964xxxxxxxxxx',
  },
  {
    icon: Globe,
    label: 'الموقع الإلكتروني',
    key: 'contactWebsite' as const,
    placeholder: 'www.example.com',
  },
] as const;

export default function ContactTab({ state, onUpdate }: ContactTabProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <p className="text-xs font-semibold text-foreground mb-3">معلومات التواصل</p>
      <div className="space-y-2">
        {FIELDS.map(({ icon: Icon, label, key, placeholder }) => (
          <div key={key} className="flex items-center gap-3 bg-muted/20 rounded-xl p-3">
            <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center">
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-muted-foreground mb-0.5">{label}</p>
              <Input
                value={state[key]}
                onChange={e => onUpdate({ [key]: e.target.value })}
                placeholder={placeholder}
                dir="ltr"
                className="h-7 text-xs border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
