'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import type {
  HeroFeatureItem,
  HeroSectionItem,
  HeroStatItem,
  HeroTrustItem,
} from '@/lib/template/types';

// ─── File upload helper ───────────────────────────────────────────────────────

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch('/api/storev2/upload-image', {
    method: 'POST',
    body: formData,
  });

  const data = (await res.json()) as { url?: string; error?: string };

  if (!res.ok || !data.url) {
    throw new Error(data.error ?? 'فشل رفع الملف');
  }

  return data.url;
}

// ─── Dirty section tracking ───────────────────────────────────────────────────
// Instead of one isDirty flag we track which logical section changed.
// saveHero() sends only the sections that actually have pending changes.

type DirtySections = {
  core: boolean; // scalar fields (text, layout, colors, toggles…)
  images: boolean; // heroImage, heroImageMobile, backgroundImage, backgroundImageMobile
  stats: boolean;
  features: boolean;
  trustItems: boolean;
};

const CLEAN: DirtySections = {
  core: false,
  images: false,
  stats: false,
  features: false,
  trustItems: false,
};

const IMAGE_FIELDS = new Set<keyof HeroSectionItem>([
  'heroImage',
  'heroImageMobile',
  'backgroundImage',
  'backgroundImageMobile',
]);

const LIST_FIELDS = new Set<keyof HeroSectionItem>(['stats', 'features', 'trustItems']);

function classifyPatch(partial: Partial<HeroSectionItem>): Partial<DirtySections> {
  const result: Partial<DirtySections> = {};
  for (const key of Object.keys(partial) as (keyof HeroSectionItem)[]) {
    if (IMAGE_FIELDS.has(key)) result.images = true;
    else if (!LIST_FIELDS.has(key)) result.core = true;
  }
  return result;
}

// ─── Defaults & helpers ───────────────────────────────────────────────────────

const createId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;

const DEFAULT_HERO: HeroSectionItem = {
  id: 'hero_default',
  enabled: true,
  visible: true,
  order: 0,

  badgeText: '',
  badgeIcon: '',
  overline: '',
  title: '',
  highlightText: '',
  subtitle: '',
  description: '',

  trustText: '',
  smallNote: '',

  primaryButtonText: '',
  primaryButtonLink: '',
  primaryButtonIcon: '',

  secondaryButtonText: '',
  secondaryButtonLink: '',
  secondaryButtonIcon: '',

  heroImage: null,
  heroImageAlt: '',
  heroImageMobile: null,

  backgroundType: 'COLOR',
  backgroundImage: null,
  backgroundImageMobile: null,
  backgroundColor: '#0f172a',
  backgroundGradientFrom: '#111827',
  backgroundGradientVia: '#0f172a',
  backgroundGradientTo: '#1d4ed8',

  overlayEnabled: true,
  overlayColor: '#000000',
  overlayOpacity: 35,

  layout: 'SPLIT',
  contentAlign: 'center',
  contentPosition: 'center',
  mediaPosition: 'right',

  contentMaxWidth: '640px',
  sectionHeight: 'lg',
  containerStyle: 'boxed',
  verticalPadding: 'lg',

  showButtons: true,
  showStats: true,
  showFeatures: false,
  showTrustItems: true,

  roundedMedia: true,
  glassEffect: false,
  blurBackground: false,
  shadowMedia: true,
  borderMedia: false,

  promoText: '',
  promoEndsAt: null,
  urgencyText: '',

  ariaLabel: '',
  sectionId: 'hero',

  stats: [],
  features: [],
  trustItems: [],
};

function mergeHero(value?: HeroSectionItem | null): HeroSectionItem {
  return {
    ...DEFAULT_HERO,
    ...value,
    stats: value?.stats ?? [],
    features: value?.features ?? [],
    trustItems: value?.trustItems ?? [],
  };
}

// ─── API calls — one per section ─────────────────────────────────────────────

async function apiSaveCore(storeId: string, hero: HeroSectionItem): Promise<{ id: string }> {
  const res = await fetch('/api/template/hero-section/core', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storeId, ...hero }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? 'فشل حفظ الإعدادات الأساسية');
  return data;
}

