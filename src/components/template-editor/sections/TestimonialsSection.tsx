'use client';

import { Star, Trash2 } from 'lucide-react';
import { useLanguage } from '@/app/(page)/Dashboard/context/LanguageContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { TestimonialItem } from '@/lib/template/types';
import AddButton from '../ui/AddButton';

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
  const { t } = useLanguage();
  const tt = t.templateEditor;

  return (
    <div className="space-y-2">
      {testimonials.map(testimonial => (
        <div
          key={testimonial.id}
          className="bg-background border-border/50 space-y-1.5 rounded-xl border p-2.5"
        >
          <div className="flex items-center gap-2">
            <div className="flex flex-1 gap-1.5">
              <Input
                value={testimonial.name}
                onChange={event => onUpdate(testimonial.id, { name: event.target.value })}
                className="h-8 flex-1 rounded-lg"
                placeholder={t.orders.name}
              />
              <Input
                value={testimonial.role}
                onChange={event => onUpdate(testimonial.id, { role: event.target.value })}
                className="h-8 flex-1 rounded-lg"
                placeholder={t.templateEditor.defaults.newTestimonialRole}
              />
            </div>

            <button
              onClick={() => onRemove(testimonial.id)}
              className="text-muted-foreground hover:text-destructive p-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <Textarea
            value={testimonial.text}
            onChange={event => onUpdate(testimonial.id, { text: event.target.value })}
            className="min-h-[40px] resize-none rounded-lg"
            placeholder={tt.defaults.newTestimonialText}
          />

          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => onUpdate(testimonial.id, { rating: star })}
                className="p-0.5"
              >
                <Star
                  className={`h-3.5 w-3.5 ${
                    star <= testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-border'
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
