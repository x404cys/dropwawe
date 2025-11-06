'use client';

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

export function SocialLinksSection({
  facebookLink,
  instaLink,
  telegram,
  fieldErrors,
  onFacebookChange,
  onInstagramChange,
  onTelegramChange,
}: SocialLinksSectionProps) {
  const socialLinks = [
    {
      label: 'Facebook',
      value: facebookLink,
      onChange: onFacebookChange,
      icon: Facebook,
      field: 'facebookLink',
      placeholder: 'رابط الفيسبوك',
    },
    {
      label: 'Instagram',
      value: instaLink,
      onChange: onInstagramChange,
      icon: Instagram,
      field: 'instaLink',
      placeholder: 'رابط الانستغرام',
    },
    {
      label: 'Telegram',
      value: telegram,
      onChange: onTelegramChange,
      icon: Send,
      field: 'telegram',
      placeholder: 'رابط التليجرام',
    },
  ];

  return (
    <div className="flex flex-col">
      {socialLinks.map(({ label, value, onChange, icon: Icon, field, placeholder }) => (
        <div key={field} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          <div className="relative">
            <Input
              className=""
              value={value ? value : ''}
              onChange={e => onChange(e.target.value)}
              placeholder={placeholder}
            />
            <Icon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 bg-white text-gray-500" />
          </div>
          {fieldErrors[field] && <p className="mt-1 text-xs text-red-500">{fieldErrors[field]}</p>}
        </div>
      ))}
    </div>
  );
}
