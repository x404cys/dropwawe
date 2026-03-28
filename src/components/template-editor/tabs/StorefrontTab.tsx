'use client';

import { useRef } from 'react';
import {
  Camera,
  ChevronDown,
  Code,
  Footprints,
  GripVertical,
  Megaphone,
  Monitor,
  Package,
  Palette,
  PenTool,
  Shirt,
  Smartphone,
  Sparkles,
  Star,
  Trash2,
  Upload,
  Watch,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useLanguage } from '@/app/(page)/Dashboard/context/LanguageContext';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type {
  AnnouncementBarConfig,
  CategoryIconItem,
  TemplateFormState,
} from '@/lib/template/types';
import AddButton from '../ui/AddButton';

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

interface StorefrontTabProps {
  state: TemplateFormState;
  categories: string[];
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
  const { t } = useLanguage();
  const tt = t.templateEditor;
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const categoryImageInputRef = useRef<HTMLInputElement>(null);
  const categoryImageTarget = useRef<string>('');

  const updateBar = (partial: Partial<AnnouncementBarConfig>) =>
    onUpdate({ announcementBar: { ...state.announcementBar, ...partial } });

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(tt.validation.fileTooLarge5mb);
      return;
    }

    onAddBanner(file);
    toast.success(tt.validation.bannerAdded);
    event.target.value = '';
  };

  const handleCategoryImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error(tt.validation.fileTooLarge2mb);
      return;
    }

    const iconId = categoryImageTarget.current;
    const reader = new FileReader();
    reader.onloadend = () => {
      onUpdateCategoryIcon(iconId, { image: reader.result as string });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const addCategorySection = () => {
    const usedCategories = state.categorySections.map(section => section.category);
    const available =
      categories.find(category => !usedCategories.includes(category)) ?? tt.defaults.newSection;
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

      <div className="bg-card border-border rounded-2xl border p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="text-primary h-4 w-4" />
            <p className="text-foreground text-xs font-semibold">{tt.storefront.announcementBar}</p>
          </div>
          <Switch
            checked={state.announcementBar.enabled}
            onCheckedChange={value => updateBar({ enabled: value })}
          />
        </div>

        {state.announcementBar.enabled && (
          <div className="space-y-2">
            <Input
              value={state.announcementBar.text}
              onChange={event => updateBar({ text: event.target.value })}
              className="rounded-xl"
              placeholder={tt.storefront.announcementPlaceholder}
            />

            <div className="flex gap-2">
              <div className="bg-muted/20 flex flex-1 items-center gap-2 rounded-xl p-2">
                <input
                  type="color"
                  value={state.announcementBar.bgColor}
                  onChange={event => updateBar({ bgColor: event.target.value })}
                  className="h-7 w-7 cursor-pointer rounded-lg border-0 bg-transparent"
                />
                <p className="text-muted-foreground text-[10px]">{tt.storefront.backgroundColor}</p>
              </div>

              <div className="bg-muted/20 flex flex-1 items-center gap-2 rounded-xl p-2">
                <input
                  type="color"
                  value={state.announcementBar.textColor}
                  onChange={event => updateBar({ textColor: event.target.value })}
                  className="h-7 w-7 cursor-pointer rounded-lg border-0 bg-transparent"
                />
                <p className="text-muted-foreground text-[10px]">{tt.storefront.textColor}</p>
              </div>
            </div>

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
          <p className="text-foreground text-xs font-semibold">{tt.storefront.banners}</p>
          <span className="text-muted-foreground text-[10px]">
            {tt.storefront.imagesCount.replace('{count}', String(state.bannerImages.length))}
          </span>
        </div>

        <div className="space-y-2">
          {state.bannerImages.map((image, index) => (
            <div
              key={image.id}
              className="border-border relative h-24 w-full overflow-hidden rounded-xl border"
            >
              <Image src={image.url as string} alt="banner" fill className="object-cover" />

              <button
                onClick={() => onRemoveBanner(image.id)}
                className="bg-destructive/90 absolute top-2 left-2 z-10 flex h-6 w-6 items-center justify-center rounded-full"
              >
                <X className="text-destructive-foreground h-3 w-3" />
              </button>

              <span className="bg-foreground/60 text-background absolute top-2 right-2 z-10 rounded-full px-2 py-0.5 text-[9px] font-bold">
                {index + 1}
              </span>

              <div className="absolute right-2 bottom-2 z-10">
                <Select
                  value={image.postion || 'top'}
                  onValueChange={value => onUpdatePostionBanner(image.id, value)}
                >
                  <SelectTrigger className="h-8 w-[130px] text-[10px]">
                    <SelectValue placeholder={tt.storefront.bannerPositionPlaceholder} />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="top">{tt.storefront.bannerPositions.top}</SelectItem>
                    <SelectItem value="center">{tt.storefront.bannerPositions.center}</SelectItem>
                    <SelectItem value="upstore">{tt.storefront.bannerPositions.upstore}</SelectItem>
                    <SelectItem value="btwcat">{tt.storefront.bannerPositions.btwcat}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}

          <button
            onClick={() => bannerInputRef.current?.click()}
            className="border-border text-muted-foreground hover:border-primary/30 hover:text-primary flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed py-4 text-xs font-medium transition-all"
          >
            <Upload className="h-4 w-4" />
            {tt.storefront.addBanner}
          </button>

          <p className="text-muted-foreground text-center text-[10px]">
            {tt.storefront.bannerHint}
          </p>
        </div>
      </div>

      <div className="bg-card border-border rounded-2xl border p-4">
        <div className="mb-3 flex items-center gap-2">
          <Package className="text-primary h-4 w-4" />
          <p className="text-foreground text-xs font-semibold">{tt.storefront.categoryDisplay}</p>
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
            <p className="text-foreground text-[10px] font-bold">{tt.storefront.iconsMode}</p>
            <p className="text-muted-foreground text-[9px]">{tt.storefront.iconsModeDesc}</p>
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
              <span className="bg-primary/20 rounded-full px-2 py-0.5 text-[8px]">
                {tt.storefront.categoryBadge}
              </span>
              <span className="bg-muted rounded-full px-2 py-0.5 text-[8px]">
                {tt.storefront.categoryBadge}
              </span>
            </div>
            <p className="text-foreground text-[10px] font-bold">{tt.storefront.pillsMode}</p>
            <p className="text-muted-foreground text-[9px]">{tt.storefront.pillsModeDesc}</p>
          </button>
        </div>

        {state.categoryDisplayMode === 'icons' && (
          <div className="border-border/50 space-y-2 border-t pt-3">
            <p className="text-muted-foreground text-[10px] font-semibold">
              {tt.storefront.categoryIcons}
            </p>
            {state.categoryIcons.map(categoryIcon => {
              const CategoryIcon = getCategoryIcon(categoryIcon.icon);

              return (
                <div
                  key={categoryIcon.id}
                  className="bg-muted/20 flex items-center gap-2 rounded-xl p-2"
                >
                  <div
                    className="border-border bg-card flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-xl border"
                    onClick={() => {
                      categoryImageTarget.current = categoryIcon.id;
                      categoryImageInputRef.current?.click();
                    }}
                  >
                    {categoryIcon.image ? (
                      <img src={categoryIcon.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <CategoryIcon className="text-muted-foreground h-5 w-5" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-[11px] font-medium">
                      {categoryIcon.category}
                    </p>

                    <div className="mt-1 flex gap-1 overflow-x-auto">
                      {CATEGORY_ICON_OPTIONS.slice(0, 6).map(iconName => {
                        const IconComp = getCategoryIcon(iconName);

                        return (
                          <button
                            key={iconName}
                            onClick={() =>
                              onUpdateCategoryIcon(categoryIcon.id, { icon: iconName, image: null })
                            }
                            className={`flex h-6 w-6 items-center justify-center rounded-md transition-all ${
                              categoryIcon.icon === iconName && !categoryIcon.image
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

                  {categoryIcon.image && (
                    <button
                      onClick={() => onUpdateCategoryIcon(categoryIcon.id, { image: null })}
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

      <div className="bg-card border-border rounded-2xl border p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="text-primary h-4 w-4" />
            <p className="text-foreground text-xs font-semibold">{tt.storefront.categoryRows}</p>
          </div>
        </div>

        <p className="text-muted-foreground mb-3 text-[10px]">{tt.storefront.categoryRowsDesc}</p>

        <div className="space-y-2">
          {state.categorySections.map((section, index) => (
            <div key={section.id} className="bg-muted/20 flex items-center gap-2 rounded-xl p-2.5">
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => onMoveCategorySection(index, -1)}
                  disabled={index === 0}
                  className="text-muted-foreground hover:text-foreground p-0.5 disabled:opacity-30"
                >
                  <ChevronDown className="h-3 w-3 rotate-180" />
                </button>
                <button
                  onClick={() => onMoveCategorySection(index, 1)}
                  disabled={index === state.categorySections.length - 1}
                  className="text-muted-foreground hover:text-foreground p-0.5 disabled:opacity-30"
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>

              <select
                value={section.category}
                onChange={event => onUpdateCategorySection(section.id, event.target.value)}
                className="bg-card text-foreground border-border h-8 flex-1 rounded-lg border px-2 text-xs"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <Switch
                checked={section.enabled}
                onCheckedChange={() => onToggleCategorySection(section.id)}
              />

              <button
                onClick={() => onRemoveCategorySection(section.id)}
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
