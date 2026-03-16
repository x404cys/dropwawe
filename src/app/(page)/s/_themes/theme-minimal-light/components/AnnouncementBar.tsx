// THEME: minimal-light — AnnouncementBar

import type { AnnouncementBarProps } from '../../../_lib/types';

export default function MinimalLightAnnouncementBar({ config }: AnnouncementBarProps) {
  if (!config.enabled || !config.text?.trim()) return null;

  return (
    <div
      className="fixed inset-x-0 top-0 z-[70] border-b border-stone-200 px-4 py-2.5 text-center text-[11px] font-medium tracking-[0.24em] uppercase"
      style={{ backgroundColor: config.bgColor, color: config.textColor }}
    >
      {config.text}
    </div>
  );
}
