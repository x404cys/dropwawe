'use client';
// src/components/template-editor/tabs/DesignTab.tsx
// Design (Ø§Ù„ØªØµÙ…ÙŠÙ…) tab â€” color presets, custom colors, fonts, and live preview.

import { useRef } from 'react';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { COLOR_PRESETS } from '@/lib/template/defaults';
import type { CustomFontItem, TemplateFormState } from '@/lib/template/types';
import ColorPicker from '../ui/ColorPicker';
import FontPicker from '../ui/FontPicker';

const BUILTIN_FONTS = [
  { value: 'IBM Plex Sans Arabic', label: 'IBM Plex' },
  { value: 'Cairo', label: 'القاهرة' },
  { value: 'Tajawal', label: 'تجوال' },
  { value: 'Almarai', label: 'المرعي' },
  { value: 'Noto Sans Arabic', label: 'نوتو' },
  { value: 'Rubik', label: 'روبيك' },
];

interface DesignTabProps {
  state: TemplateFormState;
  storeName: string;
  onUpdate: (partial: Partial<TemplateFormState>) => void;
  onAddCustomFont: (name: string, file: File) => Promise<boolean>;
  onRemoveCustomFont: (id: string, name: string) => void;
}

export default function DesignTab({
  state,
  storeName,
  onUpdate,
  onAddCustomFont,
  onRemoveCustomFont,
}: DesignTabProps) {
  const fontInputRef = useRef<HTMLInputElement>(null);
  const fontTarget = useRef<'heading' | 'body'>('heading');

  const allFonts = [
    ...BUILTIN_FONTS,
    ...state.customFonts.map(f => ({ value: f.name, label: `${f.name}` })),
  ];

  const handleFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExts = ['.ttf', '.otf', '.woff', '.woff2'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExts.includes(ext)) {
      toast.error('غير مسموح بهذه الخطوط الرجاء ان يكون الامتداد .ttf أو .otf أو .woff أو .woff2');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الملف كبير — الحد الأقصى 5MB');
      return;
    }

    const fontName = file.name.replace(/\.[^.]+$/, '');
    const uploaded = await onAddCustomFont(fontName, file);
    if (!uploaded) {
      e.target.value = '';
      return;
    }

    onUpdate(fontTarget.current === 'heading' ? { headingFont: fontName } : { bodyFont: fontName });
    toast.success(`تم إضافة الخط ${fontName} بنجاح`);
    e.target.value = '';
  };

  const triggerFontUpload = (target: 'heading' | 'body') => {
    fontTarget.current = target;
    fontInputRef.current?.click();
  };

  const previewColors = state.useCustomColors
    ? {
        primary: state.colorPrimary,
        accent: state.colorAccent,
        bg: state.colorBg,
        text: state.colorText,
      }
    : {
        primary: COLOR_PRESETS[state.selectedPreset]?.primary ?? '#6366f1',
        accent: COLOR_PRESETS[state.selectedPreset]?.accent ?? '#8b5cf6',
        bg: COLOR_PRESETS[state.selectedPreset]?.bg ?? '#0f0f14',
        text: COLOR_PRESETS[state.selectedPreset]?.text ?? '#f4f4f5',
      };

  return (
    <div className="space-y-4">
      <div className="bg-card border-border rounded-2xl border p-4">
        <p className="text-foreground mb-3 text-xs font-semibold">الألوان</p>
        <div className="mb-4 grid grid-cols-4 gap-2">
          {COLOR_PRESETS.map((preset, i) => {
            const isSelected = !state.useCustomColors && state.selectedPreset === i;
            return (
              <button
                key={i}
                onClick={() =>
                  onUpdate({
                    selectedPreset: i,
                    useCustomColors: false,
                    colorPrimary: preset.primary,
                    colorAccent: preset.accent,
                    colorBg: preset.bg,
                    colorText: preset.text,
                  })
                }
                className={`relative rounded-xl border-2 p-2 transition-all ${
                  isSelected
                    ? 'border-primary shadow-md'
                    : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                {isSelected && (
                  <div className="bg-primary absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full">
                    <Check className="text-primary-foreground h-2.5 w-2.5" />
                  </div>
                )}
                <div className="mb-1.5 flex justify-center gap-0.5">
                  <div
                    className="ring-border h-4 w-4 rounded-full ring-1"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <div
                    className="ring-border h-4 w-4 rounded-full ring-1"
                    style={{ backgroundColor: preset.accent }}
                  />
                </div>
                <p className="text-foreground text-[9px] font-semibold">{preset.name}</p>
              </button>
            );
          })}
        </div>

        <div className="border-border/50 flex items-center justify-between border-t py-2">
          <span className="text-muted-foreground text-xs">ألوان مخصصة</span>
          <Switch
            checked={state.useCustomColors}
            onCheckedChange={v => onUpdate({ useCustomColors: v })}
          />
        </div>

        {state.useCustomColors && (
          <div className="grid grid-cols-2 gap-2 pt-2">
            <ColorPicker
              label="الرئيسي"
              value={state.colorPrimary}
              onChange={v => onUpdate({ colorPrimary: v })}
            />
            <ColorPicker
              label="الثانوي"
              value={state.colorAccent}
              onChange={v => onUpdate({ colorAccent: v })}
            />
            <ColorPicker
              label="الخلفية"
              value={state.colorBg}
              onChange={v => onUpdate({ colorBg: v })}
            />
            <ColorPicker
              label="النصوص"
              value={state.colorText}
              onChange={v => onUpdate({ colorText: v })}
            />
          </div>
        )}
      </div>

      <div className="bg-card border-border rounded-2xl border p-4">
        <p className="text-foreground mb-3 text-xs font-semibold">الخطوط</p>
        <input
          ref={fontInputRef}
          type="file"
          accept=".ttf,.otf,.woff,.woff2"
          className="hidden"
          onChange={handleFontUpload}
        />

        {state.customFonts.length > 0 && (
          <div className="mb-3 space-y-1.5">
            {state.customFonts.map((font: CustomFontItem) => (
              <div
                key={font.id}
                className="bg-primary/5 flex items-center justify-between rounded-lg px-3 py-2"
              >
                <span
                  className="text-foreground text-[11px] font-medium"
                  style={{ fontFamily: font.name }}
                >
                  {font.name}
                </span>
                <button
                  onClick={() => onRemoveCustomFont(font.id, font.name)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <FontPicker
            label="خط العناوين"
            value={state.headingFont}
            options={allFonts}
            onChange={v => onUpdate({ headingFont: v })}
            onUploadClick={() => triggerFontUpload('heading')}
          />
          <FontPicker
            label="خط النصوص"
            value={state.bodyFont}
            options={allFonts}
            onChange={v => onUpdate({ bodyFont: v })}
            onUploadClick={() => triggerFontUpload('body')}
          />
        </div>
      </div>

      <div className="border-border overflow-hidden rounded-2xl border">
        <div className="p-4" style={{ backgroundColor: previewColors.bg }}>
          <p
            className="mb-1 text-sm font-bold"
            style={{ color: previewColors.text, fontFamily: state.headingFont }}
          >
            {storeName}
          </p>
          <p
            className="mb-3 text-xs"
            style={{ color: `${previewColors.text}88`, fontFamily: state.bodyFont }}
          >
            {state.tagline}
          </p>
          <div className="flex gap-2">
            <div
              className="rounded-xl px-4 py-2 text-[11px] font-bold text-white"
              style={{ backgroundColor: previewColors.primary }}
            >
              {state.heroButtonText}
            </div>
            <div
              className="rounded-xl border px-4 py-2 text-[11px]"
              style={{
                borderColor: `${previewColors.text}20`,
                color: previewColors.text,
              }}
            >
              {state.heroSecondaryButton}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
