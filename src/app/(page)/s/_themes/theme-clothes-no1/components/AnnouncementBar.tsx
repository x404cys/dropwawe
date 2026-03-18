// THEME: tech-futuristic - AnnouncementBar

import type { AnnouncementBarProps } from '../../../_lib/types';

export default function TechFuturisticAnnouncementBar({ config }: AnnouncementBarProps) {
  if (!config.enabled || !config.text?.trim()) return null;

  return (
    <div
      className="fixed inset-x-0 top-0 z-[70] border-b border-white/[0.06] bg-[#0f0f0f] px-4 py-2 text-center font-mono text-xs tracking-[0.24em] text-white/45 uppercase"
      style={{ borderTop: `1px solid ${config.textColor || '#ffffff'}`, color: config.textColor }}
    >
      {/* DESIGN: The blinking cursor frames the message like a live system broadcast. */}
      {config.text} <span className="animate-pulse">▮</span>
    </div>
  );
}
