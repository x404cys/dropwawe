import type { AnnouncementBarProps } from '../../../_lib/types';

export default function DefaultThemeAnnouncementBar({ config }: AnnouncementBarProps) {
  if (!config.enabled || !config.text?.trim()) return null;

  return (
    <div
      className="px-4 py-2 text-center text-[11px] font-medium tracking-[0.01em]"
      style={{
        backgroundColor: config.bgColor || 'var(--store-surface)',
        color: config.textColor || 'var(--store-text-soft)',
        borderBottom: '1px solid var(--store-border)',
      }}
    >
      <span className="mx-auto block max-w-[var(--store-max-width)] truncate">{config.text}</span>
    </div>
  );
}
