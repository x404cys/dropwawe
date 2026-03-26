interface ProductModalActionsProps {
  backgroundColor: string;
  primaryColor: string;
  total: number;
  currencyLabel: string;
  totalLabel: string;
  addToCartLabel: string;
  buyNowLabel: string;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export default function ProductModalActions({
  backgroundColor,
  primaryColor,
  total,
  currencyLabel,
  totalLabel,
  addToCartLabel,
  buyNowLabel,
  onAddToCart,
  onBuyNow,
}: ProductModalActionsProps) {
  return (
    <div style={{ background: backgroundColor }} className="sticky bottom-0 border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-muted-foreground text-xs">{totalLabel}</p>
          <p className="text-xl font-bold">
            {total} {currencyLabel}
          </p>
        </div>

        <div className="flex w-full gap-3 lg:w-auto">
          <button
            onClick={onAddToCart}
            className="h-12 flex-1 rounded-lg border px-6 text-sm font-semibold transition hover:bg-[var(--muted)] lg:flex-none"
          >
            {addToCartLabel}
          </button>

          <button
            onClick={onBuyNow}
            className="h-12 flex-[1.2] rounded-lg px-8 text-sm font-semibold text-white transition active:scale-[0.98] lg:flex-none"
            style={{ backgroundColor: primaryColor }}
          >
            {buyNowLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
