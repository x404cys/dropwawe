import { AnnouncementBarConfig } from '../_lib/types';

interface AnnouncementBarProps {
  config: AnnouncementBarConfig;
}

export default function AnnouncementBar({ config }: AnnouncementBarProps) {
  if (!config.enabled || !config.text?.trim()) return null;

  return (
    <div
      // REDESIGN: fix the announcement bar as a restrained top strip with luxury typography.
      className="fixed inset-x-0 top-0 z-[70] border-b border-white/10 px-4 py-3 text-center text-[10px] font-light tracking-[0.32em] uppercase"
      style={{ backgroundColor: config.bgColor, color: config.textColor }}
    >
      {config.text}
    </div>
  );
}
