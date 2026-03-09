export function classifyReferrer(ref: string | null): string {
  if (!ref) return 'مباشر';
  const r = ref.toLowerCase();
  if (r.includes('google') || r.includes('bing') || r.includes('yahoo') || r.includes('duckduckgo'))
    return 'محركات بحث';
  if (r.includes('facebook') || r.includes('fb.')) return 'فيسبوك';
  if (r.includes('instagram')) return 'انستغرام';
  if (
    r.includes('tiktok') ||
    r.includes('twitter') ||
    r.includes('t.co') ||
    r.includes('snapchat') ||
    r.includes('telegram')
  )
    return 'سوشيال ميديا';
  return 'إحالة';
}
