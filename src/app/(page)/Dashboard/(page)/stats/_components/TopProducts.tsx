import { useLanguage } from '../../../context/LanguageContext';
import { TopProduct } from '../types';

interface TopProductsProps {
  products: TopProduct[];
}

export function TopProducts({ products }: TopProductsProps) {
  const { lang, t } = useLanguage();
  const locale = lang === 'en' ? 'en-US' : lang === 'ku' ? 'ckb-IQ' : 'ar-IQ';

  if (!products || products.length === 0) return null;

  return (
    <div className="bg-card border-border rounded-xl border">
      <div className="p-4 pb-3">
        <h3 className="text-foreground text-sm font-semibold">{t.stats.topProducts}</h3>
      </div>
      <div className="divide-border divide-y">
        {products.map((product, index) => (
          <div key={index} className="flex items-center gap-3 px-4 py-3">
            <span className="bg-primary/10 text-primary flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-sm font-medium">{product.name}</p>
              <p className="text-muted-foreground text-[11px]">
                {product.sales.toLocaleString(locale)} {t.stats.salesUnit}
              </p>
            </div>
            <span className="text-foreground text-sm font-bold whitespace-nowrap">
              {product.revenue.toLocaleString(locale)}
              <span className="text-muted-foreground mr-1 text-[9px]">{t.currency}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
