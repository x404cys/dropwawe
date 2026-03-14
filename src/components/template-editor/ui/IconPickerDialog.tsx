'use client';

import { useMemo, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Search, X, Check, Shapes, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type IconComponent = React.ComponentType<{ className?: string }>;

interface IconPickerDialogProps {
  value?: string;
  onChange: (iconName: string) => void;
  onClear?: () => void;
}

const EXCLUDED_EXPORTS = new Set(['createLucideIcon', 'Icon', 'icons', 'default', 'LucideIcon']);

const POPULAR_ICON_NAMES = [
  'Monitor',
  'ShoppingBag',
  'Briefcase',
  'Settings',
  'Camera',
  'Palette',
  'Globe',
  'Smartphone',
  'Star',
  'Heart',
  'Home',
  'User',
  'Mail',
  'Phone',
  'FileText',
  'Image',
  'Package',
  'BadgeHelp',
];

const SEARCH_SUGGESTIONS = [
  'Monitor',
  'ShoppingBag',
  'Briefcase',
  'Settings',
  'Camera',
  'Palette',
  'Globe',
  'Smartphone',
  'User',
  'Home',
  'Mail',
  'Phone',
];

function isProbablyIconComponent(value: unknown) {
  return typeof value === 'function' || (typeof value === 'object' && value !== null);
}

const ICON_LIST = Object.entries(LucideIcons)
  .filter(([name, value]) => {
    if (EXCLUDED_EXPORTS.has(name)) return false;
    if (!/^[A-Z]/.test(name)) return false;
    return isProbablyIconComponent(value);
  })
  .map(([name, component]) => ({
    name,
    component: component as IconComponent,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

function getIconByName(name?: string) {
  if (!name) return null;
  return ICON_LIST.find(icon => icon.name === name) ?? null;
}

function scoreIcon(name: string, query: string) {
  const n = name.toLowerCase();
  const q = query.toLowerCase();

  if (n === q) return 100;
  if (n.startsWith(q)) return 80;
  if (n.includes(q)) return 60;

  const words = name.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  if (words.includes(q)) return 40;

  return 0;
}

export default function IconPickerDialog({ value, onChange, onClear }: IconPickerDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedIcon = useMemo(() => getIconByName(value), [value]);

  const popularIcons = useMemo(() => {
    return POPULAR_ICON_NAMES.map(name => getIconByName(name)).filter(Boolean) as {
      name: string;
      component: IconComponent;
    }[];
  }, []);

  const filteredIcons = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ICON_LIST.slice(0, 150);

    return ICON_LIST.map(icon => ({
      ...icon,
      score: scoreIcon(icon.name, q),
    }))
      .filter(icon => icon.score > 0)
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
      .slice(0, 150);
  }, [search]);

  const suggestedIcons = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];

    return ICON_LIST.filter(icon => icon.name.toLowerCase().includes(q)).slice(0, 8);
  }, [search]);

  return (
    <Dialog
      open={open}
      onOpenChange={nextOpen => {
        setOpen(nextOpen);
        if (!nextOpen) setSearch('');
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className="border-border bg-background hover:border-primary/40 hover:bg-muted/40 flex h-10 w-full items-center justify-between rounded-xl border px-3 transition-all"
        >
          <div className="flex min-w-0 items-center gap-2">
            <div className="bg-muted border-border/60 flex h-8 w-8 items-center justify-center rounded-lg border">
              {selectedIcon ? (
                <selectedIcon.component className="text-primary h-4 w-4" />
              ) : (
                <Shapes className="text-muted-foreground h-4 w-4" />
              )}
            </div>

            <div className="min-w-0 text-right">
              <p className="text-foreground truncate text-xs font-medium">
                {selectedIcon?.name || 'اختيار أيقونة'}
              </p>
              <p className="text-muted-foreground text-[10px]">Lucide Icons</p>
            </div>
          </div>

          <span className="text-muted-foreground text-[11px]">اختيار</span>
        </button>
      </DialogTrigger>

      <DialogContent
        dir="rtl"
        className="border-border/60 flex max-h-[85vh] w-[95vw] max-w-4xl flex-col overflow-hidden rounded-2xl p-0"
      >
        <DialogHeader className="border-border/50 shrink-0 border-b px-4 pt-4 pb-3 sm:px-5">
          <DialogTitle className="text-sm sm:text-base">اختيار أيقونة</DialogTitle>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4 sm:p-5">
          <div className="flex shrink-0 flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ابحث عن أيقونة... مثال: monitor أو shopping"
                className="h-10 pr-3 pl-10 text-sm"
                dir="ltr"
              />
            </div>

            {value && (
              <button
                type="button"
                onClick={() => {
                  onClear?.();
                  setOpen(false);
                }}
                className="border-border bg-background text-muted-foreground hover:text-destructive inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border px-4 text-sm transition-all"
              >
                <X className="h-4 w-4" />
                حذف الأيقونة
              </button>
            )}
          </div>

          {!search.trim() && (
            <div className="shrink-0 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="text-primary h-4 w-4" />
                <p className="text-sm font-semibold">أيقونات مقترحة</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {SEARCH_SUGGESTIONS.map(suggestion => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setSearch(suggestion)}
                    className="border-border bg-background hover:border-primary/30 hover:text-primary rounded-full border px-3 py-1 text-[11px] transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedIcon && (
            <div className="bg-muted/30 border-border/50 flex shrink-0 items-center gap-3 rounded-2xl border p-3">
              <div className="bg-background border-border/60 flex h-12 w-12 items-center justify-center rounded-xl border">
                <selectedIcon.component className="text-primary h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{selectedIcon.name}</p>
                <p className="text-muted-foreground text-xs">الأيقونة المختارة حاليًا</p>
              </div>
            </div>
          )}

          {!search.trim() && popularIcons.length > 0 && (
            <div className="shrink-0 space-y-3">
              <p className="text-sm font-semibold">الأكثر استخدامًا</p>

              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {popularIcons.map(icon => {
                  const Icon = icon.component;
                  const isActive = value === icon.name;

                  return (
                    <button
                      key={icon.name}
                      type="button"
                      onClick={() => {
                        onChange(icon.name);
                        setOpen(false);
                      }}
                      className={`group relative flex h-[88px] flex-col items-center justify-center gap-2 rounded-xl border p-2 transition-all ${
                        isActive
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-background hover:border-primary/30 hover:bg-muted/40'
                      }`}
                    >
                      {isActive && (
                        <span className="bg-primary text-primary-foreground absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full">
                          <Check className="h-3 w-3" />
                        </span>
                      )}

                      <div className="bg-muted border-border/50 flex h-9 w-9 items-center justify-center rounded-lg border">
                        <Icon
                          className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-foreground'}`}
                        />
                      </div>

                      <span className="line-clamp-2 text-center text-[10px] leading-4">
                        {icon.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="border-border/50 min-h-0 flex-1 overflow-hidden rounded-2xl border">
            <div className="h-full overflow-y-auto p-3">
              {filteredIcons.length === 0 ? (
                <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
                  <p className="text-foreground text-sm font-medium">لا توجد نتائج مطابقة</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    جرّب كلمات مثل: Monitor, ShoppingBag, Briefcase, Settings
                  </p>

                  {suggestedIcons.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-medium">اقتراحات قريبة</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {suggestedIcons.map(icon => (
                          <button
                            key={icon.name}
                            type="button"
                            onClick={() => setSearch(icon.name)}
                            className="border-border bg-background hover:border-primary/30 hover:text-primary rounded-full border px-3 py-1 text-[11px] transition-all"
                          >
                            {icon.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
                  {filteredIcons.map(icon => {
                    const Icon = icon.component;
                    const isActive = value === icon.name;

                    return (
                      <button
                        key={icon.name}
                        type="button"
                        onClick={() => {
                          onChange(icon.name);
                          setOpen(false);
                        }}
                        className={`group relative flex h-[88px] flex-col items-center justify-center gap-2 rounded-xl border p-2 transition-all ${
                          isActive
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-background hover:border-primary/30 hover:bg-muted/40'
                        }`}
                        title={icon.name}
                      >
                        {isActive && (
                          <span className="bg-primary text-primary-foreground absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full">
                            <Check className="h-3 w-3" />
                          </span>
                        )}

                        <div className="bg-muted border-border/50 flex h-9 w-9 items-center justify-center rounded-lg border">
                          <Icon
                            className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-foreground'}`}
                          />
                        </div>

                        <span className="line-clamp-2 text-center text-[10px] leading-4">
                          {icon.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
