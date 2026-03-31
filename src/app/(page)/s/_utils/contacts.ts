import { Facebook, Globe, Instagram, Link2, Mail, MessageCircle, Phone, Send } from 'lucide-react';
import type { ElementType } from 'react';
import type {
  StorefrontContactItem,
  StorefrontContactType,
  StorefrontStore,
  StorefrontTemplate,
} from '../_lib/types';

const TYPE_LABELS: Record<StorefrontContactType, string> = {
  email: 'البريد الإلكتروني',
  whatsapp: 'واتساب',
  website: 'الموقع الإلكتروني',
  phone: 'رقم الهاتف',
  instagram: 'انستغرام',
  facebook: 'فيسبوك',
  telegram: 'تلغرام',
  custom: 'رابط',
};

const TYPE_ICONS: Record<StorefrontContactType, ElementType> = {
  email: Mail,
  whatsapp: MessageCircle,
  website: Globe,
  phone: Phone,
  instagram: Instagram,
  facebook: Facebook,
  telegram: Send,
  custom: Link2,
};

const EXTERNAL_TYPES = new Set<StorefrontContactType>([
  'whatsapp',
  'website',
  'instagram',
  'facebook',
  'telegram',
  'custom',
]);

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^(https?:)?\/\//i.test(trimmed))
    return trimmed.startsWith('http') ? trimmed : `https:${trimmed}`;
  return `https://${trimmed}`;
}

export function getContactIcon(type: StorefrontContactType) {
  return TYPE_ICONS[type] ?? Link2;
}

export function isExternalContact(type: StorefrontContactType) {
  return EXTERNAL_TYPES.has(type);
}

export function getContactHref(item: StorefrontContactItem): string | null {
  const value = item.value?.trim();
  if (!value) return null;

  switch (item.type) {
    case 'email':
      return `mailto:${value}`;
    case 'phone':
      return `tel:${value.replace(/\s+/g, '')}`;
    case 'whatsapp': {
      const cleaned = value.replace(/\s+/g, '').replace(/^\+/, '');
      return `https://wa.me/${cleaned}`;
    }
    case 'website':
    case 'instagram':
    case 'facebook':
    case 'telegram':
    case 'custom':
    default:
      return normalizeUrl(value);
  }
}

function normalizeContactItem(raw: StorefrontContactItem, index: number): StorefrontContactItem {
  const type: StorefrontContactType =
    raw.type && Object.prototype.hasOwnProperty.call(TYPE_LABELS, raw.type) ? raw.type : 'custom';
  const label =
    typeof raw.label === 'string' && raw.label.trim() ? raw.label : (TYPE_LABELS[type] ?? 'رابط');
  const value = typeof raw.value === 'string' ? raw.value : '';
  const enabled = typeof raw.enabled === 'boolean' ? raw.enabled : value.trim().length > 0;
  const id = typeof raw.id === 'string' && raw.id ? raw.id : `${type}-${index}`;
  return { id, type, label, value, enabled };
}

export function buildContactItems(
  template: StorefrontTemplate,
  store: StorefrontStore
): StorefrontContactItem[] {
  const raw = Array.isArray(template.contactItems) ? template.contactItems : [];
  if (raw.length > 0) {
    return raw.map(normalizeContactItem);
  }

  const legacy: Array<{ type: StorefrontContactType; value?: string | null }> = [
    { type: 'email', value: template.contactEmail },
    { type: 'website', value: template.contactWebsite },
    { type: 'whatsapp', value: template.whatsappNumber },
    { type: 'phone', value: store.phone },
    { type: 'instagram', value: store.instaLink },
    { type: 'facebook', value: store.facebookLink },
    { type: 'telegram', value: store.telegram },
  ];

  return legacy
    .filter(item => typeof item.value === 'string' && item.value.trim().length > 0)
    .map((item, index) => ({
      id: `${item.type}-${index}`,
      type: item.type,
      label: TYPE_LABELS[item.type] ?? 'رابط',
      value: item.value!.trim(),
      enabled: true,
    }));
}
