// Purpose: Announcement bar — Server Component, renders at top of page when enabled.

import { AnnouncementBarConfig } from '../_lib/types';

interface AnnouncementBarProps {
  config: AnnouncementBarConfig;
}

export default function AnnouncementBar({ config }: AnnouncementBarProps) {
  if (!config.enabled) return null;

  return (
    <div
      className="text-center py-2 px-4 text-xs font-semibold"
      style={{ backgroundColor: config.bgColor, color: config.textColor }}
    >
      {config.text}
    </div>
  );
}
