'use client';
import { useLanguage } from '../../../context/LanguageContext';

import { useState } from 'react';
import { TbCategoryPlus } from 'react-icons/tb';
import { Check, Plus } from 'lucide-react';

type Props = {
  categories: string[];
  value: string;
  onChange: (val: string) => void;
  loading: boolean;
};

export default function CategoryDropdown({ categories, value, onChange, loading }: Props) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const filtered = categories.filter(cat => cat.toLowerCase().includes(value.toLowerCase()));

  const isNewCategory = value && !categories.some(cat => cat.toLowerCase() === value.toLowerCase());

  return (
    <div className="relative w-full space-y-1">
      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
        <TbCategoryPlus className="h-4 w-4 text-muted-foreground" />
        {t.inventory?.category || 'التصنيف'} <span className="text-red-500">*</span>
      </label>

      <input
        type="text"
        value={value}
        disabled={loading}
        onChange={e => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
      />

      {isOpen && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-gray-300 bg-card shadow-lg">
          {filtered.map(cat => (
            <li
              key={cat}
              onMouseDown={() => onChange(cat)}
              className={`flex cursor-pointer items-center justify-between px-3 py-2 text-sm hover:bg-sky-50 ${
                value === cat ? 'font-medium' : ''
              }`}
            >
              {cat} {value === cat && <Check className="h-4 w-4 text-green-500" />}
            </li>
          ))}

          {isNewCategory && (
            <li
              onMouseDown={() => onChange(value)}
              className="flex cursor-pointer items-center justify-between px-3 py-2 text-sm font-medium hover:bg-sky-50"
            >
              <span> {(t.inventory?.add || 'إضافة')} "{value}"</span>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </li>
          )}

          {filtered.length === 0 && !isNewCategory && (
            <li className="px-3 py-2 text-sm text-muted-foreground">{t.inventory?.noCategory || 'لا يوجد تصنيف'}</li>
          )}
        </ul>
      )}
    </div>
  );
}
