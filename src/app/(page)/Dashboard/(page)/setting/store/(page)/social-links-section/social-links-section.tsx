'use client';
import { useLanguage } from '../../../../../context/LanguageContext';

import { Input } from '@/components/ui/input';
import { Facebook, Instagram, Send } from 'lucide-react';

interface SocialLinksSectionProps {
  facebookLink: string;
  instaLink: string;
  telegram: string;
  fieldErrors: { [key: string]: string };
  onFacebookChange: (value: string) => void;
  onInstagramChange: (value: string) => void;
  onTelegramChange: (value: string) => void;
}

export default function SocialLinksSection({
  facebookLink,
  instaLink,
  telegram,
  fieldErrors,
  onFacebookChange,
  onInstagramChange,
  onTelegramChange,
}: SocialLinksSectionProps) {
  const { t } = useLanguage();

  const socialLinks = [
    {
      label: 'Facebook',
      value: facebookLink,
      onChange: onFacebookChange,
      icon: Facebook,
      field: 'facebookLink',
      placeholder: t.store?.facebookLabel || 'رابط الفيسبوك',
    },
    {
      label: 'Instagram',
      value: instaLink,
      onChange: onInstagramChange,
      icon: Instagram,
      field: 'instaLink',
      placeholder: t.store?.instaLabel || 'رابط الانستغرام',
    },
    {
      label: 'Telegram',
      value: telegram,
      onChange: onTelegramChange,
      icon: Send,
      field: 'telegram',
      placeholder: t.store?.telegramLabel || 'رابط التليجرام',
    },
  ];

  return (
    <div className="flex flex-col">
      {socialLinks.map(({ label, value, onChange, icon: Icon, field, placeholder }) => (
        <div key={field} className="mb-4 space-y-4">
          <label className="text-foreground text-sm font-medium">{label}</label>
          <div className="relative flex items-center justify-between">
            <Icon className="text-muted-foreground absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2" />
            <Input
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder={placeholder}
              dir="ltr"
              className="text-left"
            />
          </div>
          {fieldErrors[field] && <p className="mt-1 text-xs text-red-500">{fieldErrors[field]}</p>}
        </div>
      ))}
    </div>
  );
}
