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
import { Check, CheckCircle2, Zap } from 'lucide-react';
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
  r: string;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  r,
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
          'relative flex flex-col h-full rounded-3xl transition-all duration-300',
          recommended 
            ? 'border-primary shadow-xl shadow-primary/10 bg-card z-10 scale-100 md:scale-105' 
            : 'border-border/50 shadow-sm hover:shadow-md bg-card/50 hover:bg-card'
        )}
      >
        {recommended && (
          <div className="absolute -top-4 left-0 right-0 flex justify-center z-20">
            <div className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-md">
              <Zap className="w-3.5 h-3.5 fill-current" />
              الأكثر طلباً
            </div>
          </div>
        )}
        
        <CardHeader className="pb-6 p-6 md:p-8">
          <CardTitle className="text-xl md:text-2xl font-bold text-foreground">{name}</CardTitle>
          <CardDescription className="text-sm md:text-base text-muted-foreground mt-2 line-clamp-2 min-h-[40px]">
            {description}
          </CardDescription>
          
          <div className="mt-6 flex flex-wrap items-baseline gap-1 text-right">
            <span className="text-4xl md:text-5xl font-black text-foreground tracking-tight">{price}</span>
            {period && <span className="text-sm font-medium text-muted-foreground">{period}</span>}
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-6 md:p-8 pt-0 md:pt-0 space-y-8">
          <ul className="space-y-4">
            {features.map(feature => (
              <li key={feature} className="flex items-start gap-3">
                <div className={cn(
                  "flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full mt-0.5",
                  recommended ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm text-foreground/90 font-medium leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
          
          {r && (
            <div className="p-4 bg-muted/50 rounded-2xl border border-border/50">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">رسوم المعاملات والبوابات</span>
              <p className="text-xs font-semibold text-foreground leading-snug">{r}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-6 md:p-8 pt-0 md:pt-0">
          <Button
            onClick={handleOpenDialog}
            variant={recommended ? 'default' : buttonVariant}
            className={cn(
              "w-full h-12 rounded-xl text-base font-bold transition-all active:scale-[0.98]",
              recommended 
                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                : "hover:bg-muted"
            )}
          >
            {buttonText}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="text-center sm:max-w-[400px] border-border/50 rounded-3xl p-8">
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-2xl font-bold text-center">تأكيد الاشتراك</DialogTitle>
              <DialogDescription className="text-base text-center">
                هل أنت متأكد من الاشتراك في خطة <span className="font-bold text-foreground block mt-1">{name}</span>
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col sm:flex-row w-full gap-3 mt-4">
              <Button
                variant="outline"
                className="w-full sm:flex-1 h-12 rounded-xl font-bold"
                onClick={() => setDialogOpen(false)}
                disabled={loading}
              >
                إلغاء
              </Button>
              <Button
                className="w-full sm:flex-1 h-12 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleConfirmSubscription}
                disabled={loading}
              >
                {loading ? 'جاري الاشتراك...' : 'تأكيد'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
