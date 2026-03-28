function normalizeHex(value: string): string | null {
  const input = value.trim();

  if (!input.startsWith('#')) return null;

  const hex = input.slice(1);

  if (/^[0-9a-f]{3}$/i.test(hex)) {
    return `#${hex
      .split('')
      .map(char => `${char}${char}`)
      .join('')}`;
  }

  if (/^[0-9a-f]{6}$/i.test(hex)) {
    return `#${hex}`;
  }

  if (/^[0-9a-f]{8}$/i.test(hex)) {
    return `#${hex.slice(0, 6)}`;
  }

  return null;
}

function hexToRgb(value: string) {
  const normalized = normalizeHex(value);
  if (!normalized) return null;

  const hex = normalized.slice(1);
  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);

  return { red, green, blue };
}

function toLinear(channel: number) {
  const normalized = channel / 255;
  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

function getLuminance(value: string) {
  const rgb = hexToRgb(value);
  if (!rgb) return null;

  return 0.2126 * toLinear(rgb.red) + 0.7152 * toLinear(rgb.green) + 0.0722 * toLinear(rgb.blue);
}

export function getContrastRatio(left: string, right: string) {
  const leftLuminance = getLuminance(left);
  const rightLuminance = getLuminance(right);

  if (leftLuminance === null || rightLuminance === null) return null;

  const lighter = Math.max(leftLuminance, rightLuminance);
  const darker = Math.min(leftLuminance, rightLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

export function getReadableTextColor(background: string, light = '#ffffff', dark = '#111827') {
  const lightContrast = getContrastRatio(background, light);
  const darkContrast = getContrastRatio(background, dark);

  if (lightContrast === null || darkContrast === null) {
    return dark;
  }

  return lightContrast >= darkContrast ? light : dark;
}

export function getReadableAccentColor(
  foreground: string,
  background: string,
  fallback: string,
  minimumContrast = 3
) {
  const contrast = getContrastRatio(foreground, background);

  if (contrast === null) return fallback;

  return contrast >= minimumContrast ? foreground : fallback;
}