async function apiSaveImages(
  storeId: string,
  fields: Pick<
    HeroSectionItem,
    'heroImage' | 'heroImageMobile' | 'backgroundImage' | 'backgroundImageMobile'
  >
): Promise<void> {
  const res = await fetch('/api/template/hero-section/images', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storeId, ...fields }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? 'فشل حفظ الصور');
}

async function apiSaveStats(storeId: string, stats: HeroStatItem[]): Promise<HeroStatItem[]> {
  const res = await fetch('/api/template/hero-section/stats', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storeId, stats }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? 'فشل حفظ الإحصائيات');
  return data;
}

async function apiSaveFeatures(
  storeId: string,
  features: HeroFeatureItem[]
): Promise<HeroFeatureItem[]> {
  const res = await fetch('/api/template/hero-section/features', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storeId, features }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? 'فشل حفظ المميزات');
  return data;
}

async function apiSaveTrustItems(
  storeId: string,
  trustItems: HeroTrustItem[]
): Promise<HeroTrustItem[]> {
  const res = await fetch('/api/template/hero-section/trust-items', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storeId, trustItems }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? 'فشل حفظ عناصر الثقة');
  return data;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseHeroSectionEditorOptions {
  initialHero: HeroSectionItem | null | undefined;
  storeId: string;
}

