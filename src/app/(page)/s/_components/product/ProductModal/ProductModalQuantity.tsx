import { Minus, Plus } from 'lucide-react';

interface ProductModalQuantityProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  label: string;
}

export default function ProductModalQuantity({
  quantity,
  onDecrease,
  onIncrease,
  label,
}: ProductModalQuantityProps) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold">{label}</p>

      <div className="container flex w-32 items-center rounded-lg border">
        <button
          onClick={onDecrease}
          className="flex h-10 w-10 items-center justify-center hover:bg-[var(--muted)]"
        >
          <Minus className="h-4 w-4" />
        </button>

        <div className="min-w-[60px] text-center font-semibold">{quantity}</div>

        <button
          onClick={onIncrease}
          className="flex h-10 w-10 items-center justify-center hover:bg-[var(--muted)]"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
