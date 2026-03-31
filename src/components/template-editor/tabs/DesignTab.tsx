'use client';

import {
  Almarai,
  Cairo,
  IBM_Plex_Sans_Arabic,
  Noto_Sans_Arabic,
  Rubik,
  Tajawal,
} from 'next/font/google';
import { useMemo, useRef } from 'react';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/app/(page)/Dashboard/context/LanguageContext';
import { Switch } from '@/components/ui/switch';
import { COLOR_PRESETS } from '@/lib/template/defaults';
import { resolveTemplateFontFamily } from '@/lib/template/font-family';
import type { CustomFontItem, TemplateFormState } from '@/lib/template/types';
import ColorPicker from '../ui/ColorPicker';
import FontPicker from '../ui/FontPicker';

interface DesignTabProps {
  state: TemplateFormState;
  storeName: string;
  onUpdate: (partial: Partial<TemplateFormState>) => void;
  onAddCustomFont: (name: string, file: File) => Promise<boolean>;
  onRemoveCustomFont: (id: string, name: string) => void;
}

const PRESET_KEYS = [
  'lilac',
  'dawn',
  'coral',
  'emerald',
  'rocky',
  'nile',
  'cocoa',
  'rose',
] as const;

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--store-font-ibm-plex-sans-arabic',
  display: 'swap',
  preload: false,
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--store-font-cairo',
  display: 'swap',
  preload: false,
});

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  variable: '--store-font-tajawal',
  display: 'swap',
  preload: false,
});

const almarai = Almarai({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '700', '800'],
  variable: '--store-font-almarai',
  display: 'swap',
  preload: false,
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  variable: '--store-font-noto-sans-arabic',
  display: 'swap',
  preload: false,
});

const rubik = Rubik({
  subsets: ['arabic', 'latin'],
  variable: '--store-font-rubik',
  display: 'swap',
  preload: false,
});

const templateEditorFontVariables = [
  ibmPlexSansArabic.variable,
  cairo.variable,
  tajawal.variable,
  almarai.variable,
  notoSansArabic.variable,
  rubik.variable,
].join(' ');

function getFontFormat(url: string) {
  const lower = url.toLowerCase();

  if (lower.endsWith('.woff2')) return 'woff2';
  if (lower.endsWith('.woff')) return 'woff';
  if (lower.endsWith('.ttf')) return 'truetype';
  if (lower.endsWith('.otf')) return 'opentype';

  return '';
}

