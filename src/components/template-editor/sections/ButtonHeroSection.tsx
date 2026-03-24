import { Input } from '@/components/ui/input';
import {
  ArrowUpDown,
  ExternalLink,
  Mail,
  MessageCircle,
  MousePointerClick,
  Phone,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import type { HeroButtonItem } from '@/lib/template/types';

// ── Types ──────────────────────────────────────────────
export type HeroButton = Omit<HeroButtonItem, 'order'> & { order?: number };

// ── Constants ──────────────────────────────────────────
const BUTTON_ACTION_TYPES = [
  { type: 'scroll' as const, label: 'انتقال لقسم', icon: ArrowUpDown },
  { type: 'url' as const, label: 'فتح رابط', icon: ExternalLink },
  { type: 'whatsapp' as const, label: 'واتساب', icon: MessageCircle },
  { type: 'phone' as const, label: 'اتصال', icon: Phone },
  { type: 'email' as const, label: 'بريد', icon: Mail },
  { type: 'none' as const, label: 'بدون وظيفة', icon: X },
];

const SCROLL_TARGETS = [
  { value: 'hero-section', label: 'صفحة الهبوط' },
  { value: 'services-section', label: 'الخدمات' },
  { value: 'works-section', label: 'معرض الأعمال' },
  { value: 'store-section', label: 'المتجر' },
  { value: 'testimonials-section', label: 'آراء العملاء' },
  { value: 'about-section', label: 'من نحن' },
];

const DEFAULT_LABELS = ['الرئيسي', 'الثانوي', 'الإضافي'];

// ── Main Component ─────────────────────────────────────
const normalizeButtons = (buttons: HeroButton[]): HeroButtonItem[] =>
  buttons.map((button, index) => ({
    ...button,
    order: index,
  }));

const HeroButtonsTable = ({
  buttons,
  onChange,
}: {
  buttons: HeroButton[];
  onChange: (buttons: HeroButtonItem[]) => void;
}) => {
  const normalizedButtons = normalizeButtons(
    [...buttons].sort((left, right) => (left.order ?? 0) - (right.order ?? 0)),
  );

  const update = (id: string, patch: Partial<HeroButton>) =>
    onChange(normalizeButtons(normalizedButtons.map(b => (b.id === id ? { ...b, ...patch } : b))));

  const handleActionChange = (id: string, actionType: HeroButton['actionType']) => {
    const defaultDetail = actionType === 'scroll' ? 'store-section' : '';
    update(id, { actionType, actionDetail: defaultDetail });
  };

  const addButton = () => {
    const i = normalizedButtons.length;
    onChange([
      ...normalizedButtons,
      {
        id: `btn-${Date.now()}`,
        label: DEFAULT_LABELS[i] ?? `زر ${i + 1}`,
        text: '',
        actionType: 'none',
        actionDetail: '',
        order: i,
      },
    ]);
  };

  return (
    <div className="space-y-2">
      {/* Cards */}
      {normalizedButtons.map((btn, idx) => (
        <HeroButtonCard
          key={btn.id}
          btn={btn}
          isFixed={idx < 2}
          onUpdate={patch => update(btn.id, patch)}
          onActionChange={type => handleActionChange(btn.id, type)}
          onRemove={() => onChange(normalizeButtons(normalizedButtons.filter(b => b.id !== btn.id)))}
        />
      ))}

      {/* Add button */}
      <button
        onClick={addButton}
        className="border-border text-muted-foreground hover:border-primary/30 hover:text-primary flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed py-2 text-xs font-medium transition-all"
      >
        <Plus className="h-3.5 w-3.5" />
        إضافة زر
      </button>
    </div>
  );
};

// ── Card per button (same style as ButtonActionEditor) ─
const HeroButtonCard = ({
  btn,
  isFixed,
  onUpdate,
  onActionChange,
  onRemove,
}: {
  btn: HeroButton;
  isFixed: boolean;
  onUpdate: (patch: Partial<HeroButton>) => void;
  onActionChange: (type: HeroButton['actionType']) => void;
  onRemove: () => void;
}) => (
  <div className="bg-background border-border/50 space-y-2.5 rounded-xl border p-3">
    {/* Header */}
    <div className="flex items-center gap-2">
      <MousePointerClick className="text-primary h-3.5 w-3.5 flex-shrink-0" />
      <p className="text-foreground text-[11px] font-semibold">{btn.label}</p>
      {!isFixed && (
        <button
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive mr-auto p-0.5 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>

    {/* Text input */}
    <Input
      value={btn.text}
      onChange={e => onUpdate({ text: e.target.value })}
      className="h-8 rounded-lg text-xs"
      placeholder="نص الزر"
    />

    {/* Action type grid — نفس تصميم ButtonActionEditor */}
    <div className="grid grid-cols-3 gap-1">
      {BUTTON_ACTION_TYPES.map(({ type, label, icon: Icon }) => (
        <button
          key={type}
          onClick={() => onActionChange(type)}
          className={`flex items-center justify-center gap-1 rounded-lg py-1.5 text-[9px] font-semibold transition-all ${
            btn.actionType === type
              ? 'bg-primary/15 text-primary ring-primary/30 ring-1'
              : 'bg-muted/50 text-muted-foreground hover:bg-muted'
          }`}
        >
          <Icon className="h-3 w-3" />
          {label}
        </button>
      ))}
    </div>

    {/* Detail field */}
    <DetailField btn={btn} onUpdate={onUpdate} />
  </div>
);

// ── Detail Field ───────────────────────────────────────
const DetailField = ({
  btn,
  onUpdate,
}: {
  btn: HeroButton;
  onUpdate: (patch: Partial<HeroButton>) => void;
}) => {
  if (btn.actionType === 'scroll')
    return (
      <select
        value={btn.actionDetail}
        onChange={e => onUpdate({ actionDetail: e.target.value })}
        className="border-border bg-card text-foreground h-8 w-full rounded-lg border px-2 text-xs"
      >
        {SCROLL_TARGETS.map(t => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
    );

  if (btn.actionType === 'url')
    return (
      <Input
        value={btn.actionDetail}
        onChange={e => onUpdate({ actionDetail: e.target.value })}
        className="h-8 rounded-lg text-xs"
        placeholder="https://example.com"
        dir="ltr"
      />
    );

  if (btn.actionType === 'whatsapp')
    return (
      <Input
        value={btn.actionDetail}
        onChange={e => onUpdate({ actionDetail: e.target.value })}
        className="h-8 rounded-lg text-xs"
        placeholder="رسالة واتساب (اختياري)"
      />
    );

  if (btn.actionType === 'phone')
    return (
      <Input
        value={btn.actionDetail}
        onChange={e => onUpdate({ actionDetail: e.target.value })}
        className="h-8 rounded-lg text-xs"
        placeholder="+964xxxxxxxxxx"
        dir="ltr"
      />
    );

  if (btn.actionType === 'email')
    return (
      <Input
        value={btn.actionDetail}
        onChange={e => onUpdate({ actionDetail: e.target.value })}
        className="h-8 rounded-lg text-xs"
        placeholder="hello@example.com"
        dir="ltr"
      />
    );

  return null;
};

export default HeroButtonsTable;
