'use client';
// src/components/template-editor/sections/WorksSection.tsx
// Renders the portfolio works list with image-first cards and preview support.

import { useState, type ChangeEvent } from 'react';
import { Eye, Trash2, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddButton from '../ui/AddButton';
import type { WorkItem } from '@/lib/template/types';

interface WorksSectionProps {
  works: WorkItem[];
  onAdd: () => void;
  onUpdate: (id: string, fields: Partial<Omit<WorkItem, 'id'>>) => void;
  onRemove: (id: string) => void;
  onUploadImage: (id: string, file: File) => void;
}

interface PreviewState {
  src: string;
  title: string;
}

export default function WorksSection({
  works,
  onAdd,
  onUpdate,
  onRemove,
  onUploadImage,
}: WorksSectionProps) {
  const [previewImage, setPreviewImage] = useState<PreviewState | null>(null);

  const handleImageUpload = (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onUploadImage(id, file);
    e.target.value = '';
  };

  return (
    <>
      <div className="space-y-2">
        {works.map(work => {
          const fileInputId = `work-image-${work.id}`;
          const imageSrc = work.image;
          const previewTitle = work.title.trim() || 'معاينة صورة العمل';

          return (
            <div
              key={work.id}
              className="bg-background border-border/50 space-y-3 rounded-xl border p-3"
            >
              <div className="border-border/60 bg-muted/20 overflow-hidden rounded-xl border">
                {imageSrc ? (
                  <button
                    type="button"
                    onClick={() => setPreviewImage({ src: imageSrc, title: previewTitle })}
                    className="group relative block w-full text-right"
                  >
                    <img
                      src={imageSrc}
                      alt={previewTitle}
                      className="h-40 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/75 via-black/10 to-transparent px-3 py-3 text-white">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold">
                          {work.title || 'اسم المشروع'}
                        </p>
                        <p className="truncate text-[10px] text-white/75">
                          {work.category || 'بدون تصنيف'}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/35 px-2 py-1 text-[10px] font-medium backdrop-blur-sm">
                        <Eye className="h-3 w-3" />
                        بريفيو
                      </span>
                    </div>
                  </button>
                ) : (
                  <label
                    htmlFor={fileInputId}
                    className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 px-4 text-center"
                  >
                    <div className="bg-background text-muted-foreground flex h-10 w-10 items-center justify-center rounded-full border border-border/60">
                      <Upload className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-foreground text-xs font-medium">الصورة تظهر هنا أولاً</p>
                      <p className="text-muted-foreground text-[10px]">
                        اضغط لرفع صورة المشروع
                      </p>
                    </div>
                  </label>
                )}

                <input
                  id={fileInputId}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload(work.id)}
                  className="hidden"
                />
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor={fileInputId}
                  className="border-border bg-muted/30 text-foreground hover:border-primary/40 hover:text-primary flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[11px] font-medium transition-all"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {imageSrc ? 'تغيير الصورة' : 'رفع الصورة'}
                </label>

                {imageSrc && (
                  <button
                    type="button"
                    onClick={() => setPreviewImage({ src: imageSrc, title: previewTitle })}
                    className="border-border bg-background text-foreground hover:border-primary/40 hover:text-primary inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[11px] font-medium transition-all"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    بريفيو
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onRemove(work.id)}
                  className="text-muted-foreground hover:text-destructive border-border/60 flex h-9 w-9 items-center justify-center rounded-lg border transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                <Input
                  value={work.title}
                  onChange={e => onUpdate(work.id, { title: e.target.value })}
                  className="h-8 rounded-lg text-xs font-medium"
                  placeholder="اسم المشروع"
                />

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Input
                    value={work.category}
                    onChange={e => onUpdate(work.id, { category: e.target.value })}
                    className="h-8 rounded-lg text-[11px]"
                    placeholder="التصنيف"
                  />

                  <Input
                    value={work.link}
                    onChange={e => onUpdate(work.id, { link: e.target.value })}
                    className="h-8 rounded-lg text-[11px]"
                    placeholder="الرابط (اختياري)"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          );
        })}

        <AddButton onClick={onAdd} />
      </div>

      <Dialog open={Boolean(previewImage)} onOpenChange={open => !open && setPreviewImage(null)}>
        <DialogContent dir="rtl" className="max-w-3xl overflow-hidden border-border/60 p-0">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="text-base">
              {previewImage?.title || 'معاينة الصورة'}
            </DialogTitle>
          </DialogHeader>

          {previewImage?.src && (
            <div className="p-4 pt-2">
              <div className="bg-muted/20 border-border/50 overflow-hidden rounded-2xl border">
                <img
                  src={previewImage.src}
                  alt={previewImage.title}
                  className="max-h-[75vh] w-full object-contain"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
