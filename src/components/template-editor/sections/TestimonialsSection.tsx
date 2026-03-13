'use client';
// src/components/template-editor/sections/TestimonialsSection.tsx
// Renders customer testimonials list with rating stars.

import { Trash2, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AddButton from '../ui/AddButton';
import type { TestimonialItem } from '@/lib/template/types';

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
  onAdd: () => void;
  onUpdate: (id: string, fields: Partial<Omit<TestimonialItem, 'id'>>) => void;
  onRemove: (id: string) => void;
}

export default function TestimonialsSection({
  testimonials,
  onAdd,
  onUpdate,
  onRemove,
}: TestimonialsSectionProps) {
  return (
    <div className="space-y-2">
      {testimonials.map(t => (
        <div
          key={t.id}
          className="bg-background rounded-xl p-2.5 border border-border/50 space-y-1.5"
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 flex-1">
              <Input
                value={t.name}
                onChange={e => onUpdate(t.id, { name: e.target.value })}
                className="h-8 text-xs rounded-lg flex-1"
                placeholder="الاسم"
              />
              <Input
                value={t.role}
                onChange={e => onUpdate(t.id, { role: e.target.value })}
                className="h-8 text-xs rounded-lg flex-1"
                placeholder="المنصب"
              />
            </div>
            <button
              onClick={() => onRemove(t.id)}
              className="text-muted-foreground hover:text-destructive p-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <Textarea
            value={t.text}
            onChange={e => onUpdate(t.id, { text: e.target.value })}
            className="text-xs min-h-[40px] rounded-lg resize-none"
            placeholder="نص الرأي"
          />
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} onClick={() => onUpdate(t.id, { rating: s })} className="p-0.5">
                <Star
                  className={`h-3.5 w-3.5 ${
                    s <= t.rating ? 'text-amber-400 fill-amber-400' : 'text-border'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      ))}
      <AddButton onClick={onAdd} />
    </div>
  );
}
