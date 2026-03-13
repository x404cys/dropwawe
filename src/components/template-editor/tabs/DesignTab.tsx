'use client';
// src/components/template-editor/tabs/DesignTab.tsx
// Design (التصميم) tab — color presets, custom colors, fonts, and live preview.

import { useRef } from 'react';
import { X, Check } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import FontPicker from '../ui/FontPicker';
import ColorPicker from '../ui/ColorPicker';
import { COLOR_PRESETS } from '@/lib/template/defaults';
import type { TemplateFormState, CustomFontItem } from '@/lib/template/types';

const BUILTIN_FONTS = [
  { value: 'IBM Plex Sans Arabic', label: 'IBM Plex' },
  { value: 'Cairo', label: 'القاهرة' },
  { value: 'Tajawal', label: 'تجوّل' },
  { value: 'Almarai', label: 'المرعي' },
  { value: 'Noto Sans Arabic', label: 'نوتو' },
  { value: 'Rubik', label: 'روبيك' },
];

interface DesignTabProps {
  state: TemplateFormState;
  storeName: string;
  onUpdate: (partial: Partial<TemplateFormState>) => void;
  // onAddCustomFont: (name: string, url: string) => void;
  onRemoveCustomFont: (id: string, name: string) => void;
}

export default function DesignTab({
  state,
  storeName,
  onUpdate,
  // onAddCustomFont,
  onRemoveCustomFont,
}: DesignTabProps) {
  const fontInputRef = useRef<HTMLInputElement>(null);
  const fontTarget = useRef<'heading' | 'body'>('heading');

  const allFonts = [
    ...BUILTIN_FONTS,
    ...state.customFonts.map(f => ({ value: f.name, label: `✦ ${f.name}` })),
  ];

  const handleFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validExts = ['.ttf', '.otf', '.woff', '.woff2'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExts.includes(ext)) {
      toast.error('صيغة غير مدعومة — استخدم TTF, OTF, WOFF, WOFF2');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الملف كبير — الحد الأقصى 5MB');
      return;
    }
    const fontName = file.name.replace(/\.[^.]+$/, '');
    const reader = new FileReader();
    reader.onloadend = () => {
      // TODO: replace with storage upload (Supabase/S3) and store URL
      // onAddCustomFont(fontName, reader.result as string);
      // Set as active font for the target
      onUpdate(
        fontTarget.current === 'heading'
          ? { headingFont: fontName }
          : { bodyFont: fontName },
      );
      toast.success(`تم تعيين "${fontName}" كخط ${fontTarget.current === 'heading' ? 'العناوين' : 'النصوص'}`);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const triggerFontUpload = (target: 'heading' | 'body') => {
    fontTarget.current = target;
    fontInputRef.current?.click();
  };

  // Active preview colors
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
      {/* Color Presets */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-xs font-semibold text-foreground mb-3">الألوان</p>
        <div className="grid grid-cols-4 gap-2 mb-4">
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
                className={`relative rounded-xl p-2 border-2 transition-all ${
                  isSelected
                    ? 'border-primary shadow-md'
                    : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-primary-foreground" />
                  </div>
                )}
                <div className="flex gap-0.5 justify-center mb-1.5">
                  <div
                    className="w-4 h-4 rounded-full ring-1 ring-border"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <div
                    className="w-4 h-4 rounded-full ring-1 ring-border"
                    style={{ backgroundColor: preset.accent }}
                  />
                </div>
                <p className="text-[9px] font-semibold text-foreground">{preset.name}</p>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between py-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground">ألوان مخصصة</span>
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

      {/* Fonts */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-xs font-semibold text-foreground mb-3">الخطوط</p>
        <input
          ref={fontInputRef}
          type="file"
          accept=".ttf,.otf,.woff,.woff2"
          className="hidden"
          onChange={handleFontUpload}
        />

        {/* Custom fonts list */}
        {state.customFonts.length > 0 && (
          <div className="mb-3 space-y-1.5">
            {state.customFonts.map((font: CustomFontItem) => (
              <div
                key={font.id}
                className="flex items-center justify-between bg-primary/5 rounded-lg px-3 py-2"
              >
                <span
                  className="text-[11px] font-medium text-foreground"
                  style={{ fontFamily: font.name }}
                >
                  ✦ {font.name}
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

      {/* Live Preview */}
      <div className="rounded-2xl border border-border overflow-hidden">
        <div className="p-4" style={{ backgroundColor: previewColors.bg }}>
          <p
            className="text-sm font-bold mb-1"
            style={{ color: previewColors.text, fontFamily: state.headingFont }}
          >
            {storeName}
          </p>
          <p
            className="text-xs mb-3"
            style={{ color: `${previewColors.text}88`, fontFamily: state.bodyFont }}
          >
            {state.tagline}
          </p>
          <div className="flex gap-2">
            <div
              className="px-4 py-2 rounded-xl text-[11px] font-bold text-white"
              style={{ backgroundColor: previewColors.primary }}
            >
              {state.heroButtonText}
            </div>
            <div
              className="px-4 py-2 rounded-xl text-[11px] border"
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
