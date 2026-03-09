export function detectDevice(ua: string): 'Mobile' | 'Tablet' | 'Desktop' {
  const u = ua.toLowerCase();
  if (/tablet|ipad|playbook|silk/.test(u)) return 'Tablet';
  if (/mobile|android|iphone|ipod|blackberry|windows phone/.test(u)) return 'Mobile';
  return 'Desktop';
}

export function detectOS(ua: string): string {
  const u = ua.toLowerCase();
  if (/iphone|ipad|ipod/.test(u)) return 'iOS';
  if (/android/.test(u)) return 'Android';
  if (/windows/.test(u)) return 'Windows';
  if (/mac/.test(u)) return 'macOS';
  if (/linux/.test(u)) return 'Linux';
  return 'Other';
}
