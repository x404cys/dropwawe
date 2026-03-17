import type { CSSProperties } from 'react';

export const storefrontContainerClass =
  'mx-auto w-full max-w-[var(--store-max-width)] px-4 sm:px-6 lg:px-10';

export const storefrontSectionClass = 'py-14 sm:py-20 lg:py-24';
export const storefrontSectionCompactClass = 'py-12 sm:py-16 lg:py-20';
export const storefrontSectionTightClass = 'py-10 sm:py-12 lg:py-16';

export const storefrontTitleClass =
  'text-2xl font-bold tracking-[-0.02em] sm:text-3xl lg:text-[2.5rem]';

export const storefrontSubtitleClass = 'max-w-2xl text-sm leading-7 sm:text-base sm:leading-8';

export const surfaceStyle: CSSProperties = {
  backgroundColor: 'var(--store-surface)',
};

export const surfaceStrongStyle: CSSProperties = {
  backgroundColor: 'var(--store-surface-strong)',
};

export const pageStyle: CSSProperties = {
  backgroundColor: 'var(--store-bg)',
  color: 'var(--store-text)',
};

export const mutedTextStyle: CSSProperties = {
  color: 'var(--store-text-muted)',
};

export const softTextStyle: CSSProperties = {
  color: 'var(--store-text-soft)',
};

export const faintTextStyle: CSSProperties = {
  color: 'var(--store-text-faint)',
};

export const borderStyle: CSSProperties = {
  borderColor: 'var(--store-border)',
};

export const borderStrongStyle: CSSProperties = {
  borderColor: 'var(--store-border-strong)',
};

export const primarySoftStyle: CSSProperties = {
  backgroundColor: 'var(--store-primary-soft)',
};

export const primaryFaintStyle: CSSProperties = {
  backgroundColor: 'var(--store-primary-faint)',
};

export const accentSoftStyle: CSSProperties = {
  backgroundColor: 'var(--store-accent-soft)',
};
