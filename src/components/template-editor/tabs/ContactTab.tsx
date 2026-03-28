'use client';

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
import { useLanguage } from '@/app/(page)/Dashboard/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { ContactItem, ContactType, TemplateFormState } from '@/lib/template/types';

interface ContactTabProps {
  state: TemplateFormState;
  onUpdate: (partial: Partial<TemplateFormState>) => void;
}

export default function ContactTab({ state, onUpdate }: ContactTabProps) {
  const { t } = useLanguage();
  const tt = t.templateEditor;
  const [newType, setNewType] = useState<ContactType>('email');

  const contactOptions: Array<{
    type: ContactType;
    label: string;
    placeholder: string;
    icon: ElementType;
    allowLabel?: boolean;
  }> = [
    {
      type: 'email',
      label: tt.contact.types.email,
      placeholder: 'hello@example.com',
      icon: Mail,
    },
    {
      type: 'whatsapp',
      label: tt.contact.types.whatsapp,
      placeholder: '+964xxxxxxxxxx',
      icon: MessageCircle,
    },
    {
      type: 'phone',
      label: tt.contact.types.phone,
      placeholder: '+964xxxxxxxxxx',
      icon: Phone,
    },
    {
      type: 'website',
      label: tt.contact.types.website,
      placeholder: 'www.example.com',
      icon: Globe,
    },
    {
      type: 'instagram',
      label: tt.contact.types.instagram,
      placeholder: 'instagram.com/username',
      icon: Instagram,
    },
    {
      type: 'facebook',
      label: tt.contact.types.facebook,
      placeholder: 'facebook.com/username',
      icon: Facebook,
    },
    {
      type: 'telegram',
      label: tt.contact.types.telegram,
      placeholder: 't.me/username',
      icon: Send,
    },
    {
      type: 'custom',
      label: tt.contact.customLink,
      placeholder: 'https://example.com',
      icon: Link2,
      allowLabel: true,
    },
  ];

  const contactLabels = useMemo(
    () =>
      contactOptions.reduce<Record<ContactType, string>>(
        (acc, option) => {
          acc[option.type] = option.label;
          return acc;
        },
        {} as Record<ContactType, string>
      ),
    [contactOptions]
  );

  const contactPlaceholders = useMemo(
    () =>
      contactOptions.reduce<Record<ContactType, string>>(
        (acc, option) => {
          acc[option.type] = option.placeholder;
          return acc;
        },
        {} as Record<ContactType, string>
      ),
    [contactOptions]
  );

  const contactIcons = useMemo(
    () =>
      contactOptions.reduce<Record<ContactType, ElementType>>(
        (acc, option) => {
          acc[option.type] = option.icon;
          return acc;
        },
        {} as Record<ContactType, ElementType>
      ),
    [contactOptions]
  );

  const items = state.contactItems ?? [];
  const existingTypes = useMemo(() => new Set(items.map(item => item.type)), [items]);

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

    const newItem: ContactItem = {
      id: `contact-${Date.now()}`,
      type: newType,
      label: contactLabels[newType] ?? tt.contact.linkLabel,
      value: '',
      enabled: true,
    };

    updateItems([...items, newItem]);
  };

  const removeContact = (id: string) => {
    updateItems(items.filter(item => item.id !== id));
  };

  const updateContact = (id: string, patch: Partial<ContactItem>) => {
    updateItems(items.map(item => (item.id === id ? { ...item, ...patch } : item)));
  };

  return (
    <div className="bg-card border-border rounded-2xl border p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-foreground text-xs font-semibold">{tt.contact.title}</p>

        <div className="flex items-center gap-2">
          <Select value={newType} onValueChange={value => setNewType(value as ContactType)}>
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue placeholder={tt.contact.selectType} />
            </SelectTrigger>
            <SelectContent>
              {contactOptions.map(option => (
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
            {t.add}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-muted-foreground text-[11px]">{tt.contact.empty}</p>
        )}

        {items.map(item => {
          const Icon = contactIcons[item.type] ?? Link2;
          const placeholder = contactPlaceholders[item.type] ?? 'https://';
          const visibleLabel =
            item.type === 'custom' ? item.label || tt.contact.linkLabel : contactLabels[item.type];

          return (
            <div key={item.id} className="bg-muted/20 flex items-center gap-3 rounded-xl p-3">
              <div className="bg-background border-border flex h-8 w-8 items-center justify-center rounded-lg border">
                <Icon className="text-muted-foreground h-3.5 w-3.5" />
              </div>

              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-muted-foreground text-[10px]">{visibleLabel}</p>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.enabled}
                      onCheckedChange={checked => updateContact(item.id, { enabled: checked })}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive h-6 w-6"
                      onClick={() => removeContact(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {item.type === 'custom' && (
                  <Input
                    value={item.label}
                    onChange={event => updateContact(item.id, { label: event.target.value })}
                    placeholder={tt.contact.customLabelPlaceholder}
                    className="mb-2 h-7 rounded-none border-0 bg-transparent p-0 font-light focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                )}

                <Input
                  value={item.value}
                  onChange={event => updateContact(item.id, { value: event.target.value })}
                  placeholder={placeholder}
                  dir="ltr"
                  className="h-7 rounded-none border-0 bg-transparent p-0 font-light focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
