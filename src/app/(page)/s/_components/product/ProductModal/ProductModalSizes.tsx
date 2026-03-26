import type { StorefrontProduct } from '../../../_lib/types';

interface ProductModalSizesProps {
  sizes: StorefrontProduct['sizes'];
  selectedSize: string | null;
  selectedSizeLabel: string | null;
  onSelect: (sizeId: string) => void;
  primaryColor: string;
  label: string;
}

export default function ProductModalSizes({
  sizes,
  selectedSize,
  selectedSizeLabel,
  onSelect,
  primaryColor,
  label,
}: ProductModalSizesProps) {
  if (!sizes || sizes.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="mb-3 text-sm font-semibold">{label}</p>

      <div className="flex flex-wrap gap-2">
        {sizes.map(size => {
          const active = selectedSize === size.id;

          return (
            <button
              key={size.id}
              onClick={() => onSelect(size.id)}
              className={`rounded-lg border px-4 py-2 text-sm transition ${
                active ? 'border-transparent text-white' : 'hover:bg-[var(--muted)]'
              }`}
              style={active ? { backgroundColor: primaryColor } : undefined}
            >
              {size.size}
            </button>
          );
        })}
      </div>

      {selectedSizeLabel && (
        <p className="text-muted-foreground mt-2 text-xs">المحدد: {selectedSizeLabel}</p>
      )}
    </div>
  );
}
