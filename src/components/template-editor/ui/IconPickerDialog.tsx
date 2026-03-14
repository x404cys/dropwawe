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
    return ICON_LIST.map(icon => ({ ...icon, score: scoreIcon(icon.name, q) }))
      .filter(icon => icon.score > 0)
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
      .slice(0, 150);
  }, [search]);

  const suggestedIcons = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return ICON_LIST.filter(icon => icon.name.toLowerCase().includes(q)).slice(0, 8);
  }, [search]);

  const isSearching = search.trim().length > 0;

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
        className="border-border/60 flex flex-col overflow-hidden rounded-2xl p-0"
        style={{ width: 'min(95vw, 860px)', height: 'min(88vh, 700px)', maxWidth: '100%' }}
      >
        <DialogHeader className="border-border/50 shrink-0 border-b px-5 pt-4 pb-3">
          <DialogTitle className="text-sm sm:text-base">اختيار أيقونة</DialogTitle>
        </DialogHeader>

        <div className="border-border/40 shrink-0 space-y-3 border-b px-5 pt-4 pb-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ابحث... مثال: monitor أو shopping"
                className="h-9 pr-9 pl-3"
                dir="ltr"
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 left-2.5 -translate-y-1/2 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {value && (
              <button
                type="button"
                onClick={() => {
                  onClear?.();
                  setOpen(false);
                }}
                className="border-border bg-background text-muted-foreground hover:text-destructive hover:border-destructive/40 inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-xs transition-all"
              >
                <X className="h-3.5 w-3.5" />
                حذف
              </button>
            )}
          </div>

          {/* Suggestion chips (only when not searching) */}
          {!isSearching && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground flex shrink-0 items-center gap-1 text-[11px] font-semibold">
                <Sparkles className="text-primary h-3.5 w-3.5" />
                مقترحة:
              </span>
              {SEARCH_SUGGESTIONS.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSearch(s)}
                  className="border-border bg-muted/50 hover:border-primary/40 hover:text-primary rounded-full border px-2.5 py-0.5 text-[10px] transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Selected icon badge */}
          {selectedIcon && (
            <div className="bg-primary/5 border-primary/20 flex items-center gap-2.5 rounded-xl border px-3 py-2">
              <div className="bg-background border-border/60 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border">
                <selectedIcon.component className="text-primary h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold">{selectedIcon.name}</p>
                <p className="text-muted-foreground text-[10px]">الأيقونة المختارة حاليًا</p>
              </div>
              <Check className="text-primary h-4 w-4 shrink-0" />
            </div>
          )}

          {/* Popular icons row (only when not searching) */}
          {!isSearching && popularIcons.length > 0 && (
            <div className="space-y-2">
              <p className="text-muted-foreground text-[11px] font-semibold">الأكثر استخدامًا</p>
              <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-9 md:grid-cols-12">
                {popularIcons.map(icon => {
                  const Icon = icon.component;
                  const isActive = value === icon.name;
                  return (
                    <button
                      key={icon.name}
                      type="button"
                      title={icon.name}
                      onClick={() => {
                        onChange(icon.name);
                        setOpen(false);
                      }}
                      className={`group relative flex h-10 w-full items-center justify-center rounded-lg border transition-all ${
                        isActive
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-background hover:border-primary/30 hover:bg-muted/50'
                      }`}
                    >
                      {isActive && (
                        <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full">
                          <Check className="h-2 w-2" />
                        </span>
                      )}
                      <Icon
                        className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-foreground/70'}`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── SCROLLABLE: Icon grid ── */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {filteredIcons.length === 0 ? (
            <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-3 text-center">
              <Shapes className="text-muted-foreground/40 h-10 w-10" />
              <div>
                <p className="text-foreground text-sm font-medium">لا توجد نتائج مطابقة</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  جرّب كلمات مثل: Monitor, ShoppingBag, Briefcase
                </p>
              </div>
              {suggestedIcons.length > 0 && (
                <div className="mt-1 flex flex-wrap justify-center gap-1.5">
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
              )}
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-3 text-[11px] font-medium">
                {isSearching
                  ? `${filteredIcons.length} نتيجة`
                  : `جميع الأيقونات · عرض أول ${filteredIcons.length}`}
              </p>
              <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-9">
                {filteredIcons.map(icon => {
                  const Icon = icon.component;
                  const isActive = value === icon.name;
                  return (
                    <button
                      key={icon.name}
                      type="button"
                      title={icon.name}
                      onClick={() => {
                        onChange(icon.name);
                        setOpen(false);
                      }}
                      className={`group relative flex flex-col items-center justify-center gap-1.5 rounded-xl border p-2 pt-2.5 pb-2 transition-all ${
                        isActive
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-background hover:border-primary/30 hover:bg-muted/40'
                      }`}
                    >
                      {isActive && (
                        <span className="bg-primary text-primary-foreground absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full">
                          <Check className="h-2 w-2" />
                        </span>
                      )}
                      <Icon
                        className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-foreground/70 group-hover:text-foreground'}`}
                      />
                      <span className="text-muted-foreground line-clamp-1 w-full text-center text-[9px] leading-tight">
                        {icon.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
