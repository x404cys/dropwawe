import type { CSSProperties } from 'react';

interface ProductModalInfoProps {
  name: string;
  price: number;
  finalPrice: number;
  discount: number;
  discountValue: number;
  description?: string;
  headingStyle: CSSProperties;
  primaryColor: string;
  currencyLabel: string;
  youSaveLabel: string;
}

export default function ProductModalInfo({
  name,
  price,
  finalPrice,
  discount,
  discountValue,
  description,
  headingStyle,
  primaryColor,
  currencyLabel,
  youSaveLabel,
}: ProductModalInfoProps) {
  return (
    <>
      <div>
        <h1 className="text-3xl leading-tight font-bold" style={headingStyle}>
          {name}
        </h1>
      </div>

      <div>
        <div className="flex items-end gap-3">
          <span className="text-4xl font-extrabold" style={{ color: primaryColor }}>
            {finalPrice}
          </span>

          <span className="text-muted-foreground text-sm">{currencyLabel}</span>
        </div>

        {(discount ?? 0) > 0 && (
          <div className="mt-2 flex items-center gap-3">
            <span className="text-muted-foreground text-sm line-through">{price}</span>

            <span className="text-sm font-semibold text-green-600">
              {youSaveLabel} {discountValue} {currencyLabel}
            </span>
          </div>
        )}
      </div>

      {description && <p className="text-muted-foreground text-sm leading-7">{description}</p>}
    </>
  );
}
