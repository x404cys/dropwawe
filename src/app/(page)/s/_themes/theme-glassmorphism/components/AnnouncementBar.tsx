// THEME: glassmorphism — AnnouncementBar

import type { AnnouncementBarProps } from '../../../_lib/types';

export default function GlassmorphismAnnouncementBar({ config }: AnnouncementBarProps) {
  if (!config.enabled || !config.text?.trim()) return null;

  return (
    <div
      className="fixed inset-x-0 top-0 z-[55] border-b border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-center text-xs tracking-widest text-white/70 backdrop-blur-sm"
      style={
        config.bgColor
          ? { backgroundColor: `${config.bgColor}20`, color: config.textColor || undefined }
          : { color: config.textColor || undefined }
      }
    >
      {/* DESIGN: The announcement bar is kept translucent so it reads as another layer of glass rather than a solid strip. */}
      {config.text}
    </div>
  );
}
