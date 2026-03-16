// THEME: modern-structured — AnnouncementBar

import type { AnnouncementBarProps } from '../../../_lib/types';

export default function ModernStructuredAnnouncementBar({ config }: AnnouncementBarProps) {
  if (!config.enabled || !config.text?.trim()) return null;

  return (
    <div
      className="px-4 py-2.5 text-center text-xs font-medium tracking-wide text-white"
      style={{ backgroundColor: config.bgColor || config.textColor }}
    >
      {/* DESIGN: The announcement bar is the only full-bleed accent surface, so it cleanly anchors the page from the top. */}
      {config.text}
    </div>
  );
}
