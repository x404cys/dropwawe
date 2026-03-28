'use client';
// src/hooks/useTemplateEditor.ts
// Main hook for the template editor. Follows the same pattern as useStoreSettings.ts:
// — local state with optimistic updates
// — fetch error catches with toast
// — CRUD handlers for each relation model

import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/app/(page)/Dashboard/context/LanguageContext';
import type {
  TemplateFormState,
  ServiceItem,
  WorkItem,
  TestimonialItem,
  BannerItem,
  CategorySectionItem,
  CategoryIconItem,
  CustomFontItem,
} from '@/lib/template/types';
import { toPayload } from '@/lib/template/transform';

// ── Upload helper (client → server route → uploadToServer on disk) ────────────

async function uploadFile(file: File, fallbackMessage: string): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch('/api/storev2/upload-image', {
    method: 'POST',
    body: formData,
  });

  const data = (await res.json()) as { url?: string; error?: string };

  if (!res.ok || !data.url) {
    throw new Error(data.error ?? fallbackMessage);
  }

  return data.url;
}

interface UseTemplateEditorOptions {
  initialData: TemplateFormState;
  storeId: string;
}

const DEFAULT_CATEGORY_ICONS = [
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

// ── Helpers ──────────────────────────────────────────────────────────────────

function nextOrder(arr: { order: number }[]): number {
  return arr.length === 0 ? 0 : Math.max(...arr.map(x => x.order)) + 1;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useTemplateEditor({ initialData, storeId }: UseTemplateEditorOptions) {
  const { t } = useLanguage();
  const tt = t.templateEditor;
  const [formState, setFormState] = useState<TemplateFormState>(initialData);
  const [savedState, setSavedState] = useState<TemplateFormState>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const tempWorkIdMap = useRef<Record<string, string>>({});

  const isDirty = JSON.stringify(formState) !== JSON.stringify(savedState);

  // Generic partial update (for scalar fields only)
  const update = useCallback((partial: Partial<TemplateFormState>) => {
    setFormState(prev => ({ ...prev, ...partial }));
  }, []);

  // ── Save all scalars ──────────────────────────────────────────────────────

  const saveAll = useCallback(async () => {
    setIsSaving(true);
    try {
      const payload = toPayload(formState, storeId);
      const res = await fetch('/api/template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data: unknown = await res.json();
      if (!res.ok) {
        const errMsg = (data as { error?: string })?.error ?? t.error;
        toast.error(errMsg);
        return;
      }
      setSavedState(formState);
      toast.success(t.success, {
        description: tt.actions.saveSuccessDescription,
      });
    } catch {
      toast.error(tt.actions.connectionError);
    } finally {
      setIsSaving(false);
    }
  }, [
    formState,
    storeId,
    t.error,
    t.success,
    tt.actions.connectionError,
    tt.actions.saveSuccessDescription,
  ]);

  // ── Generic relation helpers ──────────────────────────────────────────────

  async function apiPost<T>(url: string, body: unknown): Promise<T | null> {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data: unknown = await res.json();
    if (!res.ok) {
      const msg = (data as { error?: string })?.error ?? t.error;
      throw new Error(msg);
    }
    return data as T;
  }

  async function apiPut<T>(url: string, body: unknown): Promise<T | null> {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data: unknown = await res.json();
    if (!res.ok) {
      const msg = (data as { error?: string })?.error ?? t.error;
      throw new Error(msg);
    }
    return data as T;
  }

  async function apiDelete(url: string, body: unknown): Promise<void> {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data: unknown = await res.json();
      const msg = (data as { error?: string })?.error ?? `${t.error} ${t.delete}`;
      throw new Error(msg);
    }
  }

  // ── Services ─────────────────────────────────────────────────────────────

  const addService = useCallback(async () => {
    const optimistic: ServiceItem = {
      id: `tmp-${Date.now()}`,
      icon: 'Sparkles',
      title: '',
      desc: '',
      name: '',
      description: '',
      worksTitle: '',
      worksDesc: '',
      enabled: true,
      order: formState.services.length,
      works: [],
    };
    setFormState(prev => ({ ...prev, services: [...prev.services, optimistic] }));
    try {
      const created = await apiPost<Partial<ServiceItem>>('/api/template/services', {
        storeId,
        icon: optimistic.icon,
        title: optimistic.title,
        desc: optimistic.desc,
        order: optimistic.order,
      });
      if (created) {
        const normalized: ServiceItem = {
          ...optimistic,
          ...created,
          worksTitle: created.worksTitle ?? optimistic.worksTitle ?? '',
          worksDesc: created.worksDesc ?? optimistic.worksDesc ?? '',
          enabled: created.enabled ?? optimistic.enabled ?? true,
          name: created.name ?? optimistic.name ?? '',
          description: created.description ?? optimistic.description ?? '',
          works: created.works ?? optimistic.works ?? [],
        };
        setFormState(prev => ({
          ...prev,
          services: prev.services.map(s => (s.id === optimistic.id ? normalized : s)),
        }));
      }
    } catch (err) {
      setFormState(prev => ({
        ...prev,
        services: prev.services.filter(s => s.id !== optimistic.id),
      }));
      toast.error((err as Error).message);
    }
  }, [formState.services, storeId]);

  const updateService = useCallback(
    async (id: string, fields: Partial<Omit<ServiceItem, 'id'>>) => {
      const previous = formState.services;
      setFormState(prev => ({
        ...prev,
        services: prev.services.map(s => (s.id === id ? { ...s, ...fields } : s)),
      }));
      try {
        await apiPut('/api/template/services', { storeId, id, ...fields });
      } catch (err) {
        setFormState(prev => ({ ...prev, services: previous }));
        toast.error((err as Error).message);
      }
    },
    [formState.services, storeId, tt.validation.maxWorksReached]
  );

  const removeService = useCallback(
    async (id: string) => {
      const previous = formState.services;
      setFormState(prev => ({ ...prev, services: prev.services.filter(s => s.id !== id) }));
      try {
        await apiDelete('/api/template/services', { storeId, id });
      } catch (err) {
        setFormState(prev => ({ ...prev, services: previous }));
        toast.error((err as Error).message);
      }
    },
    [formState.services, storeId]
  );

  const addServiceWork = useCallback(
    async (serviceId: string) => {
      // ── تحقق من الحد الأقصى ──
      const service = formState.services.find(s => s.id === serviceId);
      if (!service) return;
      if ((service.works ?? []).length >= 6) {
        toast.error(tt.validation.maxWorksReached);
        return;
      }

      const optimistic: WorkItem = {
        id: `tmp-${Date.now()}`,
        title: '',
        category: '',
        link: '',
        image: null,
        icon: '',
        displayType: 'IMAGE',
        order: service.works?.length ?? 0,
        serviceId,
      };

      // ── أضف للـ state أولاً ──
      setFormState(prev => ({
        ...prev,
        services: prev.services.map(s =>
          s.id !== serviceId
            ? s
            : {
                ...s,
                works: [...(s.works ?? []), optimistic],
              }
        ),
      }));

      // ── احفظ في الـ DB ──
      try {
        const created = await apiPost<WorkItem>('/api/template/works', {
          storeId,
          title: optimistic.title,
          category: optimistic.category,
          link: optimistic.link,
          image: optimistic.image,
          icon: optimistic.icon,
          displayType: optimistic.displayType,
          order: optimistic.order,
          serviceId,
        });

        if (created) {
          setFormState(prev => ({
            ...prev,
            services: prev.services.map(s =>
              s.id !== serviceId
                ? s
                : {
                    ...s,
                    works: (s.works ?? []).map(w =>
                      w.id === optimistic.id ? { ...created, serviceId } : w
                    ),
                  }
            ),
          }));
        }
      } catch (err) {
        // ── revert عند الخطأ ──
        setFormState(prev => ({
          ...prev,
          services: prev.services.map(s =>
            s.id !== serviceId
              ? s
              : {
                  ...s,
                  works: (s.works ?? []).filter(w => w.id !== optimistic.id),
                }
          ),
        }));
        toast.error((err as Error).message);
      }
    },
    [formState.services, storeId]
  );
  const updateServiceWork = useCallback(
    async (serviceId: string, workId: string, fields: Partial<Omit<WorkItem, 'id'>>) => {
      const service = formState.services.find(s => s.id === serviceId);
      const previous = service?.works ?? [];

      // ── optimistic update ──
      setFormState(prev => ({
        ...prev,
        services: prev.services.map(s =>
          s.id !== serviceId
            ? s
            : {
                ...s,
                works: (s.works ?? []).map(w => (w.id !== workId ? w : { ...w, ...fields })),
              }
        ),
      }));

      // ── لا تحفظ للـ IDs المؤقتة ──
      if (workId.startsWith('tmp-')) return;

      try {
        await apiPut('/api/template/works', {
          storeId,
          id: workId,
          ...fields,
        });
      } catch (err) {
        setFormState(prev => ({
          ...prev,
          services: prev.services.map(s => (s.id !== serviceId ? s : { ...s, works: previous })),
        }));
        toast.error((err as Error).message);
      }
    },
    [formState.services, storeId]
  );

  const removeServiceWork = useCallback(
    async (serviceId: string, workId: string) => {
      const service = formState.services.find(s => s.id === serviceId);
      const previous = service?.works ?? [];

      setFormState(prev => ({
        ...prev,
        services: prev.services.map(s =>
          s.id !== serviceId
            ? s
            : {
                ...s,
                works: (s.works ?? []).filter(w => w.id !== workId),
              }
        ),
      }));

      if (workId.startsWith('tmp-')) return;

      try {
        await apiDelete('/api/template/works', { storeId, id: workId });
      } catch (err) {
        setFormState(prev => ({
          ...prev,
          services: prev.services.map(s => (s.id !== serviceId ? s : { ...s, works: previous })),
        }));
        toast.error((err as Error).message);
      }
    },
    [formState.services, storeId]
  );

  // ── Works ────────────────────────────────────────────────────────────────

  const addWork = useCallback(async () => {
    const optimistic: WorkItem = {
      id: `tmp-${Date.now()}`,
      title: '',
      category: '',
      link: '',
      image: null,
      icon: '',
      displayType: 'IMAGE',
      order: nextOrder(formState.works),
      serviceId: null,
    };
    setFormState(prev => ({ ...prev, works: [...prev.works, optimistic] }));
    try {
      const created = await apiPost<WorkItem>('/api/template/works', {
        storeId,
        title: optimistic.title,
        category: optimistic.category,
        link: optimistic.link,
        image: optimistic.image,
        icon: optimistic.icon,
        displayType: optimistic.displayType,
        order: optimistic.order,
        serviceId: optimistic.serviceId,
      });
      if (created) {
        tempWorkIdMap.current[optimistic.id] = created.id;
        const pendingSync: { value: WorkItem | null } = { value: null };
        setFormState(prev => ({
          ...prev,
          works: prev.works.map(w => {
            if (w.id !== optimistic.id) return w;
            pendingSync.value = { ...w, id: created.id };
            return {
              ...created,
              ...w,
              id: created.id,
            };
          }),
        }));
        if (pendingSync.value) {
          await apiPut('/api/template/works', {
            storeId,
            id: created.id,
            title: pendingSync.value.title,
            category: pendingSync.value.category,
            link: pendingSync.value.link,
            image: pendingSync.value.image,
            order: pendingSync.value.order,
          });
        }
      }
    } catch (err) {
      delete tempWorkIdMap.current[optimistic.id];
      setFormState(prev => ({ ...prev, works: prev.works.filter(w => w.id !== optimistic.id) }));
      toast.error((err as Error).message);
    }
  }, [formState.works, storeId]);

  const updateWork = useCallback(
    async (id: string, fields: Partial<Omit<WorkItem, 'id'>>) => {
      const resolvedId = tempWorkIdMap.current[id] ?? id;
      const previous = formState.works;
      setFormState(prev => ({
        ...prev,
        works: prev.works.map(w => (w.id === id || w.id === resolvedId ? { ...w, ...fields } : w)),
      }));
      if (resolvedId.startsWith('tmp-')) return;
      try {
        await apiPut('/api/template/works', { storeId, id: resolvedId, ...fields });
      } catch (err) {
        setFormState(prev => ({ ...prev, works: previous }));
        toast.error((err as Error).message);
      }
    },
    [formState.works, storeId]
  );

  const removeWork = useCallback(
    async (id: string) => {
      const resolvedId = tempWorkIdMap.current[id] ?? id;
      const previous = formState.works;
      setFormState(prev => ({
        ...prev,
        works: prev.works.filter(w => w.id !== id && w.id !== resolvedId),
      }));
      if (resolvedId.startsWith('tmp-')) return;
      try {
        await apiDelete('/api/template/works', { storeId, id: resolvedId });
        delete tempWorkIdMap.current[id];
      } catch (err) {
        setFormState(prev => ({ ...prev, works: previous }));
        toast.error((err as Error).message);
      }
    },
    [formState.works, storeId]
  );

  type UploadWorkImage = {
    (workId: string, file: File): void;
    (serviceId: string, workId: string, file: File): void;
  };

  const uploadWorkImage: UploadWorkImage = useCallback(
    async (arg1: string, arg2: string | File, arg3?: File) => {
      if (arg2 instanceof File) {
        const workId = arg1;
        const file = arg2;
        try {
          const imageUrl = await uploadFile(file, tt.validation.uploadFileFailed);
          await updateWork(workId, {
            image: imageUrl,
            displayType: 'IMAGE',
          });
        } catch (err) {
          toast.error((err as Error).message);
        }
        return;
      }

      if (!arg3) return;

      const serviceId = arg1;
      const workId = arg2;
      const file = arg3;

      // Optimistic preview with base64
      const reader = new FileReader();
      reader.onload = e => {
        const base64 = e.target?.result as string;
        setFormState(prev => ({
          ...prev,
          services: prev.services.map(s =>
            s.id !== serviceId
              ? s
              : {
                  ...s,
                  works: (s.works ?? []).map(w => (w.id !== workId ? w : { ...w, image: base64 })),
                }
          ),
        }));
      };
      reader.readAsDataURL(file);

      // Upload and persist to server
      try {
        const imageUrl = await uploadFile(file, tt.validation.uploadFileFailed);
        await updateServiceWork(serviceId, workId, {
          image: imageUrl,
          displayType: 'IMAGE',
        });
      } catch (err) {
        toast.error((err as Error).message);
      }
    },
    [tt.validation.uploadFileFailed, updateWork, updateServiceWork]
  );

  // Testimonials
  const addTestimonial = useCallback(async () => {
    const optimistic: TestimonialItem = {
      id: `tmp-${Date.now()}`,
      name: tt.defaults.newTestimonialName,
      role: tt.defaults.newTestimonialRole,
      text: tt.defaults.newTestimonialText,
      rating: 5,
      order: nextOrder(formState.testimonials),
    };
    setFormState(prev => ({ ...prev, testimonials: [...prev.testimonials, optimistic] }));
    try {
      const created = await apiPost<TestimonialItem>('/api/template/testimonials', {
        storeId,
        ...optimistic,
      });
      if (created) {
        setFormState(prev => ({
          ...prev,
          testimonials: prev.testimonials.map(t => (t.id === optimistic.id ? created : t)),
        }));
      }
    } catch (err) {
      setFormState(prev => ({
        ...prev,
        testimonials: prev.testimonials.filter(t => t.id !== optimistic.id),
      }));
      toast.error((err as Error).message);
    }
  }, [
    formState.testimonials,
    storeId,
    tt.defaults.newTestimonialName,
    tt.defaults.newTestimonialRole,
    tt.defaults.newTestimonialText,
  ]);

  const updateTestimonial = useCallback(
    async (id: string, fields: Partial<Omit<TestimonialItem, 'id'>>) => {
      const previous = formState.testimonials;
      setFormState(prev => ({
        ...prev,
        testimonials: prev.testimonials.map(t => (t.id === id ? { ...t, ...fields } : t)),
      }));
      try {
        await apiPut('/api/template/testimonials', { storeId, id, ...fields });
      } catch (err) {
        setFormState(prev => ({ ...prev, testimonials: previous }));
        toast.error((err as Error).message);
      }
    },
    [formState.testimonials, storeId]
  );

  const removeTestimonial = useCallback(
    async (id: string) => {
      const previous = formState.testimonials;
      setFormState(prev => ({ ...prev, testimonials: prev.testimonials.filter(t => t.id !== id) }));
      try {
        await apiDelete('/api/template/testimonials', { storeId, id });
      } catch (err) {
        setFormState(prev => ({ ...prev, testimonials: previous }));
        toast.error((err as Error).message);
      }
    },
    [formState.testimonials, storeId]
  );

  // Banners
  const addBanner = useCallback(
    async (file: File) => {
      const optimistic: BannerItem = {
        id: `tmp-${Date.now()}`,
        url: URL.createObjectURL(file),
        order: nextOrder(formState.bannerImages),
        postion: 'top',
      };
      setFormState(prev => ({ ...prev, bannerImages: [...prev.bannerImages, optimistic] }));
      try {
        const url = await uploadFile(file, tt.validation.uploadFileFailed);
        const created = await apiPost<BannerItem>('/api/template/banners', {
          storeId,
          url,
          order: optimistic.order,
          postion: optimistic.postion,
        });
        if (created) {
          setFormState(prev => ({
            ...prev,
            bannerImages: prev.bannerImages.map(b => (b.id === optimistic.id ? created : b)),
          }));
        }
      } catch (err) {
        setFormState(prev => ({
          ...prev,
          bannerImages: prev.bannerImages.filter(b => b.id !== optimistic.id),
        }));
        toast.error((err as Error).message);
      }
    },
    [formState.bannerImages, storeId, tt.validation.uploadFileFailed]
  );

  const removeBanner = useCallback(
    async (id: string) => {
      const previous = formState.bannerImages;
      setFormState(prev => ({ ...prev, bannerImages: prev.bannerImages.filter(b => b.id !== id) }));
      try {
        await apiDelete('/api/template/banners', { storeId, id });
      } catch (err) {
        setFormState(prev => ({ ...prev, bannerImages: previous }));
        toast.error((err as Error).message);
      }
    },
    [formState.bannerImages, storeId]
  );

  const updatePostionBanner = useCallback(
    async (id: string, postion: string) => {
      const previous = formState.bannerImages;
      setFormState(prev => ({
        ...prev,
        bannerImages: prev.bannerImages.map(b => (b.id === id ? { ...b, postion } : b)),
      }));
      try {
        await apiPut('/api/template/banners', { storeId, id, postion });
      } catch (err) {
        setFormState(prev => ({ ...prev, bannerImages: previous }));
        toast.error((err as Error).message);
      }
    },
    [formState.bannerImages, storeId]
  );

  // Category Sections
  const addCategorySection = useCallback(
    async (category: string) => {
      const optimistic: CategorySectionItem = {
        id: `tmp-${Date.now()}`,
        category,
        enabled: true,
        order: nextOrder(formState.categorySections),
      };
      setFormState(prev => ({ ...prev, categorySections: [...prev.categorySections, optimistic] }));
      try {
        const created = await apiPost<CategorySectionItem>('/api/template/category-sections', {
          storeId,
          ...optimistic,
        });
        if (created) {
          setFormState(prev => ({
            ...prev,
            categorySections: prev.categorySections.map(cs =>
              cs.id === optimistic.id ? created : cs
            ),
          }));
        }
      } catch (err) {
        setFormState(prev => ({
          ...prev,
          categorySections: prev.categorySections.filter(cs => cs.id !== optimistic.id),
        }));
        toast.error((err as Error).message);
      }
    },
    [formState.categorySections, storeId]
  );

  const updateCategorySection = useCallback(
    async (id: string, category: string) => {
      const previous = formState.categorySections;
      setFormState(prev => ({
        ...prev,
        categorySections: prev.categorySections.map(cs =>
          cs.id === id ? { ...cs, category } : cs
        ),
      }));
      try {
        await apiPut('/api/template/category-sections', {
          storeId,
          action: 'update',
          id,
          category,
        });
      } catch (err) {
        setFormState(prev => ({ ...prev, categorySections: previous }));
        toast.error((err as Error).message);
      }
    },
    [formState.categorySections, storeId]
  );

  const toggleCategorySection = useCallback(
    async (id: string) => {
      const previous = formState.categorySections;
      setFormState(prev => ({
        ...prev,
        categorySections: prev.categorySections.map(cs =>
          cs.id === id ? { ...cs, enabled: !cs.enabled } : cs
        ),
      }));
      try {
        await apiPut('/api/template/category-sections', { storeId, action: 'toggle', id });
      } catch (err) {
        setFormState(prev => ({ ...prev, categorySections: previous }));
        toast.error((err as Error).message);
      }
    },
    [formState.categorySections, storeId]
  );

  const moveCategorySection = useCallback(
    async (index: number, direction: -1 | 1) => {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= formState.categorySections.length) return;
      const previous = formState.categorySections;
      const arr = [...formState.categorySections];
      [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
      const reordered = arr.map((cs, i) => ({ ...cs, order: i }));
      setFormState(prev => ({ ...prev, categorySections: reordered }));
      try {
        await apiPut('/api/template/category-sections', {
          storeId,
          action: 'reorder',
          items: reordered.map(cs => ({ id: cs.id, order: cs.order })),
        });
      } catch (err) {
        setFormState(prev => ({ ...prev, categorySections: previous }));
        toast.error((err as Error).message);
      }
    },
    [formState.categorySections, storeId]
  );

  const removeCategorySection = useCallback(
    async (id: string) => {
      const previous = formState.categorySections;
      setFormState(prev => ({
        ...prev,
        categorySections: prev.categorySections.filter(cs => cs.id !== id),
      }));
      try {
        await apiDelete('/api/template/category-sections', { storeId, id });
      } catch (err) {
        setFormState(prev => ({ ...prev, categorySections: previous }));
        toast.error((err as Error).message);
      }
    },
    [formState.categorySections, storeId]
  );

  // Category Icons
  const updateCategoryIcon = useCallback(
    async (id: string, fields: Partial<Omit<CategoryIconItem, 'id'>>) => {
      const previous = formState.categoryIcons;
      setFormState(prev => ({
        ...prev,
        categoryIcons: prev.categoryIcons.map(ci => (ci.id === id ? { ...ci, ...fields } : ci)),
      }));
      try {
        await apiPut('/api/template/category-icons', { storeId, id, ...fields });
      } catch (err) {
        setFormState(prev => ({ ...prev, categoryIcons: previous }));
        toast.error((err as Error).message);
      }
    },
    [formState.categoryIcons, storeId]
  );

  const ensureCategoryIcons = useCallback(
    async (categories: string[]) => {
      const normalized = Array.from(new Set(categories.map(c => c.trim()).filter(Boolean)));
      const missing = normalized.filter(
        category => !formState.categoryIcons.some(ci => ci.category === category)
      );
      if (missing.length === 0) return;

      const baseLength = formState.categoryIcons.length;
      const optimisticItems: CategoryIconItem[] = missing.map((category, idx) => ({
        id: `tmp-cat-${Date.now()}-${idx}`,
        category,
        icon: DEFAULT_CATEGORY_ICONS[(baseLength + idx) % DEFAULT_CATEGORY_ICONS.length],
        image: null,
      }));

      setFormState(prev => ({
        ...prev,
        categoryIcons: [...prev.categoryIcons, ...optimisticItems],
      }));

      try {
        for (const item of optimisticItems) {
          const created = await apiPost<CategoryIconItem>('/api/template/category-icons', {
            storeId,
            category: item.category,
            icon: item.icon,
            image: null,
          });
          if (created) {
            setFormState(prev => ({
              ...prev,
              categoryIcons: prev.categoryIcons.map(ci => (ci.id === item.id ? created : ci)),
            }));
          }
        }
      } catch (err) {
        const optimisticIds = new Set(optimisticItems.map(item => item.id));
        setFormState(prev => ({
          ...prev,
          categoryIcons: prev.categoryIcons.filter(ci => !optimisticIds.has(ci.id)),
        }));
        toast.error((err as Error).message);
      }
    },
    [formState.categoryIcons, storeId]
  );

  // Custom Fonts
  const addCustomFont = useCallback(
    async (name: string, file: File): Promise<boolean> => {
      if (formState.customFonts.some(f => f.name === name)) {
        return true;
      }
      const optimistic: CustomFontItem = { id: `tmp-${Date.now()}`, name, url: '' };
      setFormState(prev => ({ ...prev, customFonts: [...prev.customFonts, optimistic] }));
      try {
        const url = await uploadFile(file, tt.validation.uploadFileFailed);
        const created = await apiPost<CustomFontItem>('/api/template/fonts', {
          storeId,
          name,
          url,
        });
        if (created) {
          setFormState(prev => ({
            ...prev,
            customFonts: prev.customFonts.map(f => (f.id === optimistic.id ? created : f)),
          }));
        }
        return true;
      } catch (err) {
        setFormState(prev => ({
          ...prev,
          customFonts: prev.customFonts.filter(f => f.id !== optimistic.id),
        }));
        toast.error((err as Error).message);
        return false;
      }
    },
    [formState.customFonts, storeId, tt.validation.uploadFileFailed]
  );

  const removeCustomFont = useCallback(
    async (id: string, name: string) => {
      const previous = formState.customFonts;
      const previousHeading = formState.headingFont;
      const previousBody = formState.bodyFont;
      setFormState(prev => ({
        ...prev,
        customFonts: prev.customFonts.filter(f => f.id !== id),
        headingFont: prev.headingFont === name ? 'IBM Plex Sans Arabic' : prev.headingFont,
        bodyFont: prev.bodyFont === name ? 'IBM Plex Sans Arabic' : prev.bodyFont,
      }));
      try {
        await apiDelete('/api/template/fonts', { storeId, id });
      } catch (err) {
        setFormState(prev => ({
          ...prev,
          customFonts: previous,
          headingFont: previousHeading,
          bodyFont: previousBody,
        }));
        toast.error((err as Error).message);
      }
    },
    [formState, storeId]
  );

  // Return
  return {
    formState,
    update,
    isDirty,
    isSaving,
    saveAll,
    // services
    addService,
    updateService,
    removeService,
    addServiceWork,
    updateServiceWork,
    removeServiceWork,
    // works
    addWork,
    updateWork,
    uploadWorkImage,
    removeWork,
    // testimonials
    addTestimonial,
    updateTestimonial,
    removeTestimonial,
    // banners
    addBanner,
    removeBanner,
    updatePostionBanner,
    // category sections
    addCategorySection,
    updateCategorySection,
    toggleCategorySection,
    moveCategorySection,
    removeCategorySection,
    // category icons
    updateCategoryIcon,
    ensureCategoryIcons,
    // fonts
    addCustomFont,
    removeCustomFont,
  };
}
