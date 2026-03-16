// THEME: clean-marketplace - AnnouncementBar

import type { AnnouncementBarProps } from '../../../_lib/types';

export default function CleanMarketplaceAnnouncementBar({ config }: AnnouncementBarProps) {
  if (!config.enabled || !config.text?.trim()) return null;

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] border-b border-gray-100 px-4 py-2 text-center text-xs font-medium text-gray-700"
      style={{ backgroundColor: config.bgColor, color: config.textColor }}
    >
      {/* DESIGN: The bar stays quiet and app-like so alerts do not overpower the shopping surface. */}
      {config.text}
    </div>
  );
}
