/**
 
 * @param price  
 * @param discount  
 * @returns  
 */
export function calculateDiscountedPrice(price: number, discount: number): number {
  if (!price || price <= 0) return 0;
  if (!discount || discount < 0) discount = 0;
  if (discount > 100) discount = 100;

  const discounted = price * (1 - discount / 100);
  return Math.round(discounted / 250) * 250;
}

export function formatIQD(
  value: number | string | null | undefined,
  options?: { suffix?: string; useArabicDigits?: boolean }
): string {
  if (value === null || value === undefined || value === '') return '';

  const { suffix = '', useArabicDigits = false } = options ?? {};

  let s = String(value).trim();

  if (useArabicDigits) {
    s = s.replace(/[\u0660-\u0669\u06F0-\u06F9]/g, ch =>
      String.fromCharCode(ch.charCodeAt(0) & 0xf)
    );
  }

  const sign = s.startsWith('-') ? '-' : '';
  if (sign) s = s.slice(1);

  const parts = s.split(/[.,]/);
  let intPart = parts[0].replace(/\D+/g, '') || '0';
  const fracPart = parts.length > 1 ? parts.slice(1).join('') : '';

  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const formatted = fracPart ? `${intPart}.${fracPart}` : intPart;
  return `${sign}${formatted}${suffix}`;
}
