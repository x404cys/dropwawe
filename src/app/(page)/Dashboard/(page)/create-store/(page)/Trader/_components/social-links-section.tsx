'use client';

import { Input } from '@/components/ui/input';
import { Facebook, Info, Instagram, Send } from 'lucide-react';

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
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sky-800">
        <div className="mt-0.5">
          <Info className="h-5 w-5" />
        </div>

        <div className="text-sm leading-relaxed">
          <p className="font-medium">معلومة مهمة</p>
          <p className="text-sky-700">
            يمكنك تجاهل ملء هذه الحقول حالياً وإنشاء المتجر، ويمكنك تعديلها لاحقاً من الإعدادات.
          </p>
        </div>
      </div>

      {socialLinks.map(({ label, value, onChange, icon: Icon, field, placeholder }) => (
        <div key={field} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">{label}</label>

          <div className="relative">
            <Input
              value={value ?? ''}
              onChange={e => onChange(e.target.value)}
              placeholder={placeholder}
              className="pl-10"
            />
            <Icon className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>

          {fieldErrors[field] && <p className="mt-1 text-xs text-red-500">{fieldErrors[field]}</p>}
        </div>
      ))}
    </div>
  );
}