export function useHeroSectionEditor({ initialHero, storeId }: UseHeroSectionEditorOptions) {
  const initialMerged = useMemo(() => mergeHero(initialHero), [initialHero]);

  const [hero, setHero] = useState<HeroSectionItem>(initialMerged);
  const [dirty, setDirty] = useState<DirtySections>(CLEAN);
  const [isSaving, setIsSaving] = useState(false);

  // Always-fresh refs so async callbacks never read stale closures
  const heroRef = useRef<HeroSectionItem>(initialMerged);
  const dirtyRef = useRef<DirtySections>(CLEAN);

  const patchHeroRef = (next: HeroSectionItem) => {
    heroRef.current = next;
    setHero(next);
  };

  const patchDirtyRef = (next: DirtySections) => {
    dirtyRef.current = next;
    setDirty(next);
  };

  const isDirty = Object.values(dirty).some(Boolean);

  // ─── Generic patch ────────────────────────────────────────────────────────
  const updateHero = useCallback((partial: Partial<HeroSectionItem>) => {
    setHero(prev => {
      const next = { ...prev, ...partial };
      heroRef.current = next;
      return next;
    });
    setDirty(prev => {
      const next = { ...prev, ...classifyPatch(partial) };
      dirtyRef.current = next;
      return next;
    });
  }, []);

  const setHeroValue = useCallback((value: HeroSectionItem) => {
    const merged = mergeHero(value);
    patchHeroRef(merged);
    patchDirtyRef({ core: true, images: true, stats: true, features: true, trustItems: true });
  }, []);

  // ─── Stats ────────────────────────────────────────────────────────────────
  const addStat = useCallback(() => {
    setHero(prev => {
      const next = {
        ...prev,
        stats: [
          ...prev.stats,
          {
            id: createId('stat'),
            label: '',
            value: '',
            icon: '',
            order: prev.stats.length,
            enabled: true,
          },
        ],
      };
      heroRef.current = next;
      return next;
    });
    setDirty(prev => {
      const n = { ...prev, stats: true };
      dirtyRef.current = n;
      return n;
    });
  }, []);

  const updateStat = useCallback((id: string, fields: Partial<HeroStatItem>) => {
    setHero(prev => {
      const next = { ...prev, stats: prev.stats.map(s => (s.id === id ? { ...s, ...fields } : s)) };
      heroRef.current = next;
      return next;
    });
    setDirty(prev => {
      const n = { ...prev, stats: true };
      dirtyRef.current = n;
      return n;
    });
  }, []);

  const removeStat = useCallback((id: string) => {
    setHero(prev => {
      const next = { ...prev, stats: prev.stats.filter(s => s.id !== id) };
      heroRef.current = next;
      return next;
    });
    setDirty(prev => {
      const n = { ...prev, stats: true };
      dirtyRef.current = n;
      return n;
    });
  }, []);

  // ─── Features ─────────────────────────────────────────────────────────────
  const addFeature = useCallback(() => {
    setHero(prev => {
      const next = {
        ...prev,
        features: [
          ...prev.features,
          {
            id: createId('feature'),
            title: '',
            desc: '',
            icon: '',
            image: null,
            link: '',
            order: prev.features.length,
            enabled: true,
          },
        ],
      };
      heroRef.current = next;
      return next;
    });
    setDirty(prev => {
      const n = { ...prev, features: true };
      dirtyRef.current = n;
      return n;
    });
  }, []);

  const updateFeature = useCallback((id: string, fields: Partial<HeroFeatureItem>) => {
    setHero(prev => {
      const next = {
        ...prev,
        features: prev.features.map(f => (f.id === id ? { ...f, ...fields } : f)),
      };
      heroRef.current = next;
      return next;
    });
    setDirty(prev => {
      const n = { ...prev, features: true };
      dirtyRef.current = n;
      return n;
    });
  }, []);

  const removeFeature = useCallback((id: string) => {
    setHero(prev => {
      const next = { ...prev, features: prev.features.filter(f => f.id !== id) };
      heroRef.current = next;
      return next;
    });
    setDirty(prev => {
      const n = { ...prev, features: true };
      dirtyRef.current = n;
      return n;
    });
  }, []);

  // ─── Trust Items ──────────────────────────────────────────────────────────
  const addTrustItem = useCallback(() => {
    setHero(prev => {
      const next = {
        ...prev,
        trustItems: [
          ...prev.trustItems,
          {
            id: createId('trust'),
            text: '',
            icon: '',
            order: prev.trustItems.length,
            enabled: true,
          },
        ],
      };
      heroRef.current = next;
      return next;
    });
    setDirty(prev => {
      const n = { ...prev, trustItems: true };
      dirtyRef.current = n;
      return n;
    });
  }, []);

  const updateTrustItem = useCallback((id: string, fields: Partial<HeroTrustItem>) => {
    setHero(prev => {
      const next = {
        ...prev,
        trustItems: prev.trustItems.map(t => (t.id === id ? { ...t, ...fields } : t)),
      };
      heroRef.current = next;
      return next;
    });
    setDirty(prev => {
      const n = { ...prev, trustItems: true };
      dirtyRef.current = n;
      return n;
    });
  }, []);

  const removeTrustItem = useCallback((id: string) => {
    setHero(prev => {
      const next = { ...prev, trustItems: prev.trustItems.filter(t => t.id !== id) };
      heroRef.current = next;
      return next;
    });
    setDirty(prev => {
      const n = { ...prev, trustItems: true };
      dirtyRef.current = n;
      return n;
    });
  }, []);

  // ─── Image uploads — save immediately, isolated ───────────────────────────
  // Upload → persist that single URL right away via PATCH /images.
  // This guarantees the URL is in the DB before any other save can run.

  const uploadAndPersistImage = useCallback(
    async (
      file: File,
      field: 'heroImage' | 'heroImageMobile' | 'backgroundImage' | 'backgroundImageMobile',
      successMsg: string,
      errorMsg: string
    ) => {
      try {
        const url = await uploadFile(file);

        // Lock into ref immediately so subsequent saves carry the new URL
        heroRef.current = { ...heroRef.current, [field]: url };
        setHero(heroRef.current);

        setIsSaving(true);
        await apiSaveImages(storeId, {
          heroImage: heroRef.current.heroImage ?? null,
          heroImageMobile: heroRef.current.heroImageMobile ?? null,
          backgroundImage: heroRef.current.backgroundImage ?? null,
          backgroundImageMobile: heroRef.current.backgroundImageMobile ?? null,
        });

        // Images are now clean in the DB
        setDirty(prev => {
          const n = { ...prev, images: false };
          dirtyRef.current = n;
          return n;
        });

        toast.success(successMsg);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : errorMsg);
      } finally {
        setIsSaving(false);
      }
    },
    [storeId]
  );

  const uploadHeroImage = useCallback(
    (file: File) =>
      uploadAndPersistImage(file, 'heroImage', 'تم رفع صورة الهيرو', 'فشل رفع صورة الهيرو'),
    [uploadAndPersistImage]
  );

  const uploadHeroMobileImage = useCallback(
    (file: File) =>
      uploadAndPersistImage(
        file,
        'heroImageMobile',
        'تم رفع صورة الهيرو للموبايل',
        'فشل رفع صورة الموبايل'
      ),
    [uploadAndPersistImage]
  );

  const uploadBackgroundImage = useCallback(
    (file: File) =>
      uploadAndPersistImage(file, 'backgroundImage', 'تم رفع صورة الخلفية', 'فشل رفع صورة الخلفية'),
    [uploadAndPersistImage]
  );

  const uploadBackgroundMobileImage = useCallback(
    (file: File) =>
      uploadAndPersistImage(
        file,
        'backgroundImageMobile',
        'تم رفع خلفية الموبايل',
        'فشل رفع خلفية الموبايل'
      ),
    [uploadAndPersistImage]
  );

  // ─── Manual save — only dirty sections ───────────────────────────────────
  const saveHero = useCallback(async () => {
    const currentHero = heroRef.current;
    const currentDirty = dirtyRef.current;

    if (!Object.values(currentDirty).some(Boolean)) {
      toast.info('لا توجد تغييرات للحفظ');
      return;
    }

    setIsSaving(true);

    const errors: string[] = [];
    const updatedHero = { ...currentHero };

    const tasks: Promise<void>[] = [];

    if (currentDirty.core) {
      tasks.push(
        apiSaveCore(storeId, currentHero)
          .then(res => {
            updatedHero.id = res.id;
          })
          .catch(e => {
            errors.push(e instanceof Error ? e.message : 'فشل حفظ الإعدادات الأساسية');
          })
      );
    }

    if (currentDirty.images) {
      tasks.push(
        apiSaveImages(storeId, {
          heroImage: currentHero.heroImage ?? null,
          heroImageMobile: currentHero.heroImageMobile ?? null,
          backgroundImage: currentHero.backgroundImage ?? null,
          backgroundImageMobile: currentHero.backgroundImageMobile ?? null,
        }).catch(e => {
          errors.push(e instanceof Error ? e.message : 'فشل حفظ الصور');
        })
      );
    }

    if (currentDirty.stats) {
      tasks.push(
        apiSaveStats(storeId, currentHero.stats)
          .then(saved => {
            updatedHero.stats = saved;
          })
          .catch(e => {
            errors.push(e instanceof Error ? e.message : 'فشل حفظ الإحصائيات');
          })
      );
    }

    if (currentDirty.features) {
      tasks.push(
        apiSaveFeatures(storeId, currentHero.features)
          .then(saved => {
            updatedHero.features = saved;
          })
          .catch(e => {
            errors.push(e instanceof Error ? e.message : 'فشل حفظ المميزات');
          })
      );
    }

    if (currentDirty.trustItems) {
      tasks.push(
        apiSaveTrustItems(storeId, currentHero.trustItems)
          .then(saved => {
            updatedHero.trustItems = saved;
          })
          .catch(e => {
            errors.push(e instanceof Error ? e.message : 'فشل حفظ عناصر الثقة');
          })
      );
    }

    await Promise.all(tasks);

    setIsSaving(false);

    const normalized = mergeHero(updatedHero);
    patchHeroRef(normalized);

    if (errors.length > 0) {
      // Keep only the sections that failed as dirty so the user can retry
      toast.error(`حُفظ جزئي — فشل: ${errors.join('، ')}`);
    } else {
      patchDirtyRef(CLEAN);
      toast.success('تم الحفظ بنجاح');
    }
  }, [storeId]);

  return {
    hero,
    setHeroValue,
    updateHero,
    isDirty,
    dirty, // expose for per-section save indicators in the UI if needed
    isSaving,
    saveHero,

    addStat,
    updateStat,
    removeStat,

    addFeature,
    updateFeature,
    removeFeature,

    addTrustItem,
    updateTrustItem,
    removeTrustItem,

    uploadHeroImage,
    uploadHeroMobileImage,
    uploadBackgroundImage,
    uploadBackgroundMobileImage,
  };
}

export type HeroSectionEditorController = ReturnType<typeof useHeroSectionEditor>;
