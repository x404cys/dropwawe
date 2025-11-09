import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant?: 'default' | 'secondary' | 'outline';
  recommended?: boolean;
  onClick?: (type: string) => void;
  planType?: string;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  buttonText,
  buttonVariant = 'default',
  recommended = false,
  onClick,
  planType,
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        'border-border bg-card relative flex flex-col transition-all hover:shadow-lg',
        recommended && 'border-accent shadow-md'
      )}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-accent text-accent-foreground border-accent">Recommended</Badge>
        </div>
      )}
      <CardHeader className="pb-8">
        <CardTitle className="text-card-foreground text-2xl font-bold">{name}</CardTitle>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-card-foreground text-5xl font-bold tracking-tight">{price}</span>
          <span className="text-muted-foreground">{period}</span>
        </div>
        <CardDescription className="text-muted-foreground mt-4 text-base">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-3">
          {features.map(feature => (
            <li key={feature} className="flex items-start gap-3">
              <Check className="text-accent mt-0.5 h-5 w-5 shrink-0" />
              <span className="text-card-foreground text-sm leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onClick?.(planType ?? '')}
          variant={buttonVariant}
          className={cn(
            'w-full',
            recommended &&
              buttonVariant === 'default' &&
              'bg-primary text-primary-foreground hover:bg-primary/90'
          )}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
