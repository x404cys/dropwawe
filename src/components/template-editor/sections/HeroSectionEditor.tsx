'use client';

import { useMemo, useRef, useState, useCallback } from 'react';
import {
  BarChart3,
  ChevronDown,
  Image as ImageIcon,
  LayoutTemplate,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type {
  HeroFeatureItem,
  HeroSectionItem,
  HeroStatItem,
  HeroTrustItem,
} from '@/lib/template/types';

interface HeroSectionEditorProps {
  value?: HeroSectionItem | null;
  onChange: (value: HeroSectionItem) => void;
}

const createId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;

const DEFAULT_HERO: HeroSectionItem = {
  id: 'hero_default',
  enabled: true,
  visible: true,
  order: 0,

  badgeText: '',
  badgeIcon: '',
  overline: '',
  title: '',
  highlightText: '',
  subtitle: '',
  description: '',

  trustText: '',
  smallNote: '',

  primaryButtonText: '',
  primaryButtonLink: '',
  primaryButtonIcon: '',

  secondaryButtonText: '',
  secondaryButtonLink: '',
  secondaryButtonIcon: '',

  heroImage: null,
  heroImageAlt: '',
  heroImageMobile: null,

  backgroundType: 'COLOR',
  backgroundImage: null,
  backgroundImageMobile: null,
  backgroundColor: '#0f172a',
  backgroundGradientFrom: '#111827',
  backgroundGradientVia: '#0f172a',
  backgroundGradientTo: '#1d4ed8',

  overlayEnabled: true,
  overlayColor: '#000000',
  overlayOpacity: 35,

  layout: 'SPLIT',
  contentAlign: 'center',
  contentPosition: 'center',
  mediaPosition: 'right',

  contentMaxWidth: '640px',
  sectionHeight: 'lg',
  containerStyle: 'boxed',
  verticalPadding: 'lg',

  showButtons: true,
  showStats: true,
  showFeatures: false,
  showTrustItems: true,

  roundedMedia: true,
  glassEffect: false,
  blurBackground: false,
  shadowMedia: true,
  borderMedia: false,

  promoText: '',
  promoEndsAt: null,
  urgencyText: '',

  ariaLabel: '',
  sectionId: 'hero',

  stats: [],
  features: [],
  trustItems: [],
};

function mergeHero(value?: HeroSectionItem | null): HeroSectionItem {
  return {
    ...DEFAULT_HERO,
    ...value,
    stats: value?.stats ?? [],
    features: value?.features ?? [],
    trustItems: value?.trustItems ?? [],
  };
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${
        checked
          ? 'border-primary/30 bg-primary/10 text-foreground'
          : 'border-border bg-background text-muted-foreground'
      }`}
    >
      <span>{label}</span>
      <span
        className={`h-5 w-9 rounded-full p-0.5 transition ${checked ? 'bg-primary' : 'bg-muted'}`}
      >
        <span
          className={`block h-4 w-4 rounded-full bg-white transition ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </span>
    </button>
  );
}

function SectionTitle({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mb-3 flex items-start gap-2">
      <div className="bg-primary/10 text-primary mt-0.5 rounded-xl p-2">{icon}</div>
      <div>
        <h4 className="text-sm font-semibold">{title}</h4>
        {desc ? <p className="text-muted-foreground text-xs">{desc}</p> : null}
      </div>
    </div>
  );
}

function EditorSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-card border-border overflow-hidden rounded-2xl border">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="hover:bg-muted/40 flex w-full items-center justify-between px-4 py-3 text-right transition"
      >
        <span className="text-sm font-semibold">{title}</span>
        <ChevronDown
          className={`text-muted-foreground h-4 w-4 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && <div className="border-border border-t p-4">{children}</div>}
    </div>
  );
}

export default function HeroSectionEditor({ value, onChange }: HeroSectionEditorProps) {
  const hero = useMemo(() => mergeHero(value), [value]);

  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const bgImageInputRef = useRef<HTMLInputElement>(null);
  const mobileHeroImageInputRef = useRef<HTMLInputElement>(null);
  const mobileBgImageInputRef = useRef<HTMLInputElement>(null);

  const patch = (fields: Partial<HeroSectionItem>) => {
    onChange({ ...hero, ...fields });
  };

  const patchStat = (id: string, fields: Partial<HeroStatItem>) => {
    patch({
      stats: hero.stats.map(item => (item.id === id ? { ...item, ...fields } : item)),
    });
  };

  const patchFeature = (id: string, fields: Partial<HeroFeatureItem>) => {
    patch({
      features: hero.features.map(item => (item.id === id ? { ...item, ...fields } : item)),
    });
  };

  const patchTrust = (id: string, fields: Partial<HeroTrustItem>) => {
    patch({
      trustItems: hero.trustItems.map(item => (item.id === id ? { ...item, ...fields } : item)),
    });
  };

  const removeStat = (id: string) => {
    patch({ stats: hero.stats.filter(item => item.id !== id) });
  };

  const removeFeature = (id: string) => {
    patch({ features: hero.features.filter(item => item.id !== id) });
  };

  const removeTrust = (id: string) => {
    patch({ trustItems: hero.trustItems.filter(item => item.id !== id) });
  };

  const addStat = () => {
    patch({
      stats: [
        ...hero.stats,
        {
          id: createId('stat'),
          label: '',
          value: '',
          icon: '',
          order: hero.stats.length,
          enabled: true,
        },
      ],
    });
  };

  const addFeature = () => {
    patch({
      features: [
        ...hero.features,
        {
          id: createId('feature'),
          title: '',
          desc: '',
          icon: '',
          image: null,
          link: '',
          order: hero.features.length,
          enabled: true,
        },
      ],
    });
  };

  const addTrust = () => {
    patch({
      trustItems: [
        ...hero.trustItems,
        {
          id: createId('trust'),
          text: '',
          icon: '',
          order: hero.trustItems.length,
          enabled: true,
        },
      ],
    });
  };

  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const uploadImage = useCallback(
    async (
      file: File,
      field: 'heroImage' | 'heroImageMobile' | 'backgroundImage' | 'backgroundImageMobile'
    ) => {
      setUploadingField(field);
      try {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch('/api/storev2/upload-image', {
          method: 'POST',
          body: formData,
        });

        const data = (await res.json()) as { url?: string; error?: string };

        if (!res.ok || !data.url) {
          throw new Error(data.error ?? 'فشل رفع الصورة');
        }

        patch({ [field]: data.url });
      } catch (err) {
        console.error('Upload error:', err);
        alert(err instanceof Error ? err.message : 'فشل رفع الصورة');
      } finally {
        setUploadingField(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hero]
  );

  return (
    <div className="space-y-4">
      <input
        ref={heroImageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (!file) return;
          uploadImage(file, 'heroImage');
          e.target.value = '';
        }}
      />

      <input
        ref={mobileHeroImageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (!file) return;
          uploadImage(file, 'heroImageMobile');
          e.target.value = '';
        }}
      />

      <input
        ref={bgImageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (!file) return;
          uploadImage(file, 'backgroundImage');
          e.target.value = '';
        }}
      />

      <input
        ref={mobileBgImageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (!file) return;
          uploadImage(file, 'backgroundImageMobile');
          e.target.value = '';
        }}
      />

      <EditorSection title="المحتوى الرئيسي" defaultOpen>
        <SectionTitle
          icon={<Sparkles className="h-4 w-4" />}
          title="المحتوى الرئيسي"
          desc="النصوص الأساسية التي تظهر داخل الهيرو"
        />

        <div className="space-y-3">
          <Input
            value={hero.badgeText ?? ''}
            onChange={e => patch({ badgeText: e.target.value })}
            placeholder="Badge text"
            className="rounded-xl"
          />
          <Input
            value={hero.overline ?? ''}
            onChange={e => patch({ overline: e.target.value })}
            placeholder="Overline"
            className="rounded-xl"
          />
          <Input
            value={hero.title ?? ''}
            onChange={e => patch({ title: e.target.value })}
            placeholder="العنوان الرئيسي"
            className="rounded-xl"
          />
          <Input
            value={hero.highlightText ?? ''}
            onChange={e => patch({ highlightText: e.target.value })}
            placeholder="النص المميز داخل العنوان"
            className="rounded-xl"
          />
          <Input
            value={hero.subtitle ?? ''}
            onChange={e => patch({ subtitle: e.target.value })}
            placeholder="Subtitle"
            className="rounded-xl"
          />
          <Textarea
            value={hero.description ?? ''}
            onChange={e => patch({ description: e.target.value })}
            placeholder="وصف الهيرو"
            rows={4}
            className="resize-none rounded-xl"
          />
          <Input
            value={hero.trustText ?? ''}
            onChange={e => patch({ trustText: e.target.value })}
            placeholder="نص ثقة مختصر"
            className="rounded-xl"
          />
          <Input
            value={hero.smallNote ?? ''}
            onChange={e => patch({ smallNote: e.target.value })}
            placeholder="ملاحظة صغيرة أسفل النص"
            className="rounded-xl"
          />
        </div>
      </EditorSection>

      <EditorSection title="التخطيط والعرض">
        <SectionTitle
          icon={<LayoutTemplate className="h-4 w-4" />}
          title="التخطيط والعرض"
          desc="تحكم بشكل ظهور الهيرو"
        />

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-muted-foreground text-xs">Layout</span>
            <select
              value={hero.layout}
              onChange={e => patch({ layout: e.target.value as HeroSectionItem['layout'] })}
              className="bg-background border-border h-10 w-full rounded-xl border px-3 text-sm outline-none"
            >
              <option value="CENTERED">Centered</option>
              <option value="SPLIT">Split</option>
              <option value="IMAGE_LEFT">Image Left</option>
              <option value="IMAGE_RIGHT">Image Right</option>
              <option value="MINIMAL">Minimal</option>
              <option value="FULLSCREEN">Fullscreen</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-muted-foreground text-xs">Content Align</span>
            <select
              value={hero.contentAlign}
              onChange={e =>
                patch({ contentAlign: e.target.value as HeroSectionItem['contentAlign'] })
              }
              className="bg-background border-border h-10 w-full rounded-xl border px-3 text-sm outline-none"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-muted-foreground text-xs">Content Position</span>
            <select
              value={hero.contentPosition}
              onChange={e =>
                patch({
                  contentPosition: e.target.value as HeroSectionItem['contentPosition'],
                })
              }
              className="bg-background border-border h-10 w-full rounded-xl border px-3 text-sm outline-none"
            >
              <option value="start">Start</option>
              <option value="center">Center</option>
              <option value="end">End</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-muted-foreground text-xs">Media Position</span>
            <select
              value={hero.mediaPosition}
              onChange={e =>
                patch({ mediaPosition: e.target.value as HeroSectionItem['mediaPosition'] })
              }
              className="bg-background border-border h-10 w-full rounded-xl border px-3 text-sm outline-none"
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-muted-foreground text-xs">Section Height</span>
            <select
              value={hero.sectionHeight ?? 'lg'}
              onChange={e =>
                patch({ sectionHeight: e.target.value as HeroSectionItem['sectionHeight'] })
              }
              className="bg-background border-border h-10 w-full rounded-xl border px-3 text-sm outline-none"
            >
              <option value="auto">Auto</option>
              <option value="sm">SM</option>
              <option value="md">MD</option>
              <option value="lg">LG</option>
              <option value="xl">XL</option>
              <option value="screen">Screen</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-muted-foreground text-xs">Container Style</span>
            <select
              value={hero.containerStyle ?? 'boxed'}
              onChange={e =>
                patch({
                  containerStyle: e.target.value as HeroSectionItem['containerStyle'],
                })
              }
              className="bg-background border-border h-10 w-full rounded-xl border px-3 text-sm outline-none"
            >
              <option value="boxed">Boxed</option>
              <option value="full">Full</option>
            </select>
          </label>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Toggle checked={hero.enabled} onChange={next => patch({ enabled: next })} label="مفعل" />
          <Toggle checked={hero.visible} onChange={next => patch({ visible: next })} label="ظاهر" />
          <Toggle
            checked={hero.showButtons}
            onChange={next => patch({ showButtons: next })}
            label="إظهار الأزرار"
          />
          <Toggle
            checked={hero.showStats}
            onChange={next => patch({ showStats: next })}
            label="إظهار الإحصائيات"
          />
          <Toggle
            checked={hero.showFeatures}
            onChange={next => patch({ showFeatures: next })}
            label="إظهار المميزات"
          />
          <Toggle
            checked={hero.showTrustItems}
            onChange={next => patch({ showTrustItems: next })}
            label="إظهار عناصر الثقة"
          />
          <Toggle
            checked={hero.roundedMedia}
            onChange={next => patch({ roundedMedia: next })}
            label="حواف دائرية للميديا"
          />
          <Toggle
            checked={hero.shadowMedia}
            onChange={next => patch({ shadowMedia: next })}
            label="ظل للميديا"
          />
        </div>
      </EditorSection>

      <EditorSection title="الأزرار">
        <SectionTitle
          icon={<Sparkles className="h-4 w-4" />}
          title="الأزرار"
          desc="الأزرار الرئيسية والثانوية داخل الهيرو"
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-2xl border p-3">
            <p className="text-sm font-medium">Primary Button</p>
            <Input
              value={hero.primaryButtonText ?? ''}
              onChange={e => patch({ primaryButtonText: e.target.value })}
              placeholder="نص الزر الرئيسي"
              className="rounded-xl"
            />
            <Input
              value={hero.primaryButtonLink ?? ''}
              onChange={e => patch({ primaryButtonLink: e.target.value })}
              placeholder="رابط الزر الرئيسي"
              className="rounded-xl"
            />
            <Input
              value={hero.primaryButtonIcon ?? ''}
              onChange={e => patch({ primaryButtonIcon: e.target.value })}
              placeholder="اسم الأيقونة"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-3 rounded-2xl border p-3">
            <p className="text-sm font-medium">Secondary Button</p>
            <Input
              value={hero.secondaryButtonText ?? ''}
              onChange={e => patch({ secondaryButtonText: e.target.value })}
              placeholder="نص الزر الثانوي"
              className="rounded-xl"
            />
            <Input
              value={hero.secondaryButtonLink ?? ''}
              onChange={e => patch({ secondaryButtonLink: e.target.value })}
              placeholder="رابط الزر الثانوي"
              className="rounded-xl"
            />
            <Input
              value={hero.secondaryButtonIcon ?? ''}
              onChange={e => patch({ secondaryButtonIcon: e.target.value })}
              placeholder="اسم الأيقونة"
              className="rounded-xl"
            />
          </div>
        </div>
      </EditorSection>

      <EditorSection title="صور الهيرو">
        <SectionTitle
          icon={<ImageIcon className="h-4 w-4" />}
          title="صور الهيرو"
          desc="الصورة الرئيسية وصورة الموبايل"
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="rounded-2xl border p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium">Hero Image</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => heroImageInputRef.current?.click()}
                    disabled={!!uploadingField}
                    className="rounded-xl border px-3 py-1.5 text-sm disabled:opacity-50"
                  >
                    <Upload className="mr-1 inline h-4 w-4" />
                    {uploadingField === 'heroImage' ? 'جاري الرفع...' : 'رفع'}
                  </button>
                  {!!hero.heroImage && (
                    <button
                      type="button"
                      onClick={() => patch({ heroImage: null })}
                      className="text-destructive rounded-xl border px-3 py-1.5 text-sm"
                    >
                      <Trash2 className="mr-1 inline h-4 w-4" />
                      حذف
                    </button>
                  )}
                </div>
              </div>

              {hero.heroImage ? (
                <img src={hero.heroImage} alt="" className="h-40 w-full rounded-2xl object-cover" />
              ) : (
                <div className="text-muted-foreground bg-muted/40 flex h-40 items-center justify-center rounded-2xl border border-dashed text-sm">
                  لا توجد صورة
                </div>
              )}
            </div>

            <Input
              value={hero.heroImageAlt ?? ''}
              onChange={e => patch({ heroImageAlt: e.target.value })}
              placeholder="Alt text للصورة"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium">Mobile Hero Image</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => mobileHeroImageInputRef.current?.click()}
                    disabled={!!uploadingField}
                    className="rounded-xl border px-3 py-1.5 text-sm disabled:opacity-50"
                  >
                    <Upload className="mr-1 inline h-4 w-4" />
                    {uploadingField === 'heroImageMobile' ? 'جاري الرفع...' : 'رفع'}
                  </button>
                  {!!hero.heroImageMobile && (
                    <button
                      type="button"
                      onClick={() => patch({ heroImageMobile: null })}
                      className="text-destructive rounded-xl border px-3 py-1.5 text-sm"
                    >
                      <Trash2 className="mr-1 inline h-4 w-4" />
                      حذف
                    </button>
                  )}
                </div>
              </div>

              {hero.heroImageMobile ? (
                <img
                  src={hero.heroImageMobile}
                  alt=""
                  className="h-32 w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="text-muted-foreground bg-muted/40 flex h-32 items-center justify-center rounded-2xl border border-dashed text-sm">
                  لا توجد صورة موبايل
                </div>
              )}
            </div>
          </div>
        </div>
      </EditorSection>

      <EditorSection title="الخلفية والـ Overlay">
        <SectionTitle
          icon={<ImageIcon className="h-4 w-4" />}
          title="الخلفية والـ Overlay"
          desc="التحكم بالخلفية والألوان"
        />

        <div className="space-y-3">
          <label className="space-y-1">
            <span className="text-muted-foreground text-xs">Background Type</span>
            <select
              value={hero.backgroundType}
              onChange={e =>
                patch({
                  backgroundType: e.target.value as HeroSectionItem['backgroundType'],
                })
              }
              className="bg-background border-border h-10 w-full rounded-xl border px-3 text-sm outline-none"
            >
              <option value="COLOR">Color</option>
              <option value="IMAGE">Image</option>
              <option value="VIDEO">Video</option>
              <option value="GRADIENT">Gradient</option>
            </select>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              type="color"
              value={hero.backgroundColor || '#0f172a'}
              onChange={e => patch({ backgroundColor: e.target.value })}
              className="h-11 rounded-xl"
            />
            <Input
              type="color"
              value={hero.overlayColor || '#000000'}
              onChange={e => patch({ overlayColor: e.target.value })}
              className="h-11 rounded-xl"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              type="color"
              value={hero.backgroundGradientFrom || '#111827'}
              onChange={e => patch({ backgroundGradientFrom: e.target.value })}
              className="h-11 rounded-xl"
            />
            <Input
              type="color"
              value={hero.backgroundGradientVia || '#0f172a'}
              onChange={e => patch({ backgroundGradientVia: e.target.value })}
              className="h-11 rounded-xl"
            />
            <Input
              type="color"
              value={hero.backgroundGradientTo || '#1d4ed8'}
              onChange={e => patch({ backgroundGradientTo: e.target.value })}
              className="h-11 rounded-xl"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => bgImageInputRef.current?.click()}
              disabled={!!uploadingField}
              className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50"
            >
              <Upload className="mr-1 inline h-4 w-4" />
              {uploadingField === 'backgroundImage' ? 'جاري الرفع...' : 'رفع صورة خلفية'}
            </button>

            <button
              type="button"
              onClick={() => mobileBgImageInputRef.current?.click()}
              disabled={!!uploadingField}
              className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50"
            >
              <Upload className="mr-1 inline h-4 w-4" />
              {uploadingField === 'backgroundImageMobile' ? 'جاري الرفع...' : 'رفع خلفية موبايل'}
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {hero.backgroundImage ? (
              <img
                src={hero.backgroundImage}
                alt=""
                className="h-28 w-full rounded-2xl object-cover"
              />
            ) : (
              <div className="text-muted-foreground bg-muted/40 flex h-28 items-center justify-center rounded-2xl border border-dashed text-sm">
                لا توجد خلفية
              </div>
            )}

            {hero.backgroundImageMobile ? (
              <img
                src={hero.backgroundImageMobile}
                alt=""
                className="h-28 w-full rounded-2xl object-cover"
              />
            ) : (
              <div className="text-muted-foreground bg-muted/40 flex h-28 items-center justify-center rounded-2xl border border-dashed text-sm">
                لا توجد خلفية موبايل
              </div>
            )}
          </div>

          <Input
            type="number"
            min={0}
            max={100}
            value={hero.overlayOpacity}
            onChange={e => patch({ overlayOpacity: Number(e.target.value || 0) })}
            placeholder="Overlay opacity"
            className="rounded-xl"
          />

          <div className="grid gap-2 sm:grid-cols-2">
            <Toggle
              checked={hero.overlayEnabled}
              onChange={next => patch({ overlayEnabled: next })}
              label="تفعيل Overlay"
            />
            <Toggle
              checked={hero.blurBackground}
              onChange={next => patch({ blurBackground: next })}
              label="Blur للخلفية"
            />
            <Toggle
              checked={hero.glassEffect}
              onChange={next => patch({ glassEffect: next })}
              label="Glass effect"
            />
            <Toggle
              checked={hero.borderMedia}
              onChange={next => patch({ borderMedia: next })}
              label="Border للميديا"
            />
          </div>
        </div>
      </EditorSection>

      <EditorSection title="الإحصائيات">
        <SectionTitle
          icon={<BarChart3 className="h-4 w-4" />}
          title="الإحصائيات"
          desc="مثل عدد العملاء أو المنتجات أو الطلبات"
        />

        <div className="space-y-3">
          {hero.stats.map(item => (
            <div key={item.id} className="grid gap-2 rounded-2xl border p-3 md:grid-cols-5">
              <Input
                value={item.value}
                onChange={e => patchStat(item.id, { value: e.target.value })}
                placeholder="القيمة"
                className="rounded-xl"
              />
              <Input
                value={item.label}
                onChange={e => patchStat(item.id, { label: e.target.value })}
                placeholder="النص"
                className="rounded-xl"
              />
              <Input
                value={item.icon ?? ''}
                onChange={e => patchStat(item.id, { icon: e.target.value })}
                placeholder="الأيقونة"
                className="rounded-xl"
              />
              <Input
                type="number"
                value={item.order}
                onChange={e => patchStat(item.id, { order: Number(e.target.value || 0) })}
                placeholder="الترتيب"
                className="rounded-xl"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => patchStat(item.id, { enabled: !item.enabled })}
                  className="rounded-xl border px-3 py-2 text-sm"
                >
                  {item.enabled ? 'مفعل' : 'معطل'}
                </button>
                <button
                  type="button"
                  onClick={() => removeStat(item.id)}
                  className="text-destructive rounded-xl border px-3 py-2 text-sm"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addStat}
            className="rounded-xl border border-dashed px-4 py-2 text-sm"
          >
            <Plus className="mr-1 inline h-4 w-4" />
            إضافة إحصائية
          </button>
        </div>
      </EditorSection>

      <EditorSection title="المميزات">
        <SectionTitle
          icon={<Sparkles className="h-4 w-4" />}
          title="المميزات"
          desc="أبرز مميزات المتجر داخل الهيرو"
        />

        <div className="space-y-3">
          {hero.features.map(item => (
            <div key={item.id} className="space-y-2 rounded-2xl border p-3">
              <div className="grid gap-2 md:grid-cols-4">
                <Input
                  value={item.title}
                  onChange={e => patchFeature(item.id, { title: e.target.value })}
                  placeholder="العنوان"
                  className="rounded-xl"
                />
                <Input
                  value={item.icon ?? ''}
                  onChange={e => patchFeature(item.id, { icon: e.target.value })}
                  placeholder="الأيقونة"
                  className="rounded-xl"
                />
                <Input
                  value={item.link ?? ''}
                  onChange={e => patchFeature(item.id, { link: e.target.value })}
                  placeholder="الرابط"
                  className="rounded-xl"
                />
                <Input
                  type="number"
                  value={item.order}
                  onChange={e => patchFeature(item.id, { order: Number(e.target.value || 0) })}
                  placeholder="الترتيب"
                  className="rounded-xl"
                />
              </div>

              <Textarea
                value={item.desc ?? ''}
                onChange={e => patchFeature(item.id, { desc: e.target.value })}
                placeholder="الوصف"
                rows={2}
                className="resize-none rounded-xl"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => patchFeature(item.id, { enabled: !item.enabled })}
                  className="rounded-xl border px-3 py-2 text-sm"
                >
                  {item.enabled ? 'مفعل' : 'معطل'}
                </button>
                <button
                  type="button"
                  onClick={() => removeFeature(item.id)}
                  className="text-destructive rounded-xl border px-3 py-2 text-sm"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addFeature}
            className="rounded-xl border border-dashed px-4 py-2 text-sm"
          >
            <Plus className="mr-1 inline h-4 w-4" />
            إضافة ميزة
          </button>
        </div>
      </EditorSection>

      <EditorSection title="عناصر الثقة">
        <SectionTitle
          icon={<ShieldCheck className="h-4 w-4" />}
          title="عناصر الثقة"
          desc="مثل دفع آمن، توصيل سريع، ضمان جودة"
        />

        <div className="space-y-3">
          {hero.trustItems.map(item => (
            <div key={item.id} className="grid gap-2 rounded-2xl border p-3 md:grid-cols-4">
              <Input
                value={item.text}
                onChange={e => patchTrust(item.id, { text: e.target.value })}
                placeholder="النص"
                className="rounded-xl md:col-span-2"
              />
              <Input
                value={item.icon ?? ''}
                onChange={e => patchTrust(item.id, { icon: e.target.value })}
                placeholder="الأيقونة"
                className="rounded-xl"
              />
              <Input
                type="number"
                value={item.order}
                onChange={e => patchTrust(item.id, { order: Number(e.target.value || 0) })}
                placeholder="الترتيب"
                className="rounded-xl"
              />

              <div className="flex gap-2 md:col-span-4">
                <button
                  type="button"
                  onClick={() => patchTrust(item.id, { enabled: !item.enabled })}
                  className="rounded-xl border px-3 py-2 text-sm"
                >
                  {item.enabled ? 'مفعل' : 'معطل'}
                </button>
                <button
                  type="button"
                  onClick={() => removeTrust(item.id)}
                  className="text-destructive rounded-xl border px-3 py-2 text-sm"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addTrust}
            className="rounded-xl border border-dashed px-4 py-2 text-sm"
          >
            <Plus className="mr-1 inline h-4 w-4" />
            إضافة عنصر ثقة
          </button>
        </div>
      </EditorSection>
    </div>
  );
}
