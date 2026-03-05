'use client';
import { useLanguage } from '../../../../context/LanguageContext';

import React from 'react';
import { BsTelegram } from 'react-icons/bs';
import { ImageIcon } from 'lucide-react';
import { ModernInputGroup } from './ModernInputGroup';
import { CollapsibleSection } from './CollapsibleSection';
import type { Product } from '@/types/Products';

interface SocialMediaSectionProps {
  newProduct: Partial<Product> & { imageFile?: File; imagePreview?: string };
  setNewProduct: (product: any) => void;
  loading: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

export function SocialMediaSection({
  newProduct,
  setNewProduct,
  loading,
  isExpanded,
  onToggle,
}: SocialMediaSectionProps) {
  const { t } = useLanguage();
  return (
    <CollapsibleSection
      title={t.store?.socialLinks || 'روابط التواصل'}
      subtitle={t.inventory?.optionalSocialLinks || 'اختياري - أضف روابط للمنتج'}
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        <ModernInputGroup
          label={t.inventory?.telegramLink || 'رابط تيليجرام'}
          icon={<BsTelegram className="h-4 w-4 text-sky-500" />}
          value={newProduct.subInfo?.telegram || ''}
          onChange={value =>
            setNewProduct({
              ...newProduct,
              subInfo: { ...newProduct.subInfo, telegram: value },
            })
          }
          placeholder="https://t.me/..."
          disabled={loading}
        />

        <ModernInputGroup
          label={t.inventory?.videoLink || 'رابط الفيديو'}
          icon={<ImageIcon className="h-4 w-4 text-muted-foreground" />}
          value={newProduct.subInfo?.videoLink || ''}
          onChange={value =>
            setNewProduct({
              ...newProduct,
              subInfo: { ...newProduct.subInfo, videoLink: value },
            })
          }
          placeholder="https://youtube.com/..."
          disabled={loading}
        />
      </div>
    </CollapsibleSection>
  );
}
