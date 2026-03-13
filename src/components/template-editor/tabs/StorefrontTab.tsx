'use client';
// src/components/template-editor/tabs/StorefrontTab.tsx
// Storefront (المتجر) tab — announcement bar, banners, category display mode,
// category icons, and category sections (horizontal rows).

import { useRef } from 'react';
import {
  Megaphone,
  Package,
  GripVertical,
  Trash2,
  Upload,
  X,
  ChevronDown,
  Sparkles,
  Star,
  Palette,
  Camera,
  Monitor,
  Code,
  PenTool,
  Shirt,
  Watch,
  Smartphone,
  Footprints,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import AddButton from '../ui/AddButton';
import type {
  TemplateFormState,
  AnnouncementBarConfig,
  CategoryIconItem,
} from '@/lib/template/types';
import Image from 'next/image'; // ── Icon map for category icons ──────────────────────────────────────────────

const CATEGORY_ICON_OPTIONS = [
  'Package',
  'Shirt',
  'Sparkles',
  'Watch',
  'Smartphone',
  'Footprints',
  'Star',
  'Palette',
  'Camera',
  'Monitor',
  'Code',
  'PenTool',
] as const;

type CategoryIconName = (typeof CATEGORY_ICON_OPTIONS)[number];

const ICON_MAP: Record<CategoryIconName, React.ElementType> = {
  Package,
  Shirt,
  Sparkles,
  Watch,
  Smartphone,
  Footprints,
  Star,
  Palette,
  Camera,
  Monitor,
  Code,
  PenTool,
};

function getCategoryIcon(name: string): React.ElementType {
  return ICON_MAP[name as CategoryIconName] ?? Package;
}

// ── Props ────────────────────────────────────────────────────────────────────

interface StorefrontTabProps {
  state: TemplateFormState;
  categories: string[]; // from store inventory
  onUpdate: (partial: Partial<TemplateFormState>) => void;
  onAddBanner: (file: File) => void;
  onRemoveBanner: (id: string) => void;
  onUpdatePostionBanner: (id: string, position: string) => void;
  onAddCategorySection: (category: string) => void;
  onUpdateCategorySection: (id: string, category: string) => void;
  onToggleCategorySection: (id: string) => void;
  onMoveCategorySection: (index: number, direction: -1 | 1) => void;
  onRemoveCategorySection: (id: string) => void;
  onUpdateCategoryIcon: (id: string, fields: Partial<Omit<CategoryIconItem, 'id'>>) => void;
}

export default function StorefrontTab({
  state,
  categories,
  onUpdate,
  onAddBanner,
  onRemoveBanner,
  onAddCategorySection,
  onUpdateCategorySection,
  onUpdatePostionBanner,
  onToggleCategorySection,
  onMoveCategorySection,
  onRemoveCategorySection,
  onUpdateCategoryIcon,
}: StorefrontTabProps) {
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const categoryImageInputRef = useRef<HTMLInputElement>(null);
  const categoryImageTarget = useRef<string>('');

  const updateBar = (partial: Partial<AnnouncementBarConfig>) =>
    onUpdate({ announcementBar: { ...state.announcementBar, ...partial } });

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الملف كبير — الحد الأقصى 5MB');
      return;
    }
    onAddBanner(file);
    toast.success('تم إضافة البنر');
    e.target.value = '';
  };

  const handleCategoryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('حجم الملف كبير — الحد الأقصى 2MB');
      return;
    }
    const icId = categoryImageTarget.current;
    const reader = new FileReader();
    reader.onloadend = () => {
      // find the icon by its id (we store id in the ref)
      onUpdateCategoryIcon(icId, { image: reader.result as string });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const addCategorySection = () => {
    const usedCats = state.categorySections.map(cs => cs.category);
    const available = categories.find(c => !usedCats.includes(c)) ?? 'قسم جديد';
    onAddCategorySection(available);
  };

  return (
    <div className="space-y-4">
      <input
        ref={bannerInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleBannerUpload}
      />
      <input
        ref={categoryImageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleCategoryImageUpload}
      />

      {/* Announcement Bar */}
      <div className="bg-card border-border rounded-2xl border p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="text-primary h-4 w-4" />
            <p className="text-foreground text-xs font-semibold">شريط الإعلان</p>
          </div>
          <Switch
            checked={state.announcementBar.enabled}
            onCheckedChange={v => updateBar({ enabled: v })}
          />
        </div>
        {state.announcementBar.enabled && (
          <div className="space-y-2">
            <Input
              value={state.announcementBar.text}
              onChange={e => updateBar({ text: e.target.value })}
              className="rounded-xl"
              placeholder="نص الإعلان..."
            />
            <div className="flex gap-2">
              <div className="bg-muted/20 flex flex-1 items-center gap-2 rounded-xl p-2">
                <input
                  type="color"
                  value={state.announcementBar.bgColor}
                  onChange={e => updateBar({ bgColor: e.target.value })}
                  className="h-7 w-7 cursor-pointer rounded-lg border-0 bg-transparent"
                />
                <p className="text-muted-foreground text-[10px]">لون الخلفية</p>
              </div>
              <div className="bg-muted/20 flex flex-1 items-center gap-2 rounded-xl p-2">
                <input
                  type="color"
                  value={state.announcementBar.textColor}
                  onChange={e => updateBar({ textColor: e.target.value })}
                  className="h-7 w-7 cursor-pointer rounded-lg border-0 bg-transparent"
                />
                <p className="text-muted-foreground text-[10px]">لون النص</p>
              </div>
            </div>
            {/* Preview */}
            <div className="overflow-hidden rounded-xl">
              <div
                className="px-3 py-2 text-center text-xs font-semibold"
                style={{
                  backgroundColor: state.announcementBar.bgColor,
                  color: state.announcementBar.textColor,
                }}
              >
                {state.announcementBar.text}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-card border-border rounded-2xl border p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-foreground text-xs font-semibold">صور البنر</p>
          </div>
          <span className="text-muted-foreground text-[10px]">
            {state.bannerImages.length} صورة
          </span>
        </div>
        <div className="space-y-2">
          {state.bannerImages.map((img, i) => (
            <div
              key={img.id}
              className="border-border relative h-24 w-full overflow-hidden rounded-xl border"
            >
              <Image src={img.url as string} alt="banner" fill className="object-cover" />

              <button
                onClick={() => onRemoveBanner(img.id)}
                className="bg-destructive/90 absolute top-2 left-2 z-10 flex h-6 w-6 items-center justify-center rounded-full"
              >
                <X className="text-destructive-foreground h-3 w-3" />
              </button>

              <span className="bg-foreground/60 text-background absolute top-2 right-2 z-10 rounded-full px-2 py-0.5 text-[9px] font-bold">
                {i + 1}
              </span>

              <div className="absolute right-2 bottom-2 z-10">
                <Select
                  value={img.postion || 'top'}
                  onValueChange={value => onUpdatePostionBanner(img.id, value)}
                >
                  <SelectTrigger className="h-8 w-[130px] text-[10px]">
                    <SelectValue placeholder="اختر مكان البنر" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="top">اعلى المتجر</SelectItem>
                    <SelectItem value="center">مع الاصناف</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}

          <button
            onClick={() => bannerInputRef.current?.click()}
            className="border-border text-muted-foreground hover:border-primary/30 hover:text-primary flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed py-4 text-xs font-medium transition-all"
          >
            <Upload className="h-4 w-4" /> إضافة صورة بنر
          </button>
          <p className="text-muted-foreground text-center text-[10px]">
            الحد الأقصى 5MB لكل صورة • يفضل 1200×400
          </p>
        </div>
      </div>

      {/* Category Display Mode */}
      <div className="bg-card border-border rounded-2xl border p-4">
        <div className="mb-3 flex items-center gap-2">
          <Package className="text-primary h-4 w-4" />
          <p className="text-foreground text-xs font-semibold">عرض الأقسام</p>
        </div>
        <div className="mb-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => onUpdate({ categoryDisplayMode: 'icons' })}
            className={`rounded-xl border-2 p-3 text-center transition-all ${
              state.categoryDisplayMode === 'icons'
                ? 'border-primary bg-primary/5'
                : 'border-border'
            }`}
          >
            <Package className="mx-auto mb-1 h-5 w-5" />
            <p className="text-foreground text-[10px] font-bold">أيقونات</p>
            <p className="text-muted-foreground text-[9px]">مع صور أو رموز</p>
          </button>
          <button
            onClick={() => onUpdate({ categoryDisplayMode: 'pills' })}
            className={`rounded-xl border-2 p-3 text-center transition-all ${
              state.categoryDisplayMode === 'pills'
                ? 'border-primary bg-primary/5'
                : 'border-border'
            }`}
          >
            <div className="mb-1 flex justify-center gap-1">
              <span className="bg-primary/20 rounded-full px-2 py-0.5 text-[8px]">قسم</span>
              <span className="bg-muted rounded-full px-2 py-0.5 text-[8px]">قسم</span>
            </div>
            <p className="text-foreground text-[10px] font-bold">أزرار</p>
            <p className="text-muted-foreground text-[9px]">نمط كلاسيكي</p>
          </button>
        </div>

        {/* Category Icons config */}
        {state.categoryDisplayMode === 'icons' && (
          <div className="border-border/50 space-y-2 border-t pt-3">
            <p className="text-muted-foreground text-[10px] font-semibold">أيقونات الأقسام</p>
            {state.categoryIcons.map(ci => {
              const CIcon = getCategoryIcon(ci.icon);
              return (
                <div key={ci.id} className="bg-muted/20 flex items-center gap-2 rounded-xl p-2">
                  <div
                    className="border-border bg-card flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-xl border"
                    onClick={() => {
                      categoryImageTarget.current = ci.id;
                      categoryImageInputRef.current?.click();
                    }}
                  >
                    {ci.image ? (
                      // TODO: replace with storage upload (Supabase/S3) and store URL
                      <img src={ci.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <CIcon className="text-muted-foreground h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-[11px] font-medium">
                      {ci.category}
                    </p>
                    <div className="mt-1 flex gap-1 overflow-x-auto">
                      {CATEGORY_ICON_OPTIONS.slice(0, 6).map(iconName => {
                        const IconComp = getCategoryIcon(iconName);
                        return (
                          <button
                            key={iconName}
                            onClick={() =>
                              onUpdateCategoryIcon(ci.id, { icon: iconName, image: null })
                            }
                            className={`flex h-6 w-6 items-center justify-center rounded-md transition-all ${
                              ci.icon === iconName && !ci.image
                                ? 'bg-primary/15 ring-primary ring-1'
                                : 'hover:bg-muted'
                            }`}
                          >
                            <IconComp className="h-3 w-3" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {ci.image && (
                    <button
                      onClick={() => onUpdateCategoryIcon(ci.id, { image: null })}
                      className="text-muted-foreground hover:text-destructive p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Sections (horizontal rows) */}
      <div className="bg-card border-border rounded-2xl border p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="text-primary h-4 w-4" />
            <p className="text-foreground text-xs font-semibold">أقسام المنتجات (صفوف أفقية)</p>
          </div>
        </div>
        <p className="text-muted-foreground mb-3 text-[10px]">
          أضف صفوف أفقية للمنتجات حسب القسم وعدّل ترتيبها
        </p>
        <div className="space-y-2">
          {state.categorySections.map((cs, i) => (
            <div key={cs.id} className="bg-muted/20 flex items-center gap-2 rounded-xl p-2.5">
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => onMoveCategorySection(i, -1)}
                  disabled={i === 0}
                  className="text-muted-foreground hover:text-foreground p-0.5 disabled:opacity-30"
                >
                  <ChevronDown className="h-3 w-3 rotate-180" />
                </button>
                <button
                  onClick={() => onMoveCategorySection(i, 1)}
                  disabled={i === state.categorySections.length - 1}
                  className="text-muted-foreground hover:text-foreground p-0.5 disabled:opacity-30"
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
              <select
                value={cs.category}
                onChange={e => onUpdateCategorySection(cs.id, e.target.value)}
                className="border-border bg-card text-foreground h-8 flex-1 rounded-lg border px-2 text-xs"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <Switch checked={cs.enabled} onCheckedChange={() => onToggleCategorySection(cs.id)} />
              <button
                onClick={() => onRemoveCategorySection(cs.id)}
                className="text-muted-foreground hover:text-destructive p-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <AddButton onClick={addCategorySection} />
        </div>
      </div>
    </div>
  );
}
