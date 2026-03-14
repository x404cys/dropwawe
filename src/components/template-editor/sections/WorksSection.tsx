'use client';

import { useState, type ChangeEvent } from 'react';
import * as LucideIcons from 'lucide-react';
import {
  Trash2,
  Upload,
  Eye,
  ChevronDown,
  ChevronUp,
  EyeOff,
  ImagePlus,
  Image as ImageIcon,
  Shapes,
  X,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddButton from '../ui/AddButton';
import { ServiceItem, WorkItem } from '@/lib/template/types';
import IconPickerDialog from '../ui/IconPickerDialog';

interface Props {
  services: ServiceItem[];
  onAddService: () => void;
  onUpdateService: (id: string, fields: Partial<Omit<ServiceItem, 'id' | 'works'>>) => void;
  onRemoveService: (id: string) => void;
  onAddWork: (serviceId: string) => void;
  onUpdateWork: (serviceId: string, workId: string, fields: Partial<Omit<WorkItem, 'id'>>) => void;
  onRemoveWork: (serviceId: string, workId: string) => void;
  onUploadWorkImage: (serviceId: string, workId: string, file: File) => void;
}

function getLucideIcon(iconName?: string) {
  if (!iconName?.trim()) return null;

  const IconComponent = LucideIcons[iconName.trim() as keyof typeof LucideIcons];
  if (!IconComponent || typeof IconComponent !== 'function') return null;

  return IconComponent as React.ComponentType<{ className?: string }>;
}

export default function ServiceWithWorksSection({
  services,
  onAddService,
  onUpdateService,
  onRemoveService,
  onAddWork,
  onUpdateWork,
  onRemoveWork,
  onUploadWorkImage,
}: Props) {
  const MAX_WORKS = 6;
  const [expandedServices, setExpandedServices] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedServices(prev => (prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]));
  };

  const handleImageUpload =
    (serviceId: string, workId: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      onUploadWorkImage(serviceId, workId, file);
      e.target.value = '';
    };

  return (
    <>
      <div className="space-y-3">
        {services.map(service => {
          const isExpanded = expandedServices.includes(service.id);
          const works = service.works ?? [];
          const hasWorks = works.length > 0;

          return (
            <div
              key={service.id}
              className="bg-background border-border/50 overflow-hidden rounded-xl border"
            >
              <div className="flex items-start gap-2 p-3">
                <div className="flex-1 space-y-1.5">
                  <Input
                    value={service.worksTitle}
                    onChange={e => onUpdateService(service.id, { worksTitle: e.target.value })}
                    className="h-8 rounded-lg font-medium"
                    placeholder='عنوان الأعمال — مثال: "أعمالي في التصميم"'
                  />
                  <Input
                    value={service.worksDesc}
                    onChange={e => onUpdateService(service.id, { worksDesc: e.target.value })}
                    className="h-8 rounded-lg"
                    placeholder="وصف مختصر للأعمال (اختياري)"
                  />
                </div>

                <div className="mt-1 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onUpdateService(service.id, { enabled: !service.enabled })}
                    className="text-muted-foreground hover:text-foreground border-border/60 flex h-8 w-8 items-center justify-center rounded-lg border transition-colors"
                    title={service.enabled ? 'إخفاء الخدمة' : 'إظهار الخدمة'}
                  >
                    {service.enabled ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="text-muted-foreground/50 h-3.5 w-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleExpand(service.id)}
                    className="text-muted-foreground hover:text-foreground border-border/60 flex h-8 w-8 items-center justify-center rounded-lg border transition-colors"
                    title="أعمال هذه الخدمة"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveService(service.id)}
                    className="text-muted-foreground hover:text-destructive flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {!service.enabled && (
                <div className="bg-muted/30 border-border/30 border-t px-3 py-1.5">
                  <p className="text-muted-foreground text-[10px]">مخفية — لن تظهر في المتجر</p>
                </div>
              )}

              {isExpanded && (
                <div className="border-border/40 bg-muted/20 space-y-3 border-t px-3 pt-3 pb-3">
                  <div className="space-y-2">
                    {!hasWorks && (
                      <div className="bg-background border-border/50 rounded-xl border border-dashed p-4">
                        <div className="border-border/60 bg-muted/20 flex h-40 flex-col items-center justify-center rounded-xl border border-dashed px-4 text-center">
                          <div className="bg-background text-muted-foreground border-border/60 mb-3 flex h-11 w-11 items-center justify-center rounded-full border">
                            <ImagePlus className="h-5 w-5" />
                          </div>

                          <p className="text-foreground text-sm font-medium">لا توجد أعمال بعد</p>
                          <p className="text-muted-foreground mt-1 text-xs">
                            أضف عمل جديد حتى تظهر الصورة أو الأيقونة والبيانات هنا
                          </p>

                          <div className="mt-4 w-full max-w-[220px]">
                            <AddButton onClick={() => onAddWork(service.id)} />
                          </div>
                        </div>
                      </div>
                    )}

                    {works.map(work => {
                      const fileInputId = `work-image-${work.id}`;
                      const previewTitle = work.category?.trim() || work.title?.trim() || 'معاينة';
                      const showType = work.displayType ?? 'IMAGE';
                      const SelectedIcon = getLucideIcon(work.icon);

                      return (
                        <div
                          key={work.id}
                          className="bg-background border-border/50 space-y-3 rounded-xl border p-2.5"
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateWork(service.id, work.id, {
                                  displayType: 'IMAGE',
                                })
                              }
                              className={`flex h-9 items-center justify-center gap-2 rounded-lg border text-xs font-medium transition-all ${
                                showType === 'IMAGE'
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-border bg-muted/20 text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              <ImageIcon className="h-4 w-4" />
                              صورة
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                onUpdateWork(service.id, work.id, {
                                  displayType: 'ICON',
                                })
                              }
                              className={`flex h-9 items-center justify-center gap-2 rounded-lg border text-xs font-medium transition-all ${
                                showType === 'ICON'
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-border bg-muted/20 text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              <Shapes className="h-4 w-4" />
                              أيقونة
                            </button>
                          </div>

                          {showType === 'IMAGE' && (
                            <>
                              <div className="border-border/60 bg-muted/20 overflow-hidden rounded-xl border">
                                {work.image ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setPreviewImage({ src: work.image!, title: previewTitle })
                                    }
                                    className="group relative block w-full"
                                  >
                                    <img
                                      src={work.image}
                                      alt={previewTitle}
                                      className="h-36 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/75 via-black/10 to-transparent px-3 py-3 text-white">
                                      <div className="min-w-0">
                                        <p className="truncate text-xs font-semibold">
                                          {work.category || work.title || 'بدون عنوان'}
                                        </p>
                                        <p className="truncate text-[10px] text-white/75">
                                          {work.link || 'بدون رابط'}
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
                                    className="flex h-36 cursor-pointer flex-col items-center justify-center gap-2"
                                  >
                                    <div className="bg-background text-muted-foreground border-border/60 flex h-9 w-9 items-center justify-center rounded-full border">
                                      <Upload className="h-4 w-4" />
                                    </div>
                                    <p className="text-muted-foreground text-[10px]">
                                      اضغط لرفع صورة المشروع
                                    </p>
                                  </label>
                                )}

                                <input
                                  id={fileInputId}
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload(service.id, work.id)}
                                  className="hidden"
                                />
                              </div>

                              <div className="flex items-center gap-2">
                                <label
                                  htmlFor={fileInputId}
                                  className="border-border bg-muted/30 text-foreground hover:border-primary/40 hover:text-primary flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-all"
                                >
                                  <Upload className="h-3.5 w-3.5" />
                                  {work.image ? 'تغيير الصورة' : 'رفع صورة'}
                                </label>

                                {work.image && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setPreviewImage({ src: work.image!, title: previewTitle })
                                      }
                                      className="border-border bg-background text-foreground hover:border-primary/40 hover:text-primary inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-all"
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                      بريفيو
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        onUpdateWork(service.id, work.id, { image: null })
                                      }
                                      className="border-border bg-background text-muted-foreground hover:text-destructive inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-all"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                      حذف الصورة
                                    </button>
                                  </>
                                )}

                                <button
                                  type="button"
                                  onClick={() => onRemoveWork(service.id, work.id)}
                                  className="text-muted-foreground hover:text-destructive border-border/60 flex h-8 w-8 items-center justify-center rounded-lg border transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </>
                          )}

                          {showType === 'ICON' && (
                            <>
                              <div className="border-border/60 bg-muted/20 overflow-hidden rounded-xl border">
                                <div className="flex h-36 flex-col items-center justify-center gap-3 px-4 text-center">
                                  <div className="bg-background border-border/60 flex h-16 w-16 items-center justify-center rounded-2xl border">
                                    {SelectedIcon ? (
                                      <SelectedIcon className="text-primary h-8 w-8" />
                                    ) : (
                                      <Shapes className="text-muted-foreground h-8 w-8" />
                                    )}
                                  </div>

                                  <div className="min-w-0">
                                    <p className="text-foreground truncate text-xs font-semibold">
                                      {work.icon?.trim() ? work.icon : 'اختر أيقونة للمشروع'}
                                    </p>
                                    <p className="text-muted-foreground mt-1 text-[10px]">
                                      {work.icon?.trim()
                                        ? 'الأيقونة المختارة ستظهر بدل الصورة'
                                        : 'اضغط بالأسفل لاختيار أيقونة من Lucide'}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="flex-1">
                                  <IconPickerDialog
                                    value={work.icon}
                                    onChange={iconName =>
                                      onUpdateWork(service.id, work.id, {
                                        icon: iconName,
                                        displayType: 'ICON',
                                      })
                                    }
                                    onClear={() =>
                                      onUpdateWork(service.id, work.id, {
                                        icon: '',
                                      })
                                    }
                                  />
                                </div>

                                {work.icon?.trim() && (
                                  <button
                                    type="button"
                                    onClick={() => onUpdateWork(service.id, work.id, { icon: '' })}
                                    className="border-border bg-background text-muted-foreground hover:text-destructive inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-all"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                    حذف الأيقونة
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => onRemoveWork(service.id, work.id)}
                                  className="text-muted-foreground hover:text-destructive border-border/60 flex h-8 w-8 items-center justify-center rounded-lg border transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </>
                          )}

                          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                            <Input
                              value={work.title}
                              onChange={e =>
                                onUpdateWork(service.id, work.id, { title: e.target.value })
                              }
                              className="h-8 rounded-lg"
                              placeholder="العنوان"
                            />
                            <Input
                              value={work.category}
                              onChange={e =>
                                onUpdateWork(service.id, work.id, { category: e.target.value })
                              }
                              className="h-8 rounded-lg"
                              placeholder="التصنيف"
                            />
                            <Input
                              value={work.link}
                              onChange={e =>
                                onUpdateWork(service.id, work.id, { link: e.target.value })
                              }
                              className="h-8 rounded-lg"
                              placeholder="الرابط (اختياري)"
                              dir="ltr"
                            />
                          </div>
                        </div>
                      );
                    })}

                    {hasWorks && works.length < MAX_WORKS ? (
                      <AddButton onClick={() => onAddWork(service.id)} />
                    ) : null}

                    {hasWorks && works.length >= MAX_WORKS && (
                      <p className="text-muted-foreground py-2 text-center text-[11px]">
                        وصلت للحد الأقصى (6 أعمال لكل خدمة)
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <AddButton onClick={onAddService} />
      </div>

      <Dialog open={Boolean(previewImage)} onOpenChange={open => !open && setPreviewImage(null)}>
        <DialogContent dir="rtl" className="border-border/60 max-w-3xl overflow-hidden p-0">
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
