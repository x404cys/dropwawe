'use client';
// src/components/template-editor/ui/FontPicker.tsx
// Grid-based font selector. Displays built-in + custom fonts.
// Shows an "upload" button alongside each pick group.

import { Upload } from 'lucide-react';

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
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <button
          onClick={onUploadClick}
          className="flex items-center gap-1 text-[10px] font-medium text-primary hover:underline"
        >
          <Upload className="h-3 w-3" /> رفع خط
        </button>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {options.map(font => (
          <button
            key={font.value}
            onClick={() => onChange(font.value)}
            className={`p-2 rounded-xl border-2 transition-all text-center ${
              value === font.value ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <p
              className="text-xs font-bold truncate"
              style={{ fontFamily: font.value }}
            >
              {font.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
