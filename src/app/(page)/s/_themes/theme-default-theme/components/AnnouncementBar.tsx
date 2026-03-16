// THEME: default-theme - AnnouncementBar

import type { AnnouncementBarProps } from '../../../_lib/types';

export default function DefaultThemeAnnouncementBar({ config }: AnnouncementBarProps) {
  if (!config.enabled || !config.text?.trim()) return null;

  return (
    <div
      className="px-4 py-2 text-center text-xs font-semibold"
      style={{ backgroundColor: config.bgColor, color: config.textColor }}
    >
      {/* DESIGN: The reference storefront keeps announcements inline above the navbar, not as a floating promo. */}
      {config.text}
    </div>
  );
}