export default function DesignTab({
  state,
  storeName,
  onUpdate,
  onAddCustomFont,
  onRemoveCustomFont,
}: DesignTabProps) {
  const { t } = useLanguage();
  const tt = t.templateEditor;
  const fontInputRef = useRef<HTMLInputElement>(null);
  const fontTarget = useRef<'heading' | 'body'>('heading');

  const builtInFonts = useMemo(
    () => [
      { value: 'IBM Plex Sans Arabic', label: tt.design.builtinFonts.ibm },
      { value: 'Cairo', label: tt.design.builtinFonts.cairo },
      { value: 'Tajawal', label: tt.design.builtinFonts.tajawal },
      { value: 'Almarai', label: tt.design.builtinFonts.almarai },
      { value: 'Noto Sans Arabic', label: tt.design.builtinFonts.noto },
      { value: 'Rubik', label: tt.design.builtinFonts.rubik },
    ],
    [tt.design.builtinFonts]
  );

  const allFonts = [
    ...builtInFonts,
    ...state.customFonts.map(font => ({ value: font.name, label: font.name })),
  ];

  const presetLabels = [
    tt.design.presetNames.lilac,
    tt.design.presetNames.dawn,
    tt.design.presetNames.coral,
    tt.design.presetNames.emerald,
    tt.design.presetNames.rocky,
    tt.design.presetNames.nile,
    tt.design.presetNames.cocoa,
    tt.design.presetNames.rose,
  ];

  const handleFontUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validExtensions = ['.ttf', '.otf', '.woff', '.woff2'];
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validExtensions.includes(extension)) {
      toast.error(tt.validation.invalidFontExtension);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(tt.validation.fileTooLarge5mb);
      return;
    }

    const fontName = file.name.replace(/\.[^.]+$/, '');
    const uploaded = await onAddCustomFont(fontName, file);
    if (!uploaded) {
      event.target.value = '';
      return;
    }

    onUpdate(fontTarget.current === 'heading' ? { headingFont: fontName } : { bodyFont: fontName });
    toast.success(tt.design.customFontAdded.replace('{name}', fontName));
    event.target.value = '';
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

  const customFontFaces = state.customFonts
    .map(font => {
      const format = getFontFormat(font.url);

      return `
      @font-face {
        font-family: '${font.name}';
        src: url('/api/template/fonts/get?id=${font.id}')${format ? ` format('${format}')` : ''};
        font-weight: 100 900;
        font-style: normal;
        font-display: swap;
      }
    `;
    })
    .join('\n');

  return (
    <div className={`${templateEditorFontVariables} space-y-4`}>
      {customFontFaces && <style dangerouslySetInnerHTML={{ __html: customFontFaces }} />}

      <div className="bg-card border-border rounded-2xl border p-4">
        <p className="text-foreground mb-3 text-xs font-semibold">{tt.design.colors}</p>

        <div className="mb-4 grid grid-cols-4 gap-2">
          {COLOR_PRESETS.map((preset, index) => {
            const isSelected = !state.useCustomColors && state.selectedPreset === index;

            return (
              <button
                key={PRESET_KEYS[index]}
                onClick={() =>
                  onUpdate({
                    selectedPreset: index,
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

                <p className="text-foreground text-[9px] font-semibold">{presetLabels[index]}</p>
              </button>
            );
          })}
        </div>

        <div className="border-border/50 flex items-center justify-between border-t py-2">
          <span className="text-muted-foreground text-xs">{tt.design.customColors}</span>
          <Switch
            checked={state.useCustomColors}
            onCheckedChange={value => onUpdate({ useCustomColors: value })}
          />
        </div>

        {state.useCustomColors && (
          <div className="grid grid-cols-2 gap-2 pt-2">
            <ColorPicker
              label={tt.design.primaryColor}
              value={state.colorPrimary}
              onChange={value => onUpdate({ colorPrimary: value })}
            />
            <ColorPicker
              label={tt.design.secondaryColor}
              value={state.colorAccent}
              onChange={value => onUpdate({ colorAccent: value })}
            />
            <ColorPicker
              label={tt.design.backgroundColor}
              value={state.colorBg}
              onChange={value => onUpdate({ colorBg: value })}
            />
            <ColorPicker
              label={tt.design.textColor}
              value={state.colorText}
              onChange={value => onUpdate({ colorText: value })}
            />
          </div>
        )}
      </div>

      <div className="bg-card border-border rounded-2xl border p-4">
        <p className="text-foreground mb-3 text-xs font-semibold">{tt.design.fonts}</p>

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
                  style={{ fontFamily: resolveTemplateFontFamily(font.name) }}
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
            label={tt.design.headingFont}
            value={state.headingFont}
            options={allFonts}
            onChange={value => onUpdate({ headingFont: value })}
            onUploadClick={() => triggerFontUpload('heading')}
          />

          <FontPicker
            label={tt.design.bodyFont}
            value={state.bodyFont}
            options={allFonts}
            onChange={value => onUpdate({ bodyFont: value })}
            onUploadClick={() => triggerFontUpload('body')}
          />
        </div>
      </div>

      <div className="border-border overflow-hidden rounded-2xl border">
        <div className="p-4" style={{ backgroundColor: previewColors.bg }}>
          <p
            className="mb-1 text-sm font-bold"
            style={{
              color: previewColors.text,
              fontFamily: resolveTemplateFontFamily(state.headingFont),
            }}
          >
            {storeName}
          </p>
          <p
            className="mb-3 text-xs"
            style={{
              color: `${previewColors.text}88`,
              fontFamily: resolveTemplateFontFamily(state.bodyFont),
            }}
          >
            {state.tagline}
          </p>
          <div className="flex gap-2">
            <div
              className="rounded-xl px-4 py-2 text-[11px] font-bold text-white"
              style={{
                backgroundColor: previewColors.primary,
                fontFamily: resolveTemplateFontFamily(state.bodyFont),
              }}
            >
              {state.heroButtonText}
            </div>
            <div
              className="rounded-xl border px-4 py-2 text-[11px]"
              style={{
                borderColor: `${previewColors.text}20`,
                color: previewColors.text,
                fontFamily: resolveTemplateFontFamily(state.bodyFont),
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
