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
import { Check, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleConfirmSubscription = async () => {
    if (!onClick) return;
    setLoading(true);

    try {
      await onClick(planType ?? '');
      setDialogOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            onClick={handleOpenDialog}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="text-center sm:max-w-[400px]">
          <div className="mt-4 flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <DialogHeader>
            <DialogTitle>تأكيد الاشتراك</DialogTitle>
            <DialogDescription className="mt-2">
              هل أنت متأكد من الاشتراك في خطة <strong>{name}</strong>؟
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-center gap-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleConfirmSubscription} disabled={loading}>
              {loading ? 'جارٍ الاشتراك...' : 'تأكيد الاشتراك'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
