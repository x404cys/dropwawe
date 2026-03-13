// Purpose: Font style builders — converts template font fields into
// React.CSSProperties objects for spread into style props.

import { StorefrontTemplate } from '../_lib/types';

export interface FontStyles {
  headingStyle: React.CSSProperties;
  bodyStyle: React.CSSProperties;
}

export function buildFontStyles(template: StorefrontTemplate | null): FontStyles {
  const heading = template?.headingFont ?? 'IBM Plex Sans Arabic';
  const body = template?.bodyFont ?? 'IBM Plex Sans Arabic';
  return {
    headingStyle: { fontFamily: heading },
    bodyStyle: { fontFamily: body },
  };
}
