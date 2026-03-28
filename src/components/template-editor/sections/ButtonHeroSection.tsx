'use client';

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
import { useLanguage } from '@/app/(page)/Dashboard/context/LanguageContext';
import { Input } from '@/components/ui/input';
import type { HeroButtonItem } from '@/lib/template/types';

export type HeroButton = Omit<HeroButtonItem, 'order'> & { order?: number };

const normalizeButtons = (buttons: HeroButton[]): HeroButtonItem[] =>
  buttons.map((button, index) => ({
    ...button,
    order: index,
  }));

const HeroButtonCard = ({
  btn,
  label,
  isFixed,
  actionTypes,
  scrollTargets,
  whatsappMessagePlaceholder,
  buttonTextPlaceholder,
  onUpdate,
  onActionChange,
  onRemove,
}: {
  btn: HeroButton;
  label: string;
  isFixed: boolean;
  actionTypes: Array<{ type: HeroButton['actionType']; label: string; icon: React.ElementType }>;
  scrollTargets: Array<{ value: string; label: string }>;
  whatsappMessagePlaceholder: string;
  buttonTextPlaceholder: string;
  onUpdate: (patch: Partial<HeroButton>) => void;
  onActionChange: (type: HeroButton['actionType']) => void;
  onRemove: () => void;
}) => (
  <div className="bg-background border-border/50 space-y-2.5 rounded-xl border p-3">
    <div className="flex items-center gap-2">
      <MousePointerClick className="text-primary h-3.5 w-3.5 flex-shrink-0" />
      <p className="text-foreground text-[11px] font-semibold">{label}</p>
      {!isFixed && (
        <button
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive mr-auto p-0.5 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>

    <Input
      value={btn.text}
      onChange={event => onUpdate({ text: event.target.value })}
      className="h-8 rounded-lg text-xs"
      placeholder={buttonTextPlaceholder}
    />

    <div className="grid grid-cols-3 gap-1">
      {actionTypes.map(({ type, label: actionLabel, icon: Icon }) => (
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
          {actionLabel}
        </button>
      ))}
    </div>

    {btn.actionType === 'scroll' && (
      <select
        value={btn.actionDetail}
        onChange={event => onUpdate({ actionDetail: event.target.value })}
        className="bg-card text-foreground border-border h-8 w-full rounded-lg border px-2 text-xs"
      >
        {scrollTargets.map(target => (
          <option key={target.value} value={target.value}>
            {target.label}
          </option>
        ))}
      </select>
    )}

    {btn.actionType === 'url' && (
      <Input
        value={btn.actionDetail}
        onChange={event => onUpdate({ actionDetail: event.target.value })}
        className="h-8 rounded-lg text-xs"
        placeholder="https://example.com"
        dir="ltr"
      />
    )}

    {btn.actionType === 'whatsapp' && (
      <Input
        value={btn.actionDetail}
        onChange={event => onUpdate({ actionDetail: event.target.value })}
        className="h-8 rounded-lg text-xs"
        placeholder={whatsappMessagePlaceholder}
      />
    )}

    {btn.actionType === 'phone' && (
      <Input
        value={btn.actionDetail}
        onChange={event => onUpdate({ actionDetail: event.target.value })}
        className="h-8 rounded-lg text-xs"
        placeholder="+964xxxxxxxxxx"
        dir="ltr"
      />
    )}

    {btn.actionType === 'email' && (
      <Input
        value={btn.actionDetail}
        onChange={event => onUpdate({ actionDetail: event.target.value })}
        className="h-8 rounded-lg text-xs"
        placeholder="hello@example.com"
        dir="ltr"
      />
    )}
  </div>
);

export default function HeroButtonsTable({
  buttons,
  onChange,
}: {
  buttons: HeroButton[];
  onChange: (buttons: HeroButtonItem[]) => void;
}) {
  const { t } = useLanguage();
  const tt = t.templateEditor;

  const actionTypes = [
    { type: 'scroll' as const, label: tt.heroButtons.actionTypes.scroll, icon: ArrowUpDown },
    { type: 'url' as const, label: tt.heroButtons.actionTypes.url, icon: ExternalLink },
    { type: 'whatsapp' as const, label: tt.heroButtons.actionTypes.whatsapp, icon: MessageCircle },
    { type: 'phone' as const, label: tt.heroButtons.actionTypes.phone, icon: Phone },
    { type: 'email' as const, label: tt.heroButtons.actionTypes.email, icon: Mail },
    { type: 'none' as const, label: tt.heroButtons.actionTypes.none, icon: X },
  ];

  const scrollTargets = [
    { value: 'hero-section', label: tt.heroButtons.scrollTargets.hero },
    { value: 'services-section', label: tt.heroButtons.scrollTargets.services },
    { value: 'works-section', label: tt.heroButtons.scrollTargets.works },
    { value: 'store-section', label: tt.heroButtons.scrollTargets.store },
    { value: 'testimonials-section', label: tt.heroButtons.scrollTargets.testimonials },
    { value: 'about-section', label: tt.heroButtons.scrollTargets.about },
  ];

  const normalizedButtons = normalizeButtons(
    [...buttons].sort((left, right) => (left.order ?? 0) - (right.order ?? 0))
  );

  const update = (id: string, patch: Partial<HeroButton>) =>
    onChange(
      normalizeButtons(
        normalizedButtons.map(button => (button.id === id ? { ...button, ...patch } : button))
      )
    );

  const handleActionChange = (id: string, actionType: HeroButton['actionType']) => {
    const defaultDetail = actionType === 'scroll' ? 'store-section' : '';
    update(id, { actionType, actionDetail: defaultDetail });
  };

  const addButton = () => {
    const index = normalizedButtons.length;
    onChange([
      ...normalizedButtons,
      {
        id: `btn-${Date.now()}`,
        label: tt.heroButtons.extraNumber.replace('{number}', String(index + 1)),
        text: '',
        actionType: 'none',
        actionDetail: '',
        order: index,
      },
    ]);
  };

  return (
    <div className="space-y-2">
      {normalizedButtons.map((button, index) => {
        const displayLabel =
          index === 0
            ? tt.heroButtons.primary
            : index === 1
              ? tt.heroButtons.secondary
              : tt.heroButtons.extraNumber.replace('{number}', String(index + 1));

        return (
          <HeroButtonCard
            key={button.id}
            btn={button}
            label={displayLabel}
            isFixed={index < 2}
            actionTypes={actionTypes}
            scrollTargets={scrollTargets}
            whatsappMessagePlaceholder={tt.heroButtons.whatsappMessagePlaceholder}
            buttonTextPlaceholder={tt.heroButtons.buttonTextPlaceholder}
            onUpdate={patch => update(button.id, patch)}
            onActionChange={type => handleActionChange(button.id, type)}
            onRemove={() =>
              onChange(normalizeButtons(normalizedButtons.filter(item => item.id !== button.id)))
            }
          />
        );
      })}

      <button
        onClick={addButton}
        className="border-border text-muted-foreground hover:border-primary/30 hover:text-primary flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed py-2 text-xs font-medium transition-all"
      >
        <Plus className="h-3.5 w-3.5" />
        {tt.heroButtons.addButton}
      </button>
    </div>
  );
}
