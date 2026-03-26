import { ArrowRight } from 'lucide-react';

interface ProductModalHeaderProps {
  title: string;
  backgroundColor: string;
  onClose: () => void;
}

export default function ProductModalHeader({
  title,
  backgroundColor,
  onClose,
}: ProductModalHeaderProps) {
  return (
    <div style={{ background: backgroundColor }} className="sticky top-0 z-30 border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-lg border"
        >
          <ArrowRight className="h-4 w-4" />
        </button>

        <p className="truncate text-sm font-semibold">{title}</p>

        <div className="w-10" />
      </div>
    </div>
  );
}
