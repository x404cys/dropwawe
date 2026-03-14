'use client';
// src/components/template-editor/tabs/ContactTab.tsx
// Contact tab - manages contact items (add/remove/toggle visibility).

import { useMemo, useState, type ElementType } from 'react';
import {
  Facebook,
  Globe,
  Instagram,
  Link2,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Send,
  Trash2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ContactItem, ContactType, TemplateFormState } from '@/lib/template/types';

interface ContactTabProps {
  state: TemplateFormState;
  onUpdate: (partial: Partial<TemplateFormState>) => void;
}

const CONTACT_OPTIONS: Array<{
  type: ContactType;
  label: string;
  placeholder: string;
  icon: ElementType;
  allowLabel?: boolean;
}> = [
  { type: 'email', label: 'البريد الإلكتروني', placeholder: 'hello@example.com', icon: Mail },
  { type: 'whatsapp', label: 'واتساب', placeholder: '+964xxxxxxxxxx', icon: MessageCircle },
  { type: 'phone', label: 'رقم الهاتف', placeholder: '+964xxxxxxxxxx', icon: Phone },
  { type: 'website', label: 'الموقع الإلكتروني', placeholder: 'www.example.com', icon: Globe },
  { type: 'instagram', label: 'انستغرام', placeholder: 'instagram.com/username', icon: Instagram },
  { type: 'facebook', label: 'فيسبوك', placeholder: 'facebook.com/username', icon: Facebook },
  { type: 'telegram', label: 'تلغرام', placeholder: 't.me/username', icon: Send },
  {
    type: 'custom',
    label: 'رابط مخصص',
    placeholder: 'https://example.com',
    icon: Link2,
    allowLabel: true,
  },
];

const CONTACT_LABELS = CONTACT_OPTIONS.reduce<Record<ContactType, string>>((acc, option) => {
  acc[option.type] = option.label;
  return acc;
}, {} as Record<ContactType, string>);

const CONTACT_PLACEHOLDERS = CONTACT_OPTIONS.reduce<Record<ContactType, string>>(
  (acc, option) => {
    acc[option.type] = option.placeholder;
    return acc;
  },
  {} as Record<ContactType, string>
);

const CONTACT_ICONS = CONTACT_OPTIONS.reduce<Record<ContactType, ElementType>>(
  (acc, option) => {
    acc[option.type] = option.icon;
    return acc;
  },
  {} as Record<ContactType, ElementType>
);

export default function ContactTab({ state, onUpdate }: ContactTabProps) {
  const [newType, setNewType] = useState<ContactType>('email');

  const items = state.contactItems ?? [];
  const existingTypes = useMemo(
    () => new Set(items.map(item => item.type)),
    [items]
  );

  const updateItems = (nextItems: ContactItem[]) => {
    const email = nextItems.find(item => item.type === 'email')?.value ?? '';
    const website = nextItems.find(item => item.type === 'website')?.value ?? '';
    const whatsapp = nextItems.find(item => item.type === 'whatsapp')?.value ?? '';

    onUpdate({
      contactItems: nextItems,
      contactEmail: email,
      contactWebsite: website,
      whatsappNumber: whatsapp,
    });
  };

  const addContact = () => {
    if (newType !== 'custom' && existingTypes.has(newType)) return;
    const id = `contact-${Date.now()}`;
    const label = CONTACT_LABELS[newType] ?? 'رابط';
    const newItem: ContactItem = {
      id,
      type: newType,
      label,
      value: '',
      enabled: true,
    };
    updateItems([...items, newItem]);
  };

  const removeContact = (id: string) => {
    updateItems(items.filter(item => item.id !== id));
  };

  const updateContact = (id: string, patch: Partial<ContactItem>) => {
    updateItems(
      items.map(item => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-foreground">معلومات التواصل</p>
        <div className="flex items-center gap-2">
          <Select value={newType} onValueChange={value => setNewType(value as ContactType)}>
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue placeholder="اختر نوع" />
            </SelectTrigger>
            <SelectContent>
              {CONTACT_OPTIONS.map(option => (
                <SelectItem
                  key={option.type}
                  value={option.type}
                  disabled={option.type !== 'custom' && existingTypes.has(option.type)}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={addContact}
            disabled={newType !== 'custom' && existingTypes.has(newType)}
          >
            <Plus className="h-3.5 w-3.5" />
            إضافة
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-[11px] text-muted-foreground">ماكو روابط تواصل بعد.</p>
        )}

        {items.map(item => {
          const Icon = CONTACT_ICONS[item.type] ?? Link2;
          const placeholder = CONTACT_PLACEHOLDERS[item.type] ?? 'https://';
          return (
            <div key={item.id} className="flex items-center gap-3 bg-muted/20 rounded-xl p-3">
              <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] text-muted-foreground">
                    {item.label || CONTACT_LABELS[item.type]}
                  </p>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.enabled}
                      onCheckedChange={checked => updateContact(item.id, { enabled: checked })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => removeContact(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {item.type === 'custom' && (
                  <Input
                    value={item.label}
                    onChange={e => updateContact(item.id, { label: e.target.value })}
                    placeholder="عنوان الرابط"
                    className="h-7 mb-2 font-light border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                  />
                )}

                <Input
                  value={item.value}
                  onChange={e => updateContact(item.id, { value: e.target.value })}
                  placeholder={placeholder}
                  dir="ltr"
                  className="h-7 font-light border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
