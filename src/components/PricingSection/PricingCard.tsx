import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  delay?: number;
}

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  features,
  isPopular = false,
  delay = 0,
}) => {
  return (
    <div
      className={cn(
        'card-hover-glow animate-fade-in relative flex flex-col justify-between rounded-2xl p-8  -0',
        isPopular
          ? 'from-secondary to-card border-primary/30 border bg-gradient-to-b'
          : 'bg-card border-border border'
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {isPopular && (
        <div className="bg-primary text-primary-foreground absolute -top-4 right-8 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold">
          <Sparkles className="h-4 w-4" />
          <span>الأكثر شيوعاً</span>
        </div>
      )}

      <div>
        <h4
          className={cn('mb-2 text-2xl font-bold', isPopular ? 'gradient-text' : 'text-foreground')}
        >
          {name}
        </h4>
        <p className="text-muted-foreground mb-8 text-lg font-semibold">{price}</p>

        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li
              key={feature}
              className="animate-fade-in flex items-start gap-3  -0"
              style={{ animationDelay: `${delay + index * 50}ms` }}
            >
              <div
                className={cn(
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                  isPopular ? 'bg-primary/20' : 'bg-success/20'
                )}
              >
                <Check className={cn('h-3 w-3', isPopular ? 'text-primary' : 'text-success')} />
              </div>
              <span className="text-muted-foreground leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        className={cn(
          'mt-8 w-full rounded-xl py-4 font-semibold transition-all duration-300',
          isPopular
            ? 'bg-primary text-primary-foreground hover:shadow-primary/25 hover: -90 hover:shadow-lg'
            : 'gradient-border bg-secondary text-foreground hover:bg-muted'
        )}
      >
        اختر هذه الباقة
      </button>
    </div>
  );
};

export default PricingCard;
