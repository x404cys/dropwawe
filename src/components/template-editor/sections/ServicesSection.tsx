'use client';
// src/components/template-editor/sections/ServicesSection.tsx
// Renders the services list with add/edit/remove capabilities.

import { Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import AddButton from '../ui/AddButton';
import type { ServiceItem } from '@/lib/template/types';

interface ServicesSectionProps {
  services: ServiceItem[];
  onAdd: () => void;
  onUpdate: (id: string, fields: Partial<Omit<ServiceItem, 'id'>>) => void;
  onRemove: (id: string) => void;
}

export default function ServicesSection({
  services,
  onAdd,
  onUpdate,
  onRemove,
}: ServicesSectionProps) {
  return (
    <div className="space-y-2">
      {services.map(service => (
        <div
          key={service.id}
          className="bg-background border-border/50 flex items-start gap-2 rounded-xl border p-2.5"
        >
          <div className="flex-1 space-y-1.5">
            <Input
              value={service.title}
              onChange={e => onUpdate(service.id, { title: e.target.value })}
              className="h-8 rounded-lg font-medium"
              placeholder="اسم الخدمة"
            />
            <Input
              value={service.desc}
              onChange={e => onUpdate(service.id, { desc: e.target.value })}
              className="h-8 rounded-lg"
              placeholder="وصف مختصر"
            />
          </div>

          <button
            onClick={() => onRemove(service.id)}
            className="text-muted-foreground hover:text-destructive mt-1 p-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <AddButton onClick={onAdd} />
    </div>
  );
}
