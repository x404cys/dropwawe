'use client';

import { Upload } from 'lucide-react';
import { useLanguage } from '@/app/(page)/Dashboard/context/LanguageContext';
import { resolveTemplateFontFamily } from '@/lib/template/font-family';

interface FontOption {
  value: string;
  label: string;
}

interface FontPickerProps {
  label: string;
  value: string;
  options: FontOption[];
  onChange: (fontValue: string) => void;
  onUploadClick: () => void;
}

export default function FontPicker({
  label,
  value,
  options,
  onChange,
  onUploadClick,
}: FontPickerProps) {
  const { t } = useLanguage();

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-muted-foreground text-[10px]">{label}</p>
        <button
          onClick={onUploadClick}
          className="text-primary flex items-center gap-1 text-[10px] font-medium hover:underline"
        >
          <Upload className="h-3 w-3" />
          {t.templateEditor.actions.uploadFont}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {options.map(font => (
          <button
            key={font.value}
            onClick={() => onChange(font.value)}
            className={`rounded-xl border-2 p-2 text-center transition-all ${
              value === font.value ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <p
              className="truncate text-xs font-bold"
              style={{ fontFamily: resolveTemplateFontFamily(font.value) }}
            >
              {font.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
