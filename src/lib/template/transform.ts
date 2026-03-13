// src/lib/template/transform.ts
// Converts between Prisma DB records and the client-side TemplateFormState.
// Handles JSON field parsing with safe fallbacks.

import type { TemplateFormState, AnnouncementBarConfig, SectionsConfig } from './types';
import { DEFAULT_ANNOUNCEMENT_BAR, DEFAULT_SECTIONS_CONFIG, DEFAULT_TEMPLATE_STATE } from './defaults';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaTemplateRecord = Record<string, any>;

function parseJson<T>(raw: unknown, fallback: T): T {
  if (raw === null || raw === undefined) return fallback;
  if (typeof raw === 'object') return raw as T;
  try {
    return JSON.parse(raw as string) as T;
  } catch {
    return fallback;
  }
}

/**
 * toFormState — converts a Prisma StoreTemplate (with relations) into TemplateFormState.
 * Returns DEFAULT_TEMPLATE_STATE if record is null/undefined.
 */
export function toFormState(db: PrismaTemplateRecord | null | undefined): TemplateFormState {
  if (!db) {
    return DEFAULT_TEMPLATE_STATE;
  }

  const announcementBar = parseJson<AnnouncementBarConfig>(
    db.announcementBar,
    DEFAULT_ANNOUNCEMENT_BAR,
  );
  const sectionsConfig = parseJson<SectionsConfig>(db.sectionsConfig, DEFAULT_SECTIONS_CONFIG);

  return {
    tagline: db.tagline ?? '',
    heroButtonText: db.heroButtonText ?? 'تسوق الآن',
    heroSecondaryButton: db.heroSecondaryButton ?? 'تعرف علينا',
    aboutText: db.aboutText ?? '',
    storeDescription: db.storeDescription ?? '',
    ctaTitle: db.ctaTitle ?? '',
    ctaDesc: db.ctaDesc ?? '',
    ctaButton: db.ctaButton ?? 'ابدأ الآن',
    contactEmail: db.contactEmail ?? '',
    contactWebsite: db.contactWebsite ?? '',
    whatsappNumber: db.whatsappNumber ?? '',
    headingFont: db.headingFont ?? 'IBM Plex Sans Arabic',
    bodyFont: db.bodyFont ?? 'IBM Plex Sans Arabic',
    selectedPreset: db.selectedPreset ?? 0,
    useCustomColors: db.useCustomColors ?? false,
    colorPrimary: db.colorPrimary ?? '#6366f1',
    colorAccent: db.colorAccent ?? '#8b5cf6',
    colorBg: db.colorBg ?? '#0f0f14',
    colorText: db.colorText ?? '#f4f4f5',
    categoryDisplayMode: (db.categoryDisplayMode ?? 'icons') as 'icons' | 'pills',
    isDraft: db.isDraft ?? true,
    announcementBar,
    sectionsConfig,
    services: (db.services ?? []).map((s: PrismaTemplateRecord) => ({
      id: s.id,
      icon: s.icon,
      title: s.title,
      desc: s.desc ?? '',
      order: s.order,
    })),
    works: (db.works ?? []).map((w: PrismaTemplateRecord) => ({
      id: w.id,
      title: w.title,
      category: w.category ?? '',
      link: w.link ?? '',
      image: w.image ?? null,
      order: w.order,
    })),
    testimonials: (db.testimonials ?? []).map((t: PrismaTemplateRecord) => ({
      id: t.id,
      name: t.name,
      role: t.role ?? '',
      text: t.text,
      rating: t.rating,
      order: t.order,
    })),
    bannerImages: (db.bannerImages ?? []).map((b: PrismaTemplateRecord) => ({
      id: b.id,
      url: b.url,
      order: b.order,
    })),
    categorySections: (db.categorySections ?? []).map((cs: PrismaTemplateRecord) => ({
      id: cs.id,
      category: cs.category,
      enabled: cs.enabled,
      order: cs.order,
    })),
    categoryIcons: (db.categoryIcons ?? []).map((ci: PrismaTemplateRecord) => ({
      id: ci.id,
      category: ci.category,
      icon: ci.icon,
      image: ci.image ?? null,
    })),
    customFonts: (db.customFonts ?? []).map((f: PrismaTemplateRecord) => ({
      id: f.id,
      name: f.name,
      url: f.url,
    })),
  };
}

/**
 * toPayload — converts TemplateFormState scalar fields into the POST body for
 * /api/template (upsert). Does NOT include relation arrays.
 */
export function toPayload(
  state: TemplateFormState,
  storeId: string,
): Record<string, unknown> {
  return {
    storeId,
    tagline: state.tagline,
    heroButtonText: state.heroButtonText,
    heroSecondaryButton: state.heroSecondaryButton,
    aboutText: state.aboutText,
    storeDescription: state.storeDescription,
    ctaTitle: state.ctaTitle,
    ctaDesc: state.ctaDesc,
    ctaButton: state.ctaButton,
    contactEmail: state.contactEmail,
    contactWebsite: state.contactWebsite,
    whatsappNumber: state.whatsappNumber,
    headingFont: state.headingFont,
    bodyFont: state.bodyFont,
    selectedPreset: state.selectedPreset,
    useCustomColors: state.useCustomColors,
    colorPrimary: state.colorPrimary,
    colorAccent: state.colorAccent,
    colorBg: state.colorBg,
    colorText: state.colorText,
    categoryDisplayMode: state.categoryDisplayMode,
    isDraft: state.isDraft,
    announcementBar: state.announcementBar,
    sectionsConfig: state.sectionsConfig,
  };
}
